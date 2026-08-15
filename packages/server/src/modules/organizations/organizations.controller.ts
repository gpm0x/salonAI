import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { prisma } from "@/shared/infrastructure/prisma/client"
import { PrismaOrganizationRepository } from "./infra/prisma/prisma-organization.repository"
import { CreateOrganizationUseCase } from "./application/create-organization.use-case"
import { NotFoundError } from "@/shared/domain/errors"

const createBodySchema = z.object({
  name: z.string().min(2).max(100),
}).strict()

export async function createOrganizationController(request: FastifyRequest, reply: FastifyReply) {
  const { name } = createBodySchema.parse(request.body)

  const repo = new PrismaOrganizationRepository(prisma)
  const useCase = new CreateOrganizationUseCase(repo)

  const { organizationId } = await useCase.execute({ name, ownerId: request.user.id })

  return reply.status(201).send({ organizationId })
}

export async function getCurrentOrganizationController(request: FastifyRequest, reply: FastifyReply) {
  const repo = new PrismaOrganizationRepository(prisma)
  const org = await repo.findByOwnerId(request.user.id)
  if (!org) throw new NotFoundError("Organização não encontrada")

  return reply.send({
    id: org.id,
    name: org.name,
    subscriptionStatus: org.subscriptionStatus,
  })
}
