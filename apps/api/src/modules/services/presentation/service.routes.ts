import type { FastifyInstance } from "fastify"
import { authenticate } from "@/shared/infrastructure/plugins/auth.plugin"
import { requireRole } from "@/shared/infrastructure/plugins/require-role.plugin"
import {
  listServicesController,
  getServiceController,
  createServiceController,
  updateServiceController,
  deleteServiceController,
} from "./service.controller"

export async function serviceRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate)

  fastify.get("/", { preHandler: requireRole("admin", "staff") }, listServicesController)
  fastify.post("/", { preHandler: requireRole("admin") }, createServiceController)
  fastify.get<{ Params: { id: string } }>(
    "/:id",
    { preHandler: requireRole("admin", "staff") },
    getServiceController,
  )
  fastify.put<{ Params: { id: string } }>(
    "/:id",
    { preHandler: requireRole("admin") },
    updateServiceController,
  )
  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    { preHandler: requireRole("admin") },
    deleteServiceController,
  )
}
