import type { FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "@/shared/infrastructure/prisma/client"
import { PrismaOnboardingRepository } from "../infra/prisma/prisma-onboarding.repository"
import { GetOnboardingStatusUseCase } from "../application/use-cases/get-onboarding-status.use-case"

export async function getOnboardingStatusController(request: FastifyRequest, reply: FastifyReply) {
  const repo = new PrismaOnboardingRepository(prisma)
  const status = await new GetOnboardingStatusUseCase(repo).execute({ userId: request.user.id })
  return reply.send(status)
}
