import type { FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "@/shared/infrastructure/prisma/client"
import { PrismaBillingRepository } from "../infra/prisma/prisma-billing.repository"
import { CreateCheckoutSessionUseCase } from "../application/use-cases/create-checkout-session.use-case"
import { CreatePortalSessionUseCase } from "../application/use-cases/create-portal-session.use-case"

const makeRepo = () => new PrismaBillingRepository(prisma)

export async function createCheckoutSessionController(request: FastifyRequest, reply: FastifyReply) {
  const { url } = await new CreateCheckoutSessionUseCase(makeRepo()).execute({
    organizationId: request.organizationId,
    userEmail: request.user.email,
  })
  return reply.send({ url })
}

export async function createPortalSessionController(request: FastifyRequest, reply: FastifyReply) {
  const { url } = await new CreatePortalSessionUseCase(makeRepo()).execute({
    organizationId: request.organizationId,
  })
  return reply.send({ url })
}
