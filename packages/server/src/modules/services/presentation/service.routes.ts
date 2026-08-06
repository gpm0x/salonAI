import type { FastifyInstance } from "fastify"
import { authenticate } from "@/shared/infrastructure/plugins/auth.plugin"
import {
  listServicesController,
  getServiceController,
  createServiceController,
  updateServiceController,
  deleteServiceController,
} from "./service.controller"

export async function serviceRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate)

  fastify.get("/", listServicesController)
  fastify.post("/", createServiceController)
  fastify.get("/:id", getServiceController)
  fastify.put("/:id", updateServiceController)
  fastify.delete("/:id", deleteServiceController)
}
