import type { FastifyInstance } from "fastify"
import { authenticate } from "@/shared/infrastructure/plugins/auth.plugin"
import { requireRole } from "@/shared/infrastructure/plugins/require-role.plugin"
import {
  listSalonsController,
  getSalonController,
  createSalonController,
  updateSalonController,
  deleteSalonController,
} from "./salon.controller"

export async function salonRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate)

  fastify.get("/", { preHandler: requireRole("admin", "staff") }, listSalonsController)
  fastify.post("/", { preHandler: requireRole("admin") }, createSalonController)
  fastify.get<{ Params: { id: string } }>(
    "/:id",
    { preHandler: requireRole("admin", "staff") },
    getSalonController,
  )
  fastify.put<{ Params: { id: string } }>(
    "/:id",
    { preHandler: requireRole("admin") },
    updateSalonController,
  )
  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    { preHandler: requireRole("admin") },
    deleteSalonController,
  )
}
