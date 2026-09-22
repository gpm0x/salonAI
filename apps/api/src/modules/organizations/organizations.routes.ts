import type { FastifyInstance } from "fastify"
import { authenticate, authenticateUser } from "@/shared/infrastructure/plugins/auth.plugin"
import { requireRole } from "@/shared/infrastructure/plugins/require-role.plugin"
import {
  createOrganizationController,
  getCurrentOrganizationController,
  updateMemberRoleController,
  listOrganizationMembersController,
} from "./organizations.controller"

export async function organizationRoutes(fastify: FastifyInstance) {
  fastify.post("/", {
    preHandler: [authenticateUser],
    handler: createOrganizationController,
  })

  fastify.get("/current", {
    preHandler: [authenticateUser],
    handler: getCurrentOrganizationController,
  })

  fastify.get("/members", {
    preHandler: [authenticate, requireRole("admin")],
    handler: listOrganizationMembersController,
  })

  fastify.patch("/members/:userId/role", {
    preHandler: [authenticate, requireRole("admin")],
    handler: updateMemberRoleController,
  })
}
