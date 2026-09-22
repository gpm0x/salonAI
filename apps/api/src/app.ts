import Fastify from "fastify"
import cors from "@fastify/cors"
import helmet from "@fastify/helmet"
import rateLimit from "@fastify/rate-limit"
import sensible from "@fastify/sensible"
import Redis from "ioredis"
import { env } from "./config/env"
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
import { alertRoutes } from "./modules/alerts/presentation/alert.routes"
import { onboardingRoutes } from "./modules/onboarding/presentation/onboarding.routes"
import { authRoutes } from "./modules/auth/auth.routes"
import { publicRoutes } from "./modules/public/presentation/public.routes"
import { billingRoutes } from "./modules/billing/presentation/billing.routes"
import { stripeWebhookRoutes } from "./webhooks/stripe.webhook"

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      transport: process.env.NODE_ENV !== "production"
        ? { target: "pino-pretty", options: { colorize: true } }
        : undefined,
    },
    // Normalizes //api/auth/sign-in → /api/auth/sign-in (mitigates path-based rate limit bypass)
    ignoreDuplicateSlashes: true,
  })

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  await app.register(helmet, {
    contentSecurityPolicy: false, // CSP gerenciado pelo reverse proxy em prod
    crossOriginEmbedderPolicy: false,
  })

  let redis: Redis | undefined = undefined
  if (env.redisUrl) {
    const redisClient = new Redis(env.redisUrl, { lazyConnect: true, enableOfflineQueue: false })
    redisClient.on("error", (err) => app.log.error({ err }, "Redis rate-limit connection error"))
    try {
      await redisClient.connect()
      redis = redisClient
      app.log.info("Redis conectado para rate limiting distribuído")
    } catch {
      app.log.warn("Redis indisponível: rate limiting via memória local")
      redisClient.disconnect()
    }
  }

  await app.register(rateLimit, {
    global: true,
    max: 200,
    timeWindow: "1 minute",
    redis,
    addHeadersOnExceeding: { "x-ratelimit-limit": true, "x-ratelimit-remaining": true, "x-ratelimit-reset": true },
    addHeaders: { "x-ratelimit-limit": true, "x-ratelimit-remaining": true, "x-ratelimit-reset": true, "retry-after": true },
    errorResponseBuilder: (_req, context) => ({
      code: "RATE_LIMIT",
      message: "Muitas requisições. Tente novamente em instantes.",
      retryAfterMs: context.ttl,
    }),
  })

  await app.register(cors, {
    origin: process.env.NODE_ENV === "production"
      ? [process.env.FRONTEND_URL ?? ""]
      : true,
    credentials: true,
  })

  await app.register(sensible)

  if (process.env.NODE_ENV !== "production") {
    await app.register(swaggerPlugin)
  }

  await app.register(authPlugin)
  await app.register(errorHandlerPlugin)

  app.get("/health", async () => ({ status: "ok" }))

  await app.register(authRoutes, { prefix: "/api/auth" })
  await app.register(organizationRoutes, { prefix: "/api/organizations" })
  await app.register(salonRoutes, { prefix: "/api/salons" })
  await app.register(serviceRoutes, { prefix: "/api/services" })
  await app.register(professionalRoutes, { prefix: "/api/professionals" })
  await app.register(clientRoutes, { prefix: "/api/clients" })
  await app.register(appointmentRoutes, { prefix: "/api/appointments" })
  await app.register(transactionRoutes, { prefix: "/api/transactions" })
  await app.register(dashboardRoutes, { prefix: "/api/dashboard" })
  await app.register(alertRoutes, { prefix: "/api/alerts" })
  await app.register(onboardingRoutes, { prefix: "/api/onboarding" })
  await app.register(publicRoutes, { prefix: "/api/public" })
  await app.register(billingRoutes, { prefix: "/api/billing" })
  await app.register(stripeWebhookRoutes, { prefix: "/webhooks/stripe" })

  return app
}
