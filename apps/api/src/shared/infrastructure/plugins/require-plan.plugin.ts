import type { FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "../prisma/client"
import { ForbiddenError } from "../../domain/errors"
import { resolvePlanTier, planSatisfies, type PlanTier } from "../../domain/plan"

interface CacheEntry {
  tier: PlanTier
  expiresAt: number
}

const CACHE_TTL_MS = 60_000
const planCache = new Map<string, CacheEntry>()

async function getPlanTier(organizationId: string): Promise<PlanTier> {
  const cached = planCache.get(organizationId)
  if (cached && cached.expiresAt > Date.now()) return cached.tier

  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { subscriptionStatus: true },
  })

  const tier = resolvePlanTier(organization?.subscriptionStatus ?? "free")
  planCache.set(organizationId, { tier, expiresAt: Date.now() + CACHE_TTL_MS })
  return tier
}

// Chamado pelo webhook do Stripe sempre que subscriptionStatus muda, pra nao servir
// um plano desatualizado durante a janela de TTL do cache.
export function invalidatePlanCache(organizationId: string): void {
  planCache.delete(organizationId)
}

const PLAN_LABELS: Record<PlanTier, string> = {
  free: "Gratuito",
  essencial: "Essencial",
}

export function requirePlan(minimum: PlanTier) {
  return async function requirePlanPreHandler(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
    const tier = await getPlanTier(request.organizationId)
    if (!planSatisfies(tier, minimum)) {
      throw new ForbiddenError(`Recurso disponivel no plano ${PLAN_LABELS[minimum]}`)
    }
  }
}
