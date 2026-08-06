import type { FastifyInstance } from "fastify"
import { authenticate } from "@/shared/infrastructure/plugins/auth.plugin"
import {
  listClientsController,
  getClientController,
  createClientController,
  updateClientController,
  deleteClientController,
} from "./client.controller"

export async function clientRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate)

  fastify.get("/", listClientsController)
  fastify.post("/", createClientController)
  fastify.get("/:id", getClientController)
  fastify.put("/:id", updateClientController)
  fastify.delete("/:id", deleteClientController)
}
