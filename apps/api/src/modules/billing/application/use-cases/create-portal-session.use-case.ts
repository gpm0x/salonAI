import type { UseCase } from "@/shared/application/use-case"
import type { IBillingRepository } from "../../domain/billing.repository"
import { getStripeClient } from "../../infra/stripe-client"
import { ConflictError, NotFoundError } from "@/shared/domain/errors"
import { env } from "@/config/env"

interface Input {
  organizationId: string
}

interface Output {
  url: string
}

const DEFAULT_FRONTEND_URL = "http://localhost:3000"

export class CreatePortalSessionUseCase implements UseCase<Input, Output> {
  constructor(private readonly repo: IBillingRepository) {}

  async execute({ organizationId }: Input): Promise<Output> {
    const organization = await this.repo.findById(organizationId)
    if (!organization) throw new NotFoundError("Organizacao nao encontrada")
    if (!organization.stripeCustomerId) {
      throw new ConflictError("Organizacao ainda nao possui uma assinatura Stripe")
    }

    const stripe = getStripeClient()
    const frontendUrl = env.frontendUrl ?? DEFAULT_FRONTEND_URL

    const session = await stripe.billingPortal.sessions.create({
      customer: organization.stripeCustomerId,
      return_url: `${frontendUrl}/dashboard/assinatura`,
    })

    return { url: session.url }
  }
}
