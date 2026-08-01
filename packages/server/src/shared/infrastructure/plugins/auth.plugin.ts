import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"
import fp from "fastify-plugin"
import { prisma } from "../prisma/client"
import { UnauthorizedError } from "../../domain/errors"

export interface AuthUser {
  id: string
  email: string
  name: string
}

declare module "fastify" {
  interface FastifyRequest {
    user: AuthUser
    organizationId: string
  }
}

async function authPlugin(fastify: FastifyInstance) {
  fastify.decorateRequest("user", null)
  fastify.decorateRequest("organizationId", "")
}

export async function authenticate(request: FastifyRequest, _reply: FastifyReply) {
  const authHeader = request.headers.authorization
  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Token de autenticacao ausente")
  }

  const token = authHeader.slice(7)

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!session || session.expiresAt < new Date()) {
    throw new UnauthorizedError("Sessao invalida ou expirada")
  }

  const organization = await prisma.organization.findFirst({
    where: { ownerId: session.user.id },
  })

  if (!organization) {
    throw new UnauthorizedError("Organizacao nao encontrada para este usuario")
  }

  request.user = {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
  }
  request.organizationId = organization.id
}

export default fp(authPlugin, { name: "auth" })
