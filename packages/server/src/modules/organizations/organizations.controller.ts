import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { prisma } from "@/shared/infrastructure/prisma/client"
import { PrismaOrganizationRepository } from "./infra/prisma/prisma-organization.repository"
import { CreateOrganizationUseCase } from "./application/create-organization.use-case"

const createBodySchema = z.object({
  name: z.string().min(2).max(100),
})

export async function createOrganizationController(request: FastifyRequest, reply: FastifyReply) {
  const { name } = createBodySchema.parse(request.body)

  const repo = new PrismaOrganizationRepository(prisma)
  const useCase = new CreateOrganizationUseCase(repo)

  const { organizationId } = await useCase.execute({ name, ownerId: request.user.id })

  return reply.status(201).send({ organizationId })
}
