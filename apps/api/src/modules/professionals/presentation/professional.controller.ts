import type { FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "@/shared/infrastructure/prisma/client"
import { PrismaProfessionalRepository } from "../infra/prisma/prisma-professional.repository"
import { ListProfessionalsUseCase } from "../application/use-cases/list-professionals.use-case"
import { GetProfessionalUseCase } from "../application/use-cases/get-professional.use-case"
import { CreateProfessionalUseCase } from "../application/use-cases/create-professional.use-case"
import { UpdateProfessionalUseCase } from "../application/use-cases/update-professional.use-case"
import { DeleteProfessionalUseCase } from "../application/use-cases/delete-professional.use-case"
import { createProfessionalSchema } from "../application/dtos/create-professional.dto"
import { updateProfessionalSchema } from "../application/dtos/update-professional.dto"

const makeRepo = () => new PrismaProfessionalRepository(prisma)

export async function listProfessionalsController(request: FastifyRequest, reply: FastifyReply) {
  const result = await new ListProfessionalsUseCase(makeRepo()).execute({ organizationId: request.organizationId })
  return reply.send(result)
}

export async function getProfessionalController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const professional = await new GetProfessionalUseCase(makeRepo()).execute({
    id: request.params.id,
    organizationId: request.organizationId,
  })
  return reply.send(professional)
}

export async function createProfessionalController(request: FastifyRequest, reply: FastifyReply) {
  const input = createProfessionalSchema.parse(request.body)
  const { professionalId } = await new CreateProfessionalUseCase(makeRepo()).execute({
    ...input,
    organizationId: request.organizationId,
  })
  return reply.status(201).send({ professionalId })
}

export async function updateProfessionalController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const input = updateProfessionalSchema.parse(request.body)
  await new UpdateProfessionalUseCase(makeRepo()).execute({
    id: request.params.id,
    organizationId: request.organizationId,
    ...input,
  })
  return reply.status(204).send()
}

export async function deleteProfessionalController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  await new DeleteProfessionalUseCase(makeRepo()).execute({
    id: request.params.id,
    organizationId: request.organizationId,
  })
  return reply.status(204).send()
}
