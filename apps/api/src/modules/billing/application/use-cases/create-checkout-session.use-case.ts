import type { UseCase } from "@/shared/application/use-case"
import type { IBillingRepository } from "../../domain/billing.repository"
import { getStripeClient } from "../../infra/stripe-client"
import { NotFoundError, ServiceUnavailableError } from "@/shared/domain/errors"
import { env } from "@/config/env"

interface Input {
  organizationId: string
  userEmail: string
}

interface Output {
  url: string
}

const DEFAULT_FRONTEND_URL = "http://localhost:3000"

export class CreateCheckoutSessionUseCase implements UseCase<Input, Output> {
  constructor(private readonly repo: IBillingRepository) {}

  async execute({ organizationId, userEmail }: Input): Promise<Output> {
    if (!env.stripePriceEssentialMonthly) {
      throw new ServiceUnavailableError("Plano Essencial nao esta configurado neste ambiente")
    }

    const organization = await this.repo.findById(organizationId)
    if (!organization) throw new NotFoundError("Organizacao nao encontrada")

    const stripe = getStripeClient()
    const frontendUrl = env.frontendUrl ?? DEFAULT_FRONTEND_URL

    let stripeCustomerId = organization.stripeCustomerId
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: { organizationId },
      })
      stripeCustomerId = customer.id
      await this.repo.saveStripeCustomerId(organizationId, stripeCustomerId)
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      line_items: [{ price: env.stripePriceEssentialMonthly, quantity: 1 }],
      success_url: `${frontendUrl}/dashboard?upgraded=true`,
      cancel_url: `${frontendUrl}/dashboard/assinatura`,
      client_reference_id: organizationId,
      metadata: { organizationId },
    })

    if (!session.url) throw new ServiceUnavailableError("Nao foi possivel iniciar o checkout")

    return { url: session.url }
  }
}
