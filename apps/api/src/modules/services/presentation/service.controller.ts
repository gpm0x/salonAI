import type { FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "@/shared/infrastructure/prisma/client"
import { PrismaServiceRepository } from "../infra/prisma/prisma-service.repository"
import { ListServicesUseCase } from "../application/use-cases/list-services.use-case"
import { GetServiceUseCase } from "../application/use-cases/get-service.use-case"
import { CreateServiceUseCase } from "../application/use-cases/create-service.use-case"
import { UpdateServiceUseCase } from "../application/use-cases/update-service.use-case"
import { DeleteServiceUseCase } from "../application/use-cases/delete-service.use-case"
import { createServiceSchema } from "../application/dtos/create-service.dto"
import { updateServiceSchema } from "../application/dtos/update-service.dto"

const makeRepo = () => new PrismaServiceRepository(prisma)

export async function listServicesController(request: FastifyRequest, reply: FastifyReply) {
  const result = await new ListServicesUseCase(makeRepo()).execute({ organizationId: request.organizationId })
  return reply.send(result)
}

export async function getServiceController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const service = await new GetServiceUseCase(makeRepo()).execute({
    id: request.params.id,
    organizationId: request.organizationId,
  })
  return reply.send(service)
}

export async function createServiceController(request: FastifyRequest, reply: FastifyReply) {
  const input = createServiceSchema.parse(request.body)
  const { serviceId } = await new CreateServiceUseCase(makeRepo()).execute({
    ...input,
    organizationId: request.organizationId,
  })
  return reply.status(201).send({ serviceId })
}

export async function updateServiceController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const input = updateServiceSchema.parse(request.body)
  await new UpdateServiceUseCase(makeRepo()).execute({
    id: request.params.id,
    organizationId: request.organizationId,
    ...input,
  })
  return reply.status(204).send()
}

export async function deleteServiceController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  await new DeleteServiceUseCase(makeRepo()).execute({
    id: request.params.id,
    organizationId: request.organizationId,
  })
  return reply.status(204).send()
}
