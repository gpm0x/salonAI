import type { FastifyInstance } from "fastify"
import { authenticateUser } from "@/shared/infrastructure/plugins/auth.plugin"
import { createOrganizationController } from "./organizations.controller"

export async function organizationRoutes(fastify: FastifyInstance) {
  fastify.post("/", {
    preHandler: [authenticateUser],
    handler: createOrganizationController,
  })
}
