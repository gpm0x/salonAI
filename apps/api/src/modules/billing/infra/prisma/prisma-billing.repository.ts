import type { PrismaClient } from "@prisma/client"
import type {
  IBillingRepository,
  OrganizationBillingRow,
  UpdateSubscriptionInput,
} from "../../domain/billing.repository"

export class PrismaBillingRepository implements IBillingRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(organizationId: string): Promise<OrganizationBillingRow | null> {
    return this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: { id: true, name: true, stripeCustomerId: true, stripeSubscriptionId: true, subscriptionStatus: true },
    })
  }

  async findByStripeCustomerId(stripeCustomerId: string): Promise<OrganizationBillingRow | null> {
    return this.prisma.organization.findUnique({
      where: { stripeCustomerId },
      select: { id: true, name: true, stripeCustomerId: true, stripeSubscriptionId: true, subscriptionStatus: true },
    })
  }

  async saveStripeCustomerId(organizationId: string, stripeCustomerId: string): Promise<void> {
    await this.prisma.organization.update({
      where: { id: organizationId },
      data: { stripeCustomerId },
    })
  }

  async updateSubscription(organizationId: string, data: UpdateSubscriptionInput): Promise<void> {
    await this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        subscriptionStatus: data.subscriptionStatus,
        ...(data.stripeSubscriptionId ? { stripeSubscriptionId: data.stripeSubscriptionId } : {}),
      },
    })
  }
}
