"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface AppointmentItem {
  id: string;
  data: string;
  inicio: string;
  fim: string;
  duracao: number;
  cliente: string;
  clienteId: string;
  servico: string;
  servicoId: string;
  profissional: string;
  profissionalId: string;
  unidade: string;
  salonId: string;
  status: string;
  valor: number;
  observacoes?: string | null;
}

export function useRealtimeAppointments(date?: string) {
  const today = date ?? new Date().toISOString().slice(0, 10);

  return useQuery<AppointmentItem[]>({
    queryKey: ["appointments", today],
    queryFn: () =>
      apiClient.get<AppointmentItem[]>(`/api/appointments?data=${today}`),
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
}
