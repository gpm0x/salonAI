import type { PrismaClient } from "@prisma/client"
import { Alert } from "../../domain/alert.entity"
import type { IAlertRepository, ProfOccupancyRow, ServiceTrendRow } from "../../domain/alert.repository"
import type { AlertItemDTO } from "../../application/dtos/alert-item.dto"

export class PrismaAlertRepository implements IAlertRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getProfessionalOccupancyData(organizationId: string): Promise<ProfOccupancyRow[]> {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const rows = await this.prisma.appointment.groupBy({
      by: ["professionalId"],
      where: {
        organizationId,
        status: { not: "cancelado" },
        startsAt: { gte: since },
      },
      _count: { id: true },
    })

    if (rows.length === 0) return []

    const profs = await this.prisma.professional.findMany({
      where: { id: { in: rows.map((r) => r.professionalId) } },
      select: { id: true, name: true },
    })
    const nameMap = Object.fromEntries(profs.map((p) => [p.id, p.name]))

    return rows.map((r) => ({
      id: r.professionalId,
      name: nameMap[r.professionalId] ?? "Desconhecido",
      appointmentCount: r._count.id,
    }))
  }

  async getStaleClientsCount(organizationId: string, daysThreshold: number): Promise<number> {
    const cutoff = new Date(Date.now() - daysThreshold * 24 * 60 * 60 * 1000)

    const recent = await this.prisma.appointment.findMany({
      where: { organizationId, startsAt: { gte: cutoff } },
      select: { clientId: true },
      distinct: ["clientId"],
    })
    const activeIds = recent.map((r) => r.clientId)

    return this.prisma.client.count({
      where: {
        organizationId,
        ...(activeIds.length > 0 ? { id: { notIn: activeIds } } : {}),
      },
    })
  }

  async getServiceTrendData(organizationId: string): Promise<ServiceTrendRow[]> {
    const now = new Date()
    const curStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const curEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const prevEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)

    const [curRows, prevRows] = await Promise.all([
      this.prisma.appointment.groupBy({
        by: ["serviceId"],
        where: { organizationId, status: { not: "cancelado" }, startsAt: { gte: curStart, lte: curEnd } },
        _count: { id: true },
        _avg: { priceCents: true },
      }),
      this.prisma.appointment.groupBy({
        by: ["serviceId"],
        where: { organizationId, status: { not: "cancelado" }, startsAt: { gte: prevStart, lte: prevEnd } },
        _count: { id: true },
      }),
    ])

    if (curRows.length === 0 && prevRows.length === 0) return []

    const allIds = [...new Set([...curRows.map((r) => r.serviceId), ...prevRows.map((r) => r.serviceId)])]
    const services = await this.prisma.service.findMany({
      where: { id: { in: allIds } },
      select: { id: true, name: true, priceCents: true },
    })
    const svcMap = Object.fromEntries(services.map((s) => [s.id, s]))

    const prevMap: Record<string, number> = {}
    for (const r of prevRows) prevMap[r.serviceId] = r._count.id

    return curRows.map((r) => ({
      name: svcMap[r.serviceId]?.name ?? "Desconhecido",
      currentCount: r._count.id,
      prevCount: prevMap[r.serviceId] ?? 0,
      avgPriceCents: Math.round(r._avg.priceCents ?? svcMap[r.serviceId]?.priceCents ?? 0),
    }))
  }

  async createMany(alerts: Alert[]): Promise<void> {
    await this.prisma.alert.createMany({
      data: alerts.map((a) => ({
        id: a.id,
        organizationId: a.organizationId,
        area: a.area,
        tone: a.tone,
        title: a.title,
        description: a.description,
        impactCents: a.impactCents,
        confidence: a.confidence,
        action: a.action ?? null,
        isRead: false,
      })),
    })
  }

  async list(organizationId: string): Promise<AlertItemDTO[]> {
    const rows = await this.prisma.alert.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    })
    return rows.map((r) => ({
      id: r.id,
      area: r.area,
      tom: r.tone,
      titulo: r.title,
      descricao: r.description,
      impacto: r.impactCents / 100,
      confianca: r.confidence,
      acao: r.action ?? null,
      lido: r.isRead,
      criadoEm: r.createdAt.toISOString(),
    }))
  }

  async markAsRead(id: string, organizationId: string): Promise<void> {
    await this.prisma.alert.updateMany({
      where: { id, organizationId },
      data: { isRead: true },
    })
  }

  async clearUnread(organizationId: string): Promise<void> {
    await this.prisma.alert.deleteMany({
      where: { organizationId, isRead: false },
    })
  }
}
