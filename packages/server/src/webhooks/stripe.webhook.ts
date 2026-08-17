import type { FastifyInstance } from "fastify"
import Stripe from "stripe"
import { prisma } from "@/shared/infrastructure/prisma/client"
import { env } from "../config/env"

async function markEventProcessed(eventId: string, eventType: string): Promise<boolean> {
  try {
    await prisma.stripeEvent.create({ data: { id: eventId, type: eventType } })
    return true
  } catch (err: unknown) {
    // P2002 = unique constraint violation → evento já processado
    if ((err as { code?: string }).code === "P2002") return false
    throw err
  }
}

async function setSubscriptionStatus(
  stripeCustomerId: string,
  status: string,
  stripeSubscriptionId: string,
): Promise<void> {
  await prisma.organization.updateMany({
    where: { stripeCustomerId },
    data: { subscriptionStatus: status, stripeSubscriptionId },
  })
}

export async function stripeWebhookRoutes(app: FastifyInstance) {
  app.addContentTypeParser("application/json", { parseAs: "buffer" }, (_req, body, done) => {
    done(null, body)
  })

  app.post("/", async (request, reply) => {
    const sig = request.headers["stripe-signature"]
    const secret = env.stripeWebhookSecret

    if (!secret || !env.stripeSecretKey) {
      return reply.status(503).send({ error: "Stripe not configured" })
    }

    if (!sig || typeof sig !== "string") {
      return reply.status(400).send({ error: "Missing stripe-signature header" })
    }

    const stripe = new Stripe(env.stripeSecretKey)
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(request.body as Buffer, sig, secret, 300)
    } catch {
      return reply.status(400).send({ error: "Invalid webhook signature" })
    }

    const processed = await markEventProcessed(event.id, event.type)
    if (!processed) {
      return reply.status(200).send({ received: true, duplicate: true })
    }

    const obj = event.data.object as Stripe.Subscription | Stripe.Invoice

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = obj as Stripe.Subscription
        await setSubscriptionStatus(
          sub.customer as string,
          sub.status,
          sub.id,
        )
        break
      }
      case "customer.subscription.deleted": {
        const sub = obj as Stripe.Subscription
        await setSubscriptionStatus(sub.customer as string, "canceled", sub.id)
        break
      }
      case "invoice.payment_failed": {
        const inv = obj as Stripe.Invoice
        if (inv.subscription) {
          await prisma.organization.updateMany({
            where: { stripeCustomerId: inv.customer as string },
            data: { subscriptionStatus: "past_due" },
          })
        }
        break
      }
      case "invoice.payment_succeeded": {
        const inv = obj as Stripe.Invoice
        if (inv.subscription) {
          await prisma.organization.updateMany({
            where: { stripeCustomerId: inv.customer as string },
            data: { subscriptionStatus: "active" },
          })
        }
        break
      }
      default:
        break
    }

    return reply.status(200).send({ received: true })
  })
}
