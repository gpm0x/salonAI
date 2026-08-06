import type { PrismaClient } from "@prisma/client"
import type { DashboardMetricsDTO } from "../../application/dtos/dashboard-metrics.dto"
import type { DashboardInsightsDTO } from "../../application/dtos/dashboard-insights.dto"

function pad(n: number) { return String(n).padStart(2, "0") }
function toTime(d: Date) { return `${pad(d.getHours())}:${pad(d.getMinutes())}` }
function pct(cur: number, prev: number) {
  return prev === 0 ? 0 : Math.round(((cur - prev) / prev) * 100)
}
function dayRange(d: Date) {
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999)
  return { start, end }
}

export class PrismaDashboardRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getMetrics(organizationId: string): Promise<DashboardMetricsDTO> {
    const now = new Date()
    const today = dayRange(now)
    const yesterday = dayRange(new Date(now.getTime() - 86400000))
    const lastWeekSameDay = dayRange(new Date(now.getTime() - 7 * 86400000))

    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7))
    weekStart.setHours(0, 0, 0, 0)
    const prevWeekStart = new Date(weekStart.getTime() - 7 * 86400000)
    const prevWeekEnd = new Date(weekStart.getTime() - 1)

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)

    const [
      apptHoje,
      apptLastWeekSameDay,
      novosClientes,
      proximoAppt,
      salonsAggregate,
      apptOntemProfs,
      apptHojeProfs,
      apptMes,
      apptPrevMes,
      serieRaw,
      faturamentoHoje,
      faturamentoSemana,
      faturamentoPrevSemana,
    ] = await Promise.all([
      // apptHoje — com includes para agendaHoje e profissionais
      this.prisma.appointment.findMany({
        where: { organizationId, startsAt: { gte: today.start, lte: today.end } },
        orderBy: { startsAt: "asc" },
        include: {
          client: { select: { name: true } },
          service: { select: { name: true } },
          professional: { select: { name: true, specialty: true } },
        },
      }),
      // apptLastWeekSameDay — só count
      this.prisma.appointment.count({
        where: { organizationId, startsAt: { gte: lastWeekSameDay.start, lte: lastWeekSameDay.end } },
      }),
      // novosClientes hoje
      this.prisma.client.count({
        where: { organizationId, createdAt: { gte: today.start, lte: today.end } },
      }),
      // próximo agendamento
      this.prisma.appointment.findFirst({
        where: {
          organizationId,
          startsAt: { gt: now },
          status: { in: ["aguardando", "confirmado"] },
        },
        orderBy: { startsAt: "asc" },
        include: { client: { select: { name: true } } },
      }),
      // sum totalChairs de salons ativos
      this.prisma.salon.aggregate({
        where: { organizationId, isActive: true },
        _sum: { totalChairs: true },
      }),
      // profissionais com appt ontem (para variacao ocupacao)
      this.prisma.appointment.findMany({
        where: {
          organizationId,
          status: { not: "cancelado" },
          startsAt: { gte: yesterday.start, lte: yesterday.end },
        },
        select: { professionalId: true },
        distinct: ["professionalId"],
      }),
      // profissionais com appt hoje
      this.prisma.appointment.findMany({
        where: {
          organizationId,
          status: { not: "cancelado" },
          startsAt: { gte: today.start, lte: today.end },
        },
        select: { professionalId: true },
        distinct: ["professionalId"],
      }),
      // appointments do mês atual (tempo médio)
      this.prisma.appointment.findMany({
        where: {
          organizationId,
          status: { not: "cancelado" },
          startsAt: { gte: monthStart, lte: monthEnd },
        },
        select: { startsAt: true, endsAt: true, serviceId: true, service: { select: { name: true } } },
      }),
      // appointments do mês anterior (tempo médio variacao)
      this.prisma.appointment.findMany({
        where: {
          organizationId,
          status: { not: "cancelado" },
          startsAt: { gte: prevMonthStart, lte: prevMonthEnd },
        },
        select: { startsAt: true, endsAt: true },
      }),
      // série de 7 dias — executar 7 aggregates em paralelo
      Promise.all(
        Array.from({ length: 7 }, (_, i) => {
          const d = dayRange(new Date(now.getTime() - (6 - i) * 86400000))
          return this.prisma.appointment.aggregate({
            where: {
              organizationId,
              status: { not: "cancelado" },
              startsAt: { gte: d.start, lte: d.end },
            },
            _sum: { priceCents: true },
          })
        }),
      ),
      // faturamento hoje
      this.prisma.appointment.aggregate({
        where: { organizationId, status: { not: "cancelado" }, startsAt: { gte: today.start, lte: today.end } },
        _sum: { priceCents: true },
      }),
      // faturamento semana atual
      this.prisma.appointment.aggregate({
        where: { organizationId, status: { not: "cancelado" }, startsAt: { gte: weekStart, lte: today.end } },
        _sum: { priceCents: true },
      }),
      // faturamento semana anterior
      this.prisma.appointment.aggregate({
        where: { organizationId, status: { not: "cancelado" }, startsAt: { gte: prevWeekStart, lte: prevWeekEnd } },
        _sum: { priceCents: true },
      }),
    ])

    // ── resumoDia ──
    const statusMap: Record<string, number> = {}
    for (const a of apptHoje) {
      statusMap[a.status] = (statusMap[a.status] ?? 0) + 1
    }
    const porStatus = Object.entries(statusMap).map(([status, total]) => ({ status, total }))
    const variacaoDia = pct(apptHoje.length, apptLastWeekSameDay)

    // ── faturamento ──
    const hojeReais = (faturamentoHoje._sum.priceCents ?? 0) / 100
    const semanaReais = (faturamentoSemana._sum.priceCents ?? 0) / 100
    const prevSemanaReais = (faturamentoPrevSemana._sum.priceCents ?? 0) / 100
    const serie = serieRaw.map((r) => (r._sum.priceCents ?? 0) / 100)

    // ── ocupacao ──
    const cadeirasTotais = salonsAggregate._sum.totalChairs ?? 1
    const cadeirasOcupadas = apptHojeProfs.length
    const cadeirasOntens = apptOntemProfs.length
    const taxaHoje = Math.min(Math.round((cadeirasOcupadas / cadeirasTotais) * 100), 100)
    const taxaOntem = Math.min(Math.round((cadeirasOntens / cadeirasTotais) * 100), 100)

    // ── tempoMedio ──
    const avgMin = (appts: { startsAt: Date; endsAt: Date }[]) => {
      if (appts.length === 0) return 0
      const total = appts.reduce(
        (s, a) => s + (new Date(a.endsAt).getTime() - new Date(a.startsAt).getTime()) / 60000,
        0,
      )
      return Math.round(total / appts.length)
    }
    const minutosMes = avgMin(apptMes)
    const minutosPrevMes = avgMin(apptPrevMes)

    const servicoMap: Record<string, { total: number; count: number }> = {}
    for (const a of apptMes) {
      const nome = (a as { service?: { name: string } }).service?.name ?? "Desconhecido"
      const min = (new Date(a.endsAt).getTime() - new Date(a.startsAt).getTime()) / 60000
      if (!servicoMap[nome]) servicoMap[nome] = { total: 0, count: 0 }
      servicoMap[nome].total += min
      servicoMap[nome].count += 1
    }
    const porServico = Object.entries(servicoMap)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([nome, v]) => ({ nome, minutos: Math.round(v.total / v.count) }))

    // ── agendaHoje ──
    const agendaHoje = apptHoje.map((a) => ({
      hora: toTime(a.startsAt),
      cliente: a.client.name,
      servico: a.service.name,
      profissional: a.professional.name,
      status: a.status,
    }))

    // ── profissionais (top 3) ──
    const profMap: Record<
      string,
      { nome: string; especialidade: string | null; atendimentos: number; faturamento: number }
    > = {}
    for (const a of apptHoje) {
      const pid = a.professionalId
      if (!profMap[pid]) {
        profMap[pid] = {
          nome: a.professional.name,
          especialidade: a.professional.specialty ?? null,
          atendimentos: 0,
          faturamento: 0,
        }
      }
      profMap[pid].atendimentos += 1
      profMap[pid].faturamento += a.priceCents / 100
    }
    const profissionais = Object.values(profMap)
      .sort((a, b) => b.atendimentos - a.atendimentos)
      .slice(0, 3)
      .map((p) => ({
        ...p,
        ocupacao: Math.min(Math.round((p.atendimentos / 8) * 100), 100),
      }))

    return {
      resumoDia: {
        variacao: variacaoDia,
        novosClientes,
        proximo: proximoAppt
          ? { hora: toTime(proximoAppt.startsAt), cliente: proximoAppt.client.name }
          : null,
        porStatus,
      },
      faturamento: {
        hoje: hojeReais,
        metaDia: 0,
        semana: semanaReais,
        variacaoSemana: pct(semanaReais, prevSemanaReais),
        serie,
      },
      ocupacao: {
        taxa: taxaHoje,
        cadeirasOcupadas,
        cadeirasTotais,
        variacao: taxaHoje - taxaOntem,
      },
      tempoMedio: {
        minutos: minutosMes,
        variacao: pct(minutosMes, minutosPrevMes),
        porServico,
      },
      agendaHoje,
      profissionais,
    }
  }

  async getInsights(organizationId: string): Promise<DashboardInsightsDTO> {
    const alerts = await this.prisma.alert.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    })

    const data = alerts.map((a) => ({
      id: a.id,
      area: a.area,
      tom: a.tone,
      titulo: a.title,
      descricao: a.description,
      impacto: a.impactCents / 100,
      confianca: a.confidence,
      acao: a.action ?? null,
    }))

    const oportunidades = alerts.filter((a) => a.tone === "oportunidade")
    const riscos = alerts.filter((a) => a.tone === "risco")
    const confiancaMedia =
      alerts.length > 0 ? Math.round(alerts.reduce((s, a) => s + a.confidence, 0) / alerts.length) : 0

    return {
      data,
      resumo: {
        total: alerts.length,
        oportunidades: oportunidades.length,
        riscos: riscos.length,
        impactoPotencial: oportunidades.reduce((s, a) => s + a.impactCents, 0) / 100,
        receitaEmRisco: riscos.reduce((s, a) => s + a.impactCents, 0) / 100,
        confiancaMedia,
      },
    }
  }
}
