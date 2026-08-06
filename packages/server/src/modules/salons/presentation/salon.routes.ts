import type { FastifyInstance } from "fastify"
import { authenticate } from "@/shared/infrastructure/plugins/auth.plugin"
import {
  listSalonsController,
  getSalonController,
  createSalonController,
  updateSalonController,
  deleteSalonController,
} from "./salon.controller"

export async function salonRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate)

  fastify.get("/", listSalonsController)
  fastify.post("/", createSalonController)
  fastify.get("/:id", getSalonController)
  fastify.put("/:id", updateSalonController)
  fastify.delete("/:id", deleteSalonController)
}
