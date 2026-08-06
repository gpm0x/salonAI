import Fastify from "fastify"
import cors from "@fastify/cors"
import sensible from "@fastify/sensible"
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod"
import swaggerPlugin from "./shared/infrastructure/plugins/swagger.plugin"
import authPlugin from "./shared/infrastructure/plugins/auth.plugin"
import errorHandlerPlugin from "./shared/infrastructure/plugins/error-handler.plugin"
import { organizationRoutes } from "./modules/organizations/organizations.routes"
import { salonRoutes } from "./modules/salons/presentation/salon.routes"
import { serviceRoutes } from "./modules/services/presentation/service.routes"
import { professionalRoutes } from "./modules/professionals/presentation/professional.routes"
import { clientRoutes } from "./modules/clients/presentation/client.routes"
import { appointmentRoutes } from "./modules/appointments/presentation/appointment.routes"
import { transactionRoutes } from "./modules/transactions/presentation/transaction.routes"
import { dashboardRoutes } from "./modules/dashboard/presentation/dashboard.routes"

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      transport: process.env.NODE_ENV !== "production"
        ? { target: "pino-pretty", options: { colorize: true } }
        : undefined,
    },
  })

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  await app.register(cors, {
    origin: process.env.NODE_ENV === "production"
      ? [process.env.FRONTEND_URL ?? ""]
      : true,
    credentials: true,
  })

  await app.register(sensible)
  await app.register(swaggerPlugin)
  await app.register(authPlugin)
  await app.register(errorHandlerPlugin)

  app.get("/health", async () => ({ status: "ok" }))

  await app.register(organizationRoutes, { prefix: "/api/organizations" })
  await app.register(salonRoutes, { prefix: "/api/salons" })
  await app.register(serviceRoutes, { prefix: "/api/services" })
  await app.register(professionalRoutes, { prefix: "/api/professionals" })
  await app.register(clientRoutes, { prefix: "/api/clients" })
  await app.register(appointmentRoutes, { prefix: "/api/appointments" })
  await app.register(transactionRoutes, { prefix: "/api/transactions" })
  await app.register(dashboardRoutes, { prefix: "/api/dashboard" })

  return app
}
