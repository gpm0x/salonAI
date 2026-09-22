import type Stripe from "stripe"

// Mapeia Stripe.Subscription.status -> Organization.subscriptionStatus (nosso dominio).
// Status sem equivalente direto caem no lado mais conservador (nega acesso ao plano pago).
const STRIPE_TO_INTERNAL: Record<Stripe.Subscription.Status, string> = {
  trialing: "trialing",
  active: "active",
  past_due: "past_due",
  canceled: "canceled",
  unpaid: "past_due",
  incomplete: "past_due",
  incomplete_expired: "canceled",
  paused: "canceled",
}

export function mapStripeSubscriptionStatus(status: Stripe.Subscription.Status): string {
  return STRIPE_TO_INTERNAL[status] ?? "past_due"
}
