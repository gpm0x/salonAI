import type { FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "@/shared/infrastructure/prisma/client"
import { PrismaDashboardRepository } from "../infra/prisma/prisma-dashboard.repository"
import { GetDashboardMetricsUseCase } from "../application/use-cases/get-dashboard-metrics.use-case"
import { GetDashboardInsightsUseCase } from "../application/use-cases/get-dashboard-insights.use-case"

const makeRepo = () => new PrismaDashboardRepository(prisma)

export async function getDashboardMetricsController(request: FastifyRequest, reply: FastifyReply) {
  const metrics = await new GetDashboardMetricsUseCase(makeRepo()).execute({
    organizationId: request.organizationId,
  })
  return reply.send(metrics)
}

export async function getDashboardInsightsController(request: FastifyRequest, reply: FastifyReply) {
  const insights = await new GetDashboardInsightsUseCase(makeRepo()).execute({
    organizationId: request.organizationId,
  })
  return reply.send(insights)
}
