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

  return app
}
