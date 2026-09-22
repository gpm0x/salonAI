import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"
import fp from "fastify-plugin"
import { prisma } from "../prisma/client"
import { resolveUserOrganizationId } from "../prisma/resolve-user-organization-id"
import { UnauthorizedError } from "../../domain/errors"
import { userRoleSchema, type UserRole } from "../../domain/user-role"

export interface AuthUser {
  id: string
  email: string
  name: string
}

declare module "fastify" {
  interface FastifyRequest {
    user: AuthUser
    organizationId: string
    userRole: UserRole
  }
}

async function authPlugin(fastify: FastifyInstance) {
  fastify.decorateRequest<AuthUser>("user", null as unknown as AuthUser)
  fastify.decorateRequest("organizationId", "")
  fastify.decorateRequest<UserRole>("userRole", null as unknown as UserRole)
}

function parseUserRole(value: string): UserRole {
  const result = userRoleSchema.safeParse(value)
  if (!result.success) throw new UnauthorizedError("Role de usuario invalida")
  return result.data
}

function extractToken(request: FastifyRequest): string | undefined {
  const authHeader = request.headers.authorization
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7)

  // Fallback: Better Auth session cookie (cross-origin dev setup)
  const cookieHeader = request.headers.cookie ?? ""
  const match = cookieHeader.match(/better-auth\.session_token=([^;]+)/)
  return match?.[1]
}

// Validates session only (use on routes where user may not have an org yet, e.g. POST /organizations)
export async function authenticateUser(request: FastifyRequest, _reply: FastifyReply) {
  const token = extractToken(request)
  if (!token) throw new UnauthorizedError("Token de autenticacao ausente")

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!session || session.expiresAt < new Date()) {
    throw new UnauthorizedError("Sessao invalida ou expirada")
  }

  request.user = {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
  }
  request.userRole = parseUserRole(session.user.role)
}

// Full auth: validates session + requires organization
export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  await authenticateUser(request, reply)

  const organizationId = await resolveUserOrganizationId(request.user.id)
  if (!organizationId) throw new UnauthorizedError("Organizacao nao encontrada para este usuario")

  request.organizationId = organizationId
}

export default fp(authPlugin, { name: "auth" })
