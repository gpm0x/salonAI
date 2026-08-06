import type { FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "@/shared/infrastructure/prisma/client"
import { PrismaSalonRepository } from "../infra/prisma/prisma-salon.repository"
import { ListSalonsUseCase } from "../application/use-cases/list-salons.use-case"
import { GetSalonUseCase } from "../application/use-cases/get-salon.use-case"
import { CreateSalonUseCase } from "../application/use-cases/create-salon.use-case"
import { UpdateSalonUseCase } from "../application/use-cases/update-salon.use-case"
import { DeleteSalonUseCase } from "../application/use-cases/delete-salon.use-case"
import { createSalonSchema } from "../application/dtos/create-salon.dto"
import { updateSalonSchema } from "../application/dtos/update-salon.dto"

const makeRepo = () => new PrismaSalonRepository(prisma)

export async function listSalonsController(request: FastifyRequest, reply: FastifyReply) {
  const result = await new ListSalonsUseCase(makeRepo()).execute({ organizationId: request.organizationId })
  return reply.send(result)
}

export async function getSalonController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const salon = await new GetSalonUseCase(makeRepo()).execute({
    id: request.params.id,
    organizationId: request.organizationId,
  })
  return reply.send(salon)
}

export async function createSalonController(request: FastifyRequest, reply: FastifyReply) {
  const input = createSalonSchema.parse(request.body)
  const { salonId } = await new CreateSalonUseCase(makeRepo()).execute({
    ...input,
    organizationId: request.organizationId,
  })
  return reply.status(201).send({ salonId })
}

export async function updateSalonController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const input = updateSalonSchema.parse(request.body)
  await new UpdateSalonUseCase(makeRepo()).execute({
    id: request.params.id,
    organizationId: request.organizationId,
    ...input,
  })
  return reply.status(204).send()
}

export async function deleteSalonController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  await new DeleteSalonUseCase(makeRepo()).execute({
    id: request.params.id,
    organizationId: request.organizationId,
  })
  return reply.status(204).send()
}
