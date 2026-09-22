export type PlanTier = "free" | "essencial"

const PLAN_RANK: Record<PlanTier, number> = {
  free: 0,
  essencial: 1,
}

// Unico lugar que mapeia subscriptionStatus (Organization, espelha Stripe) -> PlanTier.
// trialing e active liberam o plano essencial; qualquer outro status cai pra free.
const STATUS_TO_PLAN: Record<string, PlanTier> = {
  trialing: "essencial",
  active: "essencial",
  essencial: "essencial",
  free: "free",
  past_due: "free",
  canceled: "free",
}

export function resolvePlanTier(subscriptionStatus: string): PlanTier {
  return STATUS_TO_PLAN[subscriptionStatus] ?? "free"
}

export function planSatisfies(current: PlanTier, minimum: PlanTier): boolean {
  return PLAN_RANK[current] >= PLAN_RANK[minimum]
}
