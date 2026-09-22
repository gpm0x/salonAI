/**
 * Único lugar onde os caminhos da API aparecem como string.
 *
 * Espelha os prefixos registrados em `apps/api/src/app.ts`. Se uma rota mudar
 * lá, o typecheck do front não acusa: mas só um arquivo precisa mudar aqui.
 */
export const endpoints = {
  organizations: {
    root: "/api/organizations",
    current: "/api/organizations/current",
    members: "/api/organizations/members",
    memberRole: (userId: string) => `/api/organizations/members/${userId}/role`,
  },
  dashboard: {
    metrics: "/api/dashboard/metrics",
    insights: "/api/dashboard/insights",
  },
  clients: {
    root: "/api/clients",
    byId: (id: string) => `/api/clients/${id}`,
  },
  appointments: {
    root: "/api/appointments",
    byId: (id: string) => `/api/appointments/${id}`,
    status: (id: string) => `/api/appointments/${id}/status`,
    complete: (id: string) => `/api/appointments/${id}/complete`,
  },
  professionals: {
    root: "/api/professionals",
    byId: (id: string) => `/api/professionals/${id}`,
  },
  services: {
    root: "/api/services",
    byId: (id: string) => `/api/services/${id}`,
  },
  salons: {
    root: "/api/salons",
    byId: (id: string) => `/api/salons/${id}`,
  },
  transactions: {
    root: "/api/transactions",
    resumo: "/api/transactions/resumo",
    report: "/api/transactions/report",
    byId: (id: string) => `/api/transactions/${id}`,
  },
  alerts: {
    root: "/api/alerts",
    generate: "/api/alerts/generate",
    read: (id: string) => `/api/alerts/${id}/read`,
  },
  onboarding: {
    status: "/api/onboarding/status",
  },
  public: {
    salon: (slug: string) => `/api/public/salons/${slug}`,
    availability: (slug: string) => `/api/public/salons/${slug}/availability`,
    appointments: "/api/public/appointments",
  },
  billing: {
    checkout: "/api/billing/checkout",
    portal: "/api/billing/portal",
  },
} as const;

/**
 * Chaves de cache do React Query. Centralizadas para que uma invalidação
 * (`queryClient.invalidateQueries({ queryKey: qk.clients.all })`) nunca
 * dependa de um array literal repetido em dois lugares.
 */
export const qk = {
  organization: {
    current: ["organization", "current"] as const,
    members: ["organization", "members"] as const,
  },
  dashboard: {
    metrics: ["dashboard", "metrics"] as const,
    insights: ["dashboard", "insights"] as const,
  },
  clients: {
    all: ["clients"] as const,
    list: (search?: string) => ["clients", { search: search ?? "" }] as const,
    detail: (id: string) => ["clients", id] as const,
  },
  appointments: {
    all: ["appointments"] as const,
    list: (filtros?: Record<string, string>) =>
      ["appointments", filtros ?? {}] as const,
    detail: (id: string) => ["appointments", id] as const,
  },
  professionals: {
    all: ["professionals"] as const,
    detail: (id: string) => ["professionals", id] as const,
  },
  services: {
    all: ["services"] as const,
    detail: (id: string) => ["services", id] as const,
  },
  salons: {
    all: ["salons"] as const,
    detail: (id: string) => ["salons", id] as const,
  },
  transactions: {
    all: ["transactions"] as const,
    list: (mes?: string) => ["transactions", { mes: mes ?? "atual" }] as const,
    resumo: (mes?: string) =>
      ["transactions", "resumo", { mes: mes ?? "atual" }] as const,
  },
  alerts: { all: ["alerts"] as const },
  onboarding: { status: ["onboarding", "status"] as const },
} as const;
