export interface OrganizationBillingRow {
  id: string
  name: string
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  subscriptionStatus: string
}

export interface UpdateSubscriptionInput {
  stripeSubscriptionId?: string
  subscriptionStatus: string
}

// Acesso direto a Organization pra fins de billing, sem depender do modulo organizations
// (que esta sob edicao concorrente por outro agente). Mesma convencao do stripe.webhook.ts,
// que ja atualiza Organization via Prisma direto.
export interface IBillingRepository {
  findById(organizationId: string): Promise<OrganizationBillingRow | null>
  findByStripeCustomerId(stripeCustomerId: string): Promise<OrganizationBillingRow | null>
  saveStripeCustomerId(organizationId: string, stripeCustomerId: string): Promise<void>
  updateSubscription(organizationId: string, data: UpdateSubscriptionInput): Promise<void>
}
