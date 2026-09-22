import type { FastifyInstance } from "fastify"
import { authenticate } from "@/shared/infrastructure/plugins/auth.plugin"
import { requireRole } from "@/shared/infrastructure/plugins/require-role.plugin"
import {
  listClientsController,
  getClientController,
  createClientController,
  updateClientController,
  deleteClientController,
} from "./client.controller"

export async function clientRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate)
  fastify.addHook("preHandler", requireRole("admin", "staff"))

  fastify.get("/", listClientsController)
  fastify.post("/", createClientController)
  fastify.get("/:id", getClientController)
  fastify.put("/:id", updateClientController)
  fastify.delete("/:id", deleteClientController)
}
