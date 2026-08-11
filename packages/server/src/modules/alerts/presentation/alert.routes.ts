import type { FastifyInstance } from "fastify"
import { authenticate } from "@/shared/infrastructure/plugins/auth.plugin"
import { generateAlertsController, listAlertsController, markAlertReadController } from "./alert.controller"

export async function alertRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate)

  fastify.post("/generate", generateAlertsController)
  fastify.get("/", listAlertsController)
  fastify.patch("/:id/read", markAlertReadController)
}
