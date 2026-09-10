import { Entity } from "@/shared/domain/entity"

interface OrganizationProps {
  name: string
  ownerId: string
  slug?: string
  subscriptionStatus: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
}

export class Organization extends Entity<OrganizationProps> {
  get name() { return this.props.name }
  get ownerId() { return this.props.ownerId }
  get slug() { return this.props.slug }
  get subscriptionStatus() { return this.props.subscriptionStatus }
  get stripeCustomerId() { return this.props.stripeCustomerId }
  get stripeSubscriptionId() { return this.props.stripeSubscriptionId }

  static create(props: Omit<OrganizationProps, "subscriptionStatus">, id?: string): Organization {
    return new Organization({ ...props, subscriptionStatus: "trialing" }, id)
  }
}
