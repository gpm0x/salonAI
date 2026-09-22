import type { FastifyInstance } from "fastify"
import {
  getPublicSalonController,
  getAvailabilityController,
  createPublicAppointmentController,
} from "./public.controller"

// Rotas sem autenticacao, consumidas pela pagina publica de agendamento (FRONT-02).
export async function publicRoutes(fastify: FastifyInstance) {
  fastify.get("/salons/:slug", getPublicSalonController)
  fastify.get("/salons/:slug/availability", getAvailabilityController)

  fastify.post(
    "/appointments",
    {
      config: {
        rateLimit: {
          max: 20,
          timeWindow: 60_000,
          keyGenerator: (req) => `public-appointments:${req.ip}`,
        },
      },
    },
    createPublicAppointmentController,
  )
}
