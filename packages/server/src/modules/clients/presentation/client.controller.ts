import type { FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "@/shared/infrastructure/prisma/client"
import { PrismaClientRepository } from "../infra/prisma/prisma-client.repository"
import { ListClientsUseCase } from "../application/use-cases/list-clients.use-case"
import { GetClientUseCase } from "../application/use-cases/get-client.use-case"
import { CreateClientUseCase } from "../application/use-cases/create-client.use-case"
import { UpdateClientUseCase } from "../application/use-cases/update-client.use-case"
import { DeleteClientUseCase } from "../application/use-cases/delete-client.use-case"
import { createClientSchema } from "../application/dtos/create-client.dto"
import { updateClientSchema } from "../application/dtos/update-client.dto"

const makeRepo = () => new PrismaClientRepository(prisma)

export async function listClientsController(request: FastifyRequest, reply: FastifyReply) {
  const result = await new ListClientsUseCase(makeRepo()).execute({ organizationId: request.organizationId })
  return reply.send(result)
}

export async function getClientController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const client = await new GetClientUseCase(makeRepo()).execute({
    id: request.params.id,
    organizationId: request.organizationId,
  })
  return reply.send(client)
}

export async function createClientController(request: FastifyRequest, reply: FastifyReply) {
  const input = createClientSchema.parse(request.body)
  const { clientId } = await new CreateClientUseCase(makeRepo()).execute({
    ...input,
    organizationId: request.organizationId,
  })
  return reply.status(201).send({ clientId })
}

export async function updateClientController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const input = updateClientSchema.parse(request.body)
  await new UpdateClientUseCase(makeRepo()).execute({
    id: request.params.id,
    organizationId: request.organizationId,
    ...input,
  })
  return reply.status(204).send()
}

export async function deleteClientController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  await new DeleteClientUseCase(makeRepo()).execute({
    id: request.params.id,
    organizationId: request.organizationId,
  })
  return reply.status(204).send()
}
