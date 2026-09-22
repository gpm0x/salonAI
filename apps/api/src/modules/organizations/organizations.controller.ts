import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { prisma } from "@/shared/infrastructure/prisma/client"
import { PrismaOrganizationRepository } from "./infra/prisma/prisma-organization.repository"
import { PrismaUserRoleRepository } from "./infra/prisma/prisma-user-role.repository"
import { CreateOrganizationUseCase } from "./application/create-organization.use-case"
import { UpdateMemberRoleUseCase } from "./application/use-cases/update-member-role.use-case"
import { ListOrganizationMembersUseCase } from "./application/use-cases/list-organization-members.use-case"
import { NotFoundError } from "@/shared/domain/errors"
import { userRoleSchema } from "@/shared/domain/user-role"
import { resolveUserOrganizationId } from "@/shared/infrastructure/prisma/resolve-user-organization-id"

const createBodySchema = z.object({
  name: z.string().min(2).max(100),
}).strict()

const updateMemberRoleBodySchema = z.object({
  role: userRoleSchema,
}).strict()

export async function createOrganizationController(request: FastifyRequest, reply: FastifyReply) {
  const { name } = createBodySchema.parse(request.body)

  const repo = new PrismaOrganizationRepository(prisma)
  const useCase = new CreateOrganizationUseCase(repo)

  const { organizationId } = await useCase.execute({ name, ownerId: request.user.id })

  return reply.status(201).send({ organizationId })
}

export async function getCurrentOrganizationController(request: FastifyRequest, reply: FastifyReply) {
  // Rota usa authenticateUser (usuario pode ainda nao ter org), por isso resolve
  // aqui em vez de depender de request.organizationId (so setado por authenticate).
  const organizationId = await resolveUserOrganizationId(request.user.id)
  if (!organizationId) throw new NotFoundError("Organizacao nao encontrada")

  const repo = new PrismaOrganizationRepository(prisma)
  const org = await repo.findById(organizationId)
  if (!org) throw new NotFoundError("Organizacao nao encontrada")

  return reply.send({
    id: org.id,
    name: org.name,
    subscriptionStatus: org.subscriptionStatus,
  })
}

export async function updateMemberRoleController(
  request: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply,
) {
  const { role } = updateMemberRoleBodySchema.parse(request.body)

  const useCase = new UpdateMemberRoleUseCase(
    new PrismaOrganizationRepository(prisma),
    new PrismaUserRoleRepository(prisma),
  )

  await useCase.execute({
    organizationId: request.organizationId,
    requesterId: request.user.id,
    targetUserId: request.params.userId,
    role,
  })

  return reply.status(204).send()
}

export async function listOrganizationMembersController(request: FastifyRequest, reply: FastifyReply) {
  const repo = new PrismaOrganizationRepository(prisma)
  const members = await new ListOrganizationMembersUseCase(repo).execute({
    organizationId: request.organizationId,
  })

  return reply.send({ data: members })
}
