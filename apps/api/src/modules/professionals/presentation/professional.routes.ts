import type { FastifyInstance } from "fastify"
import { authenticate } from "@/shared/infrastructure/plugins/auth.plugin"
import {
  listProfessionalsController,
  getProfessionalController,
  createProfessionalController,
  updateProfessionalController,
  deleteProfessionalController,
} from "./professional.controller"

export async function professionalRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate)

  fastify.get("/", listProfessionalsController)
  fastify.post("/", createProfessionalController)
  fastify.get("/:id", getProfessionalController)
  fastify.put("/:id", updateProfessionalController)
  fastify.delete("/:id", deleteProfessionalController)
}
