import type { PrismaClient } from "@prisma/client"
import { Salon } from "../../domain/salon.entity"
import type { ISalonRepository, DateRange } from "../../domain/salon.repository"
import type { SalonItemDTO } from "../../application/dtos/salon-item.dto"

type SalonRow = {
  id: string; organizationId: string; name: string; address: string | null
  city: string | null; phone: string | null; businessHours: string | null
  totalChairs: number; isActive: boolean; isMain: boolean
}

export class PrismaSalonRepository implements ISalonRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(salon: Salon): Promise<void> {
    await this.prisma.salon.create({
      data: {
        id: salon.id,
        organizationId: salon.organizationId,
        name: salon.name,
        address: salon.address ?? null,
        city: salon.city ?? null,
        phone: salon.phone ?? null,
        businessHours: salon.businessHours ?? null,
        totalChairs: salon.totalChairs,
        isActive: salon.isActive,
        isMain: salon.isMain,
      },
    })
  }

  async list(organizationId: string, range: DateRange): Promise<SalonItemDTO[]> {
    const { monthStart, monthEnd, todayStart, todayEnd } = range
    const now = new Date()
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

    const salons = await this.prisma.salon.findMany({
      where: { organizationId, isActive: true },
      orderBy: [{ isMain: "desc" }, { createdAt: "asc" }],
      include: {
        _count: { select: { professionals: { where: { status: { not: "inativo" } } } } },
        appointments: {
          where: { startsAt: { gte: monthStart, lte: monthEnd }, status: { not: "cancelado" } },
          select: { priceCents: true, startsAt: true, endsAt: true },
        },
      },
    })

    return salons.map((s) => this.toDTO(s, { daysInMonth, todayStart, todayEnd }))
  }

  async findByIdWithMetrics(id: string, organizationId: string, range: DateRange): Promise<SalonItemDTO | null> {
    const { monthStart, monthEnd, todayStart, todayEnd } = range
    const now = new Date()
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

    const s = await this.prisma.salon.findFirst({
      where: { id, organizationId },
      include: {
        _count: { select: { professionals: { where: { status: { not: "inativo" } } } } },
        appointments: {
          where: { startsAt: { gte: monthStart, lte: monthEnd }, status: { not: "cancelado" } },
          select: { priceCents: true, startsAt: true, endsAt: true },
        },
      },
    })

    return s ? this.toDTO(s, { daysInMonth, todayStart, todayEnd }) : null
  }

  async findById(id: string, organizationId: string): Promise<Salon | null> {
    const row = await this.prisma.salon.findFirst({ where: { id, organizationId } })
    return row ? this.toEntity(row) : null
  }

  async update(salon: Salon): Promise<void> {
    await this.prisma.salon.update({
      where: { id: salon.id },
      data: {
        name: salon.name,
        address: salon.address ?? null,
        city: salon.city ?? null,
        phone: salon.phone ?? null,
        businessHours: salon.businessHours ?? null,
        totalChairs: salon.totalChairs,
        isActive: salon.isActive,
        isMain: salon.isMain,
      },
    })
  }

  async softDelete(id: string, _organizationId: string): Promise<void> {
    await this.prisma.salon.update({ where: { id }, data: { isActive: false } })
  }

  async clearMainSalon(organizationId: string): Promise<void> {
    await this.prisma.salon.updateMany({ where: { organizationId, isMain: true }, data: { isMain: false } })
  }

  private toDTO(
    s: SalonRow & {
      _count: { professionals: number }
      appointments: { priceCents: number; startsAt: Date; endsAt: Date }[]
    },
    ctx: { daysInMonth: number; todayStart: Date; todayEnd: Date },
  ): SalonItemDTO {
    const apptDay = s.appointments.filter(
      (a) => a.startsAt >= ctx.todayStart && a.startsAt <= ctx.todayEnd,
    )
    const revenueMth = s.appointments.reduce((sum, a) => sum + a.priceCents, 0)
    const revenueDay = apptDay.reduce((sum, a) => sum + a.priceCents, 0)

    const totalMinutes = s.appointments.reduce(
      (sum, a) => sum + (new Date(a.endsAt).getTime() - new Date(a.startsAt).getTime()) / 60000,
      0,
    )
    const maxMinutes = s.totalChairs * 8 * 60 * ctx.daysInMonth
    const ocupacao = maxMinutes > 0 ? Math.min(Math.round((totalMinutes / maxMinutes) * 100), 100) : 0

    return {
      id: s.id,
      nome: s.name,
      endereco: s.address,
      cidade: s.city,
      telefone: s.phone,
      horario: s.businessHours,
      cadeiras: s.totalChairs,
      ativa: s.isActive,
      principal: s.isMain,
      profissionais: s._count.professionals,
      atendimentosMes: s.appointments.length,
      atendimentosDia: apptDay.length,
      faturamentoMes: revenueMth / 100,
      faturamentoDia: revenueDay / 100,
      ocupacao,
    }
  }

  private toEntity(row: SalonRow): Salon {
    return new Salon(
      {
        organizationId: row.organizationId,
        name: row.name,
        address: row.address ?? undefined,
        city: row.city ?? undefined,
        phone: row.phone ?? undefined,
        businessHours: row.businessHours ?? undefined,
        totalChairs: row.totalChairs,
        isActive: row.isActive,
        isMain: row.isMain,
      },
      row.id,
    )
  }
}
