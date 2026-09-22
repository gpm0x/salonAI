import type { FastifyInstance } from "fastify"
import type Stripe from "stripe"
import { prisma } from "@/shared/infrastructure/prisma/client"
import { env } from "../config/env"
import { getStripeClient } from "@/modules/billing/infra/stripe-client"
import { ProcessStripeEventUseCase } from "@/modules/billing/application/use-cases/process-stripe-event.use-case"

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

    const stripe = getStripeClient()
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(request.body as Buffer, sig, secret, 300)
    } catch {
      return reply.status(400).send({ error: "Invalid webhook signature" })
    }

    const result = await new ProcessStripeEventUseCase(prisma).execute(event)
    if (result.duplicate) {
      return reply.status(200).send({ received: true, duplicate: true })
    }

    return reply.status(200).send({ received: true })
  })
}
