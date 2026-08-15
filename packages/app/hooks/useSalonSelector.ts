"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";

export interface SalonItem {
  id: string;
  nome: string;
  ativa: boolean;
  principal: boolean;
  atendimentosDia: number;
  faturamentoDia: number;
}

const STORAGE_KEY = "salon:selected";

export function useSalonSelector() {
  const { data: salons = [], isLoading } = useQuery<SalonItem[]>({
    queryKey: ["salons"],
    queryFn: () =>
      apiClient.get<{ data: SalonItem[] }>("/api/salons").then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (salons.length === 0) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    const valid = stored && salons.find((s) => s.id === stored);
    if (valid) {
      setSelectedId(stored);
    } else {
      const principal = salons.find((s) => s.principal) ?? salons[0];
      setSelectedId(principal.id);
    }
  }, [salons]);

  function selectSalon(id: string) {
    setSelectedId(id);
    localStorage.setItem(STORAGE_KEY, id);
  }

  const selectedSalon = salons.find((s) => s.id === selectedId) ?? salons[0] ?? null;

  return { salons, selectedSalon, selectedId, selectSalon, isLoading };
}
