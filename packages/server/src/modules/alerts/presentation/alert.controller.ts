import type { FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "@/shared/infrastructure/prisma/client"
import { PrismaAlertRepository } from "../infra/prisma/prisma-alert.repository"
import { GenerateAlertsUseCase } from "../application/use-cases/generate-alerts.use-case"
import { ListAlertsUseCase } from "../application/use-cases/list-alerts.use-case"
import { MarkAlertReadUseCase } from "../application/use-cases/mark-alert-read.use-case"

const makeRepo = () => new PrismaAlertRepository(prisma)

export async function generateAlertsController(request: FastifyRequest, reply: FastifyReply) {
  const result = await new GenerateAlertsUseCase(makeRepo()).execute(request.organizationId)
  return reply.send(result)
}

export async function listAlertsController(request: FastifyRequest, reply: FastifyReply) {
  const alerts = await new ListAlertsUseCase(makeRepo()).execute(request.organizationId)
  return reply.send(alerts)
}

export async function markAlertReadController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  await new MarkAlertReadUseCase(makeRepo()).execute(request.params.id, request.organizationId)
  return reply.status(204).send()
}
