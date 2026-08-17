import type { FastifyInstance, FastifyRequest } from "fastify"

function emailKey(req: FastifyRequest, prefix: string): string {
  const body = req.body as Record<string, unknown> | null
  const email = typeof body?.email === "string" ? body.email.toLowerCase().trim() : ""
  return `${prefix}:${email}:${req.ip}`
}

export async function authRoutes(app: FastifyInstance) {
  // POST /api/auth/sign-in
  // Rate limit: 5 req/min per email+IP (combined key defends against distributed brute-force)
  // TODO: replace stub handler with Better Auth sign-in integration when moving auth to Fastify
  app.post(
    "/sign-in",
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: 60_000,
          hook: "preHandler",
          keyGenerator: (req) => emailKey(req, "sign-in"),
          errorResponseBuilder: (_req, context) => ({
            code: "RATE_LIMIT",
            message: "Muitas tentativas de login. Aguarde antes de tentar novamente.",
            retryAfterMs: context.ttl,
          }),
        },
      },
    },
    async (_req, reply) => {
      return reply.status(501).send({ error: "Not implemented — use Better Auth client" })
    },
  )

  // POST /api/auth/forget-password
  // Rate limit: 3 req/15min per email (no IP in key — email alone is the sensitive resource)
  // TODO: replace stub handler with Better Auth forgot-password integration
  app.post(
    "/forget-password",
    {
      config: {
        rateLimit: {
          max: 3,
          timeWindow: 15 * 60_000,
          hook: "preHandler",
          keyGenerator: (req) => {
            const body = req.body as Record<string, unknown> | null
            const email = typeof body?.email === "string" ? body.email.toLowerCase().trim() : req.ip
            return `forget-password:${email}`
          },
          errorResponseBuilder: (_req, context) => ({
            code: "RATE_LIMIT",
            message: "Muitas tentativas de reset. Aguarde 15 minutos.",
            retryAfterMs: context.ttl,
          }),
        },
      },
    },
    async (_req, reply) => {
      return reply.status(501).send({ error: "Not implemented — use Better Auth client" })
    },
  )
}
