import fp from "fastify-plugin"
import swagger from "@fastify/swagger"
import swaggerUi from "@fastify/swagger-ui"
import type { FastifyInstance } from "fastify"

async function swaggerPlugin(app: FastifyInstance) {
  await app.register(swagger, {
    openapi: {
      info: {
        title: "SalonAI API",
        description: "API do SalonAI — SaaS de gestao para saloes de beleza",
        version: "1.0.0",
      },
      servers: [
        { url: "http://localhost:3333", description: "Development" },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "session-token",
          },
        },
      },
    },
  })

  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
  })
}

export default fp(swaggerPlugin, { name: "swagger" })
