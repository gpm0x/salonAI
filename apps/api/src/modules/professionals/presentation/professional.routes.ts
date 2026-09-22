import type { FastifyInstance } from "fastify"
import { authenticate } from "@/shared/infrastructure/plugins/auth.plugin"
import { requireRole } from "@/shared/infrastructure/plugins/require-role.plugin"
import {
  listProfessionalsController,
  getProfessionalController,
  createProfessionalController,
  updateProfessionalController,
  deleteProfessionalController,
} from "./professional.controller"

export async function professionalRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate)

  fastify.get("/", { preHandler: requireRole("admin", "staff") }, listProfessionalsController)
  fastify.post("/", { preHandler: requireRole("admin") }, createProfessionalController)
  fastify.get<{ Params: { id: string } }>(
    "/:id",
    { preHandler: requireRole("admin", "staff") },
    getProfessionalController,
  )
  fastify.put<{ Params: { id: string } }>(
    "/:id",
    { preHandler: requireRole("admin") },
    updateProfessionalController,
  )
  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    { preHandler: requireRole("admin") },
    deleteProfessionalController,
  )
}
