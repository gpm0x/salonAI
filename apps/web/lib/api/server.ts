/**
 * Leitura da API a partir de Server Components.
 *
 * Toda função aqui devolve `null` quando a chamada falha (API fora do ar, 401,
 * 500…) em vez de lançar: assim uma página do dashboard renderiza em estado
 * vazio no lugar de derrubar a árvore inteira. Quem chama decide o fallback.
 *
 * Em Client Components use `lib/api/hooks.ts`.
 */

import "server-only";

import { apiFetch } from "@/lib/api-server";
import { endpoints } from "./endpoints";
import type {
  AlertItem,
  AppointmentItem,
  ClientItem,
  DashboardInsights,
  DashboardMetrics,
  Lista,
  Organization,
  ProfessionalItem,
  SalonItem,
  ServiceItem,
  TransactionItem,
  TransactionSummary,
} from "./types";

/** Desembrulha `{ data }` preservando o `null` de falha. */
async function lista<T>(path: string): Promise<T[] | null> {
  const res = await apiFetch<Lista<T>>(path);
  return res?.data ?? null;
}

function comQuery(path: string, params: Record<string, string | undefined>) {
  const entradas = Object.entries(params).filter(
    (e): e is [string, string] => e[1] !== undefined,
  );
  if (entradas.length === 0) return path;
  return `${path}?${new URLSearchParams(entradas).toString()}`;
}

export const api = {
  organizacaoAtual: () => apiFetch<Organization>(endpoints.organizations.current),

  dashboard: {
    metricas: () => apiFetch<DashboardMetrics>(endpoints.dashboard.metrics),
    insights: () => apiFetch<DashboardInsights>(endpoints.dashboard.insights),
  },

  clientes: {
    listar: () => lista<ClientItem>(endpoints.clients.root),
    obter: (id: string) => apiFetch<ClientItem>(endpoints.clients.byId(id)),
  },

  agendamentos: {
    listar: (filtros?: { data?: string; salonId?: string }) =>
      lista<AppointmentItem>(comQuery(endpoints.appointments.root, filtros ?? {})),
    obter: (id: string) =>
      apiFetch<AppointmentItem>(endpoints.appointments.byId(id)),
  },

  profissionais: {
    listar: () => lista<ProfessionalItem>(endpoints.professionals.root),
  },

  servicos: {
    listar: () => lista<ServiceItem>(endpoints.services.root),
  },

  unidades: {
    listar: () => lista<SalonItem>(endpoints.salons.root),
  },

  transacoes: {
    listar: (mes?: string) =>
      lista<TransactionItem>(comQuery(endpoints.transactions.root, { mes })),
    resumo: (mes?: string) =>
      apiFetch<TransactionSummary>(
        comQuery(endpoints.transactions.resumo, { mes }),
      ),
  },

  alertas: {
    listar: () => lista<AlertItem>(endpoints.alerts.root),
  },
};
