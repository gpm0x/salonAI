import type { FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "@/shared/infrastructure/prisma/client"
import { PrismaTransactionRepository } from "../infra/prisma/prisma-transaction.repository"
import { ListTransactionsUseCase } from "../application/use-cases/list-transactions.use-case"
import { GetTransactionUseCase } from "../application/use-cases/get-transaction.use-case"
import { CreateTransactionUseCase } from "../application/use-cases/create-transaction.use-case"
import { GetTransactionSummaryUseCase } from "../application/use-cases/get-transaction-summary.use-case"
import { createTransactionSchema } from "../application/dtos/create-transaction.dto"

const makeRepo = () => new PrismaTransactionRepository(prisma)

export async function listTransactionsController(
  request: FastifyRequest<{ Querystring: { mes?: string } }>,
  reply: FastifyReply,
) {
  const result = await new ListTransactionsUseCase(makeRepo()).execute({
    organizationId: request.organizationId,
    mes: request.query.mes,
  })
  return reply.send(result)
}

export async function getTransactionSummaryController(request: FastifyRequest, reply: FastifyReply) {
  const summary = await new GetTransactionSummaryUseCase(makeRepo()).execute({
    organizationId: request.organizationId,
  })
  return reply.send(summary)
}

export async function getTransactionController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const transaction = await new GetTransactionUseCase(makeRepo()).execute({
    id: request.params.id,
    organizationId: request.organizationId,
  })
  return reply.send(transaction)
}

export async function createTransactionController(request: FastifyRequest, reply: FastifyReply) {
  const input = createTransactionSchema.parse(request.body)
  const { transactionId } = await new CreateTransactionUseCase(makeRepo()).execute({
    ...input,
    organizationId: request.organizationId,
  })
  return reply.status(201).send({ transactionId })
}
