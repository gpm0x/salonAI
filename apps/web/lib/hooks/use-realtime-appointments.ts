"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { endpoints, qk } from "@/lib/api/endpoints";
import type { AppointmentItem, Lista } from "@/lib/api/types";

interface RealtimeAppointmentsFilters {
  date: string;
  salonId: string;
  professionalId?: string;
}

function buildAppointmentsPath(filters: RealtimeAppointmentsFilters): string {
  const params = new URLSearchParams({ data: filters.date, salonId: filters.salonId });
  if (filters.professionalId) params.set("professionalId", filters.professionalId);
  return `${endpoints.appointments.root}?${params.toString()}`;
}

/**
 * Poll de agendamentos pra manter a agenda atualizada sem depender de WebSocket.
 *
 * O GET /api/appointments hoje só filtra por `data` no backend: salonId e
 * professionalId entram aqui e na query key pra manter o cache correto por
 * combinação de filtros, e já deixam o hook pronto pro dia em que o backend
 * passar a filtrar por eles também.
 */
export function useRealtimeAppointments(filters: RealtimeAppointmentsFilters) {
  return useQuery<AppointmentItem[]>({
    queryKey: qk.appointments.list({
      data: filters.date,
      salonId: filters.salonId,
      professionalId: filters.professionalId ?? "",
    }),
    queryFn: () =>
      apiClient
        .get<Lista<AppointmentItem>>(buildAppointmentsPath(filters))
        .then((r) => r.data),
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
    staleTime: 15_000,
  });
}
