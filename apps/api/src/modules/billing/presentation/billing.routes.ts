import type { FastifyInstance } from "fastify"
import { authenticate } from "@/shared/infrastructure/plugins/auth.plugin"
import { requireRole } from "@/shared/infrastructure/plugins/require-role.plugin"
import { createCheckoutSessionController, createPortalSessionController } from "./billing.controller"

export async function billingRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate)
  fastify.addHook("preHandler", requireRole("admin"))

  fastify.post("/checkout", createCheckoutSessionController)
  fastify.post("/portal", createPortalSessionController)
}
