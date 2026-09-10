import type { FastifyInstance } from "fastify"
import { authenticate, authenticateUser } from "@/shared/infrastructure/plugins/auth.plugin"
import { createOrganizationController, getCurrentOrganizationController } from "./organizations.controller"

export async function organizationRoutes(fastify: FastifyInstance) {
  fastify.post("/", {
    preHandler: [authenticateUser],
    handler: createOrganizationController,
  })

  fastify.get("/current", {
    preHandler: [authenticateUser],
    handler: getCurrentOrganizationController,
  })
}
