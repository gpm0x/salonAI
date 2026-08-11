import { Alert } from "./domain/alert.entity"
import type { ProfOccupancyRow, ServiceTrendRow } from "./domain/alert.repository"

const WEEKLY_MAX_SLOTS = 40 // 8 slots/dia × 5 dias úteis

export function occupancyAlerts(professionals: ProfOccupancyRow[], organizationId: string): Alert[] {
  return professionals
    .filter((p) => p.appointmentCount / WEEKLY_MAX_SLOTS > 0.9)
    .map((p) => {
      const pct = Math.round((p.appointmentCount / WEEKLY_MAX_SLOTS) * 100)
      return Alert.create({
        organizationId,
        area: "ocupacao",
        tone: "risco",
        title: `${p.name} com ocupação crítica (${pct}%)`,
        description: `${p.name} tem ${p.appointmentCount} agendamentos nos últimos 7 dias — ${pct}% da capacidade. Risco de esgotamento e cancelamentos.`,
        impactCents: 0,
        confidence: 85,
        action: "Redistribua agendamentos ou reforce a equipe.",
      })
    })
}

export function retentionAlerts(
  staleCount: number,
  avgTicketCents: number,
  organizationId: string,
): Alert[] {
  if (staleCount === 0) return []
  return [
    Alert.create({
      organizationId,
      area: "retencao",
      tone: "oportunidade",
      title: `${staleCount} clientes sem visita há mais de 45 dias`,
      description: `${staleCount} clientes não retornam há mais de 45 dias. Uma campanha de reativação pode recuperar parte desse público.`,
      impactCents: Math.round(staleCount * avgTicketCents * 0.3),
      confidence: 75,
      action: "Envie mensagem de reativação com desconto exclusivo.",
    }),
  ]
}

export function serviceTrendAlerts(services: ServiceTrendRow[], organizationId: string): Alert[] {
  return services
    .filter((s) => s.prevCount > 0 && (s.prevCount - s.currentCount) / s.prevCount > 0.2)
    .map((s) => {
      const dropPct = Math.round(((s.prevCount - s.currentCount) / s.prevCount) * 100)
      return Alert.create({
        organizationId,
        area: "servicos",
        tone: "tendencia",
        title: `Queda de ${dropPct}% em "${s.name}"`,
        description: `"${s.name}" teve ${s.currentCount} agendamentos este mês contra ${s.prevCount} no anterior — queda de ${dropPct}%.`,
        impactCents: (s.prevCount - s.currentCount) * s.avgPriceCents,
        confidence: 70,
        action: "Avalie promoção ou ajuste de preço para o serviço.",
      })
    })
}
