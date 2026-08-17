import type { FastifyInstance } from "fastify"
import { authenticate } from "@/shared/infrastructure/plugins/auth.plugin"
import {
  listAppointmentsController,
  getAppointmentController,
  createAppointmentController,
  updateAppointmentStatusController,
  cancelAppointmentController,
} from "./appointment.controller"

export async function appointmentRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate)

  fastify.get("/", listAppointmentsController)
  fastify.post(
    "/",
    {
      config: {
        rateLimit: {
          max: 30,
          timeWindow: 60_000,
          keyGenerator: (req) => `appointments:${req.ip}`,
        },
      },
    },
    createAppointmentController,
  )
  fastify.get("/:id", getAppointmentController)
  fastify.patch("/:id/status", updateAppointmentStatusController)
  fastify.delete("/:id", cancelAppointmentController)
}
