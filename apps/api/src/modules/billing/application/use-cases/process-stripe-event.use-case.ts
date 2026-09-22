import type { PrismaClient, Prisma } from "@prisma/client"
import type Stripe from "stripe"
import { mapStripeSubscriptionStatus } from "../../domain/stripe-status-mapper"
import { getStripeClient } from "../../infra/stripe-client"
import { invalidatePlanCache } from "@/shared/infrastructure/plugins/require-plan.plugin"

type Tx = Prisma.TransactionClient

interface SubscriptionUpdate {
  subscriptionStatus: string
  stripeSubscriptionId?: string
}

export interface ProcessStripeEventResult {
  duplicate: boolean
}

function customerIdOf(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null,
): string | undefined {
  return typeof customer === "string" ? customer : undefined
}

/**
 * Processa um evento do Stripe de forma idempotente: o registro em StripeEvent
 * (dedupe) e a mutacao de Organization acontecem na MESMA transacao. Se o
 * handler falhar, a transacao inteira e revertida (o evento nao fica marcado
 * como processado) e a Stripe reenvia o evento no proximo retry.
 *
 * Chamadas externas (Stripe API) sao resolvidas ANTES de abrir a transacao
 * (`resolveExternalData`): nunca segura lock de banco esperando I/O de rede.
 */
export class ProcessStripeEventUseCase {
  constructor(private readonly prisma: PrismaClient) {}

  async execute(event: Stripe.Event): Promise<ProcessStripeEventResult> {
    const external = await this.resolveExternalData(event)

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.stripeEvent.create({ data: { id: event.id, type: event.type } })
        await this.handle(tx, event, external)
      })
      return { duplicate: false }
    } catch (err: unknown) {
      // P2002 = unique constraint violation → evento ja processado antes
      if ((err as { code?: string }).code === "P2002") return { duplicate: true }
      throw err
    }
  }

  /** Resolve dados que exigem chamar a API do Stripe, fora de qualquer transacao de banco. */
  private async resolveExternalData(event: Stripe.Event): Promise<{ checkoutSubscriptionStatus?: string }> {
    if (event.type !== "checkout.session.completed") return {}

    const session = event.data.object as Stripe.Checkout.Session
    const stripeSubscriptionId = typeof session.subscription === "string" ? session.subscription : undefined
    if (!stripeSubscriptionId) return {}

    const subscription = await getStripeClient().subscriptions.retrieve(stripeSubscriptionId)
    return { checkoutSubscriptionStatus: mapStripeSubscriptionStatus(subscription.status) }
  }

  private async handle(
    tx: Tx,
    event: Stripe.Event,
    external: { checkoutSubscriptionStatus?: string },
  ): Promise<void> {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const organizationId = session.metadata?.organizationId ?? session.client_reference_id ?? undefined
        const stripeCustomerId = customerIdOf(session.customer)
        const stripeSubscriptionId =
          typeof session.subscription === "string" ? session.subscription : undefined

        const subscriptionStatus = external.checkoutSubscriptionStatus ?? "active"

        if (organizationId) {
          await this.setStatusByOrganizationId(tx, organizationId, {
            subscriptionStatus,
            stripeSubscriptionId,
            stripeCustomerId,
          })
        } else if (stripeCustomerId) {
          await this.setStatusByCustomerId(tx, stripeCustomerId, {
            subscriptionStatus,
            stripeSubscriptionId,
          })
        }
        break
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription
        const stripeCustomerId = customerIdOf(sub.customer)
        if (stripeCustomerId) {
          await this.setStatusByCustomerId(tx, stripeCustomerId, {
            subscriptionStatus: mapStripeSubscriptionStatus(sub.status),
            stripeSubscriptionId: sub.id,
          })
        }
        break
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription
        const stripeCustomerId = customerIdOf(sub.customer)
        if (stripeCustomerId) {
          await this.setStatusByCustomerId(tx, stripeCustomerId, {
            subscriptionStatus: "canceled",
            stripeSubscriptionId: sub.id,
          })
        }
        break
      }
      case "invoice.payment_failed": {
        const inv = event.data.object as Stripe.Invoice
        const stripeCustomerId = customerIdOf(inv.customer)
        if (inv.subscription && stripeCustomerId) {
          await this.setStatusByCustomerId(tx, stripeCustomerId, { subscriptionStatus: "past_due" })
        }
        break
      }
      case "invoice.payment_succeeded": {
        const inv = event.data.object as Stripe.Invoice
        const stripeCustomerId = customerIdOf(inv.customer)
        if (inv.subscription && stripeCustomerId) {
          await this.setStatusByCustomerId(tx, stripeCustomerId, { subscriptionStatus: "active" })
        }
        break
      }
      default:
        break
    }
  }

  private async setStatusByCustomerId(
    tx: Tx,
    stripeCustomerId: string,
    update: SubscriptionUpdate,
  ): Promise<void> {
    const organization = await tx.organization.findUnique({
      where: { stripeCustomerId },
      select: { id: true },
    })
    if (!organization) return

    await tx.organization.update({ where: { id: organization.id }, data: update })
    invalidatePlanCache(organization.id)
  }

  private async setStatusByOrganizationId(
    tx: Tx,
    organizationId: string,
    update: SubscriptionUpdate & { stripeCustomerId?: string },
  ): Promise<void> {
    await tx.organization.update({ where: { id: organizationId }, data: update })
    invalidatePlanCache(organizationId)
  }
}
