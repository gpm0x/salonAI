import type { FastifyInstance } from "fastify"
import { authenticate } from "@/shared/infrastructure/plugins/auth.plugin"
import { getDashboardMetricsController, getDashboardInsightsController } from "./dashboard.controller"

export async function dashboardRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate)

  fastify.get("/metrics", getDashboardMetricsController)
  fastify.get("/insights", getDashboardInsightsController)
}
