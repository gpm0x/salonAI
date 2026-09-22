import type { FastifyRequest, FastifyReply } from "fastify"
import { ForbiddenError } from "@/shared/domain/errors"
import type { UserRole } from "@/shared/domain/user-role"

/**
 * Preenchida no auth.plugin.ts (authenticateUser/authenticate) antes de
 * qualquer preHandler que use requireRole.
 */
export function requireRole(...roles: UserRole[]) {
  return async function requireRoleHandler(request: FastifyRequest, _reply: FastifyReply) {
    if (!roles.includes(request.userRole)) {
      throw new ForbiddenError(
        `Acesso restrito a: ${roles.join(", ")}`,
      )
    }
  }
}
