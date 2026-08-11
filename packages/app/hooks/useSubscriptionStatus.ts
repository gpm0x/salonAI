"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

interface OrgCurrent {
  id: string;
  name: string;
  subscriptionStatus: "trialing" | "active" | "past_due" | "canceled" | string;
}

export function useSubscriptionStatus() {
  const { data, isLoading } = useQuery<OrgCurrent>({
    queryKey: ["org", "current"],
    queryFn: () => apiClient.get<OrgCurrent>("/api/organizations/current"),
    staleTime: 10 * 60 * 1000,
  });

  const status = data?.subscriptionStatus ?? "trialing";
  const isActive = status === "active" || status === "trialing";
  const isPastDue = status === "past_due";
  const isCanceled = status === "canceled";

  return { status, isActive, isPastDue, isCanceled, orgName: data?.name, isLoading };
}
