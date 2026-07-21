export type SubscriptionStatus = "trialing" | "active" | "past_due" | "canceled";

export interface Organization {
  id: string;
  name: string;
  ownerId: string;
  subscriptionStatus: SubscriptionStatus;
  createdAt: string;
  updatedAt: string;
}
