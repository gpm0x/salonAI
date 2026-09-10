"use client";

/**
 * Acesso à API a partir de Client Components, via React Query.
 *
 * Os `useXxx` leem; os `useXxxMutation` escrevem e invalidam as chaves
 * afetadas. Em Server Components use `lib/api/server.ts`.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { endpoints, qk } from "./endpoints";
import type {
  AlertItem,
  AppointmentItem,
  ClientItem,
  CreateAppointmentInput,
  CreateClientInput,
  DashboardInsights,
  DashboardMetrics,
  Lista,
  Organization,
  ProfessionalItem,
  SalonItem,
  ServiceItem,
  TransactionItem,
  TransactionSummary,
  UpdateClientInput,
} from "./types";

const listaDe = <T>(path: string) => () =>
  apiClient.get<Lista<T>>(path).then((r) => r.data);

function comQuery(path: string, params: Record<string, string | undefined>) {
  const entradas = Object.entries(params).filter(
    (e): e is [string, string] => e[1] !== undefined,
  );
  if (entradas.length === 0) return path;
  return `${path}?${new URLSearchParams(entradas).toString()}`;
}

// ── Organização ──────────────────────────────────────

export function useOrganizacaoAtual() {
  return useQuery<Organization>({
    queryKey: qk.organization.current,
    queryFn: () => apiClient.get<Organization>(endpoints.organizations.current),
    staleTime: 10 * 60 * 1000,
  });
}

// ── Dashboard ────────────────────────────────────────

export function useDashboardMetricas() {
  return useQuery<DashboardMetrics>({
    queryKey: qk.dashboard.metrics,
    queryFn: () => apiClient.get<DashboardMetrics>(endpoints.dashboard.metrics),
  });
}

export function useDashboardInsights() {
  return useQuery<DashboardInsights>({
    queryKey: qk.dashboard.insights,
    queryFn: () =>
      apiClient.get<DashboardInsights>(endpoints.dashboard.insights),
  });
}

// ── Clientes ─────────────────────────────────────────

export function useClientes() {
  return useQuery<ClientItem[]>({
    queryKey: qk.clients.all,
    queryFn: listaDe<ClientItem>(endpoints.clients.root),
  });
}

export function useCriarCliente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateClientInput) =>
      apiClient.post<{ clientId: string }>(endpoints.clients.root, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.clients.all }),
  });
}

export function useAtualizarCliente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: UpdateClientInput & { id: string }) =>
      apiClient.put<void>(endpoints.clients.byId(id), input),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.clients.all }),
  });
}

export function useRemoverCliente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(endpoints.clients.byId(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.clients.all }),
  });
}

// ── Agendamentos ─────────────────────────────────────

export function useAgendamentos(filtros?: { data?: string; salonId?: string }) {
  return useQuery<AppointmentItem[]>({
    queryKey: qk.appointments.list(filtros as Record<string, string> | undefined),
    queryFn: listaDe<AppointmentItem>(
      comQuery(endpoints.appointments.root, filtros ?? {}),
    ),
  });
}

export function useCriarAgendamento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAppointmentInput) =>
      apiClient.post<{ appointmentId: string }>(
        endpoints.appointments.root,
        input,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.appointments.all });
      qc.invalidateQueries({ queryKey: qk.dashboard.metrics });
    },
  });
}

export function useAtualizarStatusAgendamento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiClient.patch<void>(endpoints.appointments.status(id), { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.appointments.all });
      qc.invalidateQueries({ queryKey: qk.dashboard.metrics });
    },
  });
}

export function useCancelarAgendamento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete<void>(endpoints.appointments.byId(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.appointments.all });
      qc.invalidateQueries({ queryKey: qk.dashboard.metrics });
    },
  });
}

// ── Profissionais / Serviços / Unidades ──────────────

export function useProfissionais() {
  return useQuery<ProfessionalItem[]>({
    queryKey: qk.professionals.all,
    queryFn: listaDe<ProfessionalItem>(endpoints.professionals.root),
  });
}

export function useServicos() {
  return useQuery<ServiceItem[]>({
    queryKey: qk.services.all,
    queryFn: listaDe<ServiceItem>(endpoints.services.root),
  });
}

export function useUnidades() {
  return useQuery<SalonItem[]>({
    queryKey: qk.salons.all,
    queryFn: listaDe<SalonItem>(endpoints.salons.root),
    staleTime: 5 * 60 * 1000,
  });
}

// ── Financeiro ───────────────────────────────────────

export function useTransacoes(mes?: string) {
  return useQuery<TransactionItem[]>({
    queryKey: qk.transactions.list(mes),
    queryFn: listaDe<TransactionItem>(
      comQuery(endpoints.transactions.root, { mes }),
    ),
  });
}

export function useResumoFinanceiro(mes?: string) {
  return useQuery<TransactionSummary>({
    queryKey: qk.transactions.resumo(mes),
    queryFn: () =>
      apiClient.get<TransactionSummary>(
        comQuery(endpoints.transactions.resumo, { mes }),
      ),
  });
}

// ── Alertas ──────────────────────────────────────────

export function useAlertas() {
  return useQuery<AlertItem[]>({
    queryKey: qk.alerts.all,
    queryFn: listaDe<AlertItem>(endpoints.alerts.root),
  });
}

export function useMarcarAlertaLido() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.patch<void>(endpoints.alerts.read(id), {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.alerts.all }),
  });
}
