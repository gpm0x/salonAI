import type { PrismaClient } from "@prisma/client"
import { Professional } from "../../domain/professional.entity"
import type { IProfessionalRepository } from "../../domain/professional.repository"
import type { ProfessionalItemDTO } from "../../application/dtos/professional-item.dto"

type ProfessionalRow = {
  id: string; organizationId: string; salonId: string | null; name: string
  specialty: string | null; email: string | null; phone: string | null
  status: string; commissionPct: { toNumber(): number }; rating: { toNumber(): number }
  workingServices: string[]; workingDays: string[]; workingHours: string | null
  hiredAt: Date | null
}

export class PrismaProfessionalRepository implements IProfessionalRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(p: Professional): Promise<void> {
    await this.prisma.professional.create({
      data: {
        id: p.id,
        organizationId: p.organizationId,
        salonId: p.salonId ?? null,
        name: p.name,
        specialty: p.specialty ?? null,
        email: p.email ?? null,
        phone: p.phone ?? null,
        status: p.status,
        commissionPct: p.commissionPct,
        rating: p.rating,
        workingServices: p.workingServices,
        workingDays: p.workingDays,
        workingHours: p.workingHours ?? null,
        hiredAt: p.hiredAt ?? null,
      },
    })
  }

  async list(organizationId: string, monthStart: Date, monthEnd: Date): Promise<ProfessionalItemDTO[]> {
    const rows = await this.prisma.professional.findMany({
      where: { organizationId, status: { not: "inativo" } },
      orderBy: { createdAt: "asc" },
      include: {
        salon: { select: { name: true } },
        appointments: {
          where: { startsAt: { gte: monthStart, lte: monthEnd }, status: { not: "cancelado" } },
          select: { priceCents: true, startsAt: true, endsAt: true },
        },
      },
    })

    return rows.map((r) => this.toDTO(r))
  }

  async findByIdWithMetrics(id: string, organizationId: string, monthStart: Date, monthEnd: Date): Promise<ProfessionalItemDTO | null> {
    const r = await this.prisma.professional.findFirst({
      where: { id, organizationId },
      include: {
        salon: { select: { name: true } },
        appointments: {
          where: { startsAt: { gte: monthStart, lte: monthEnd }, status: { not: "cancelado" } },
          select: { priceCents: true, startsAt: true, endsAt: true },
        },
      },
    })
    return r ? this.toDTO(r) : null
  }

  async findById(id: string, organizationId: string): Promise<Professional | null> {
    const row = await this.prisma.professional.findFirst({ where: { id, organizationId } })
    return row ? this.toEntity(row) : null
  }

  async update(p: Professional): Promise<void> {
    await this.prisma.professional.update({
      where: { id: p.id },
      data: {
        salonId: p.salonId ?? null,
        name: p.name,
        specialty: p.specialty ?? null,
        email: p.email ?? null,
        phone: p.phone ?? null,
        status: p.status,
        commissionPct: p.commissionPct,
        rating: p.rating,
        workingServices: p.workingServices,
        workingDays: p.workingDays,
        workingHours: p.workingHours ?? null,
        hiredAt: p.hiredAt ?? null,
      },
    })
  }

  async softDelete(id: string, _organizationId: string): Promise<void> {
    await this.prisma.professional.update({ where: { id }, data: { status: "inativo" } })
  }

  private toDTO(
    r: ProfessionalRow & {
      salon: { name: string } | null
      appointments: { priceCents: number; startsAt: Date; endsAt: Date }[]
    },
  ): ProfessionalItemDTO {
    const totalMinutes = r.appointments.reduce(
      (sum, a) => sum + (new Date(a.endsAt).getTime() - new Date(a.startsAt).getTime()) / 60000,
      0,
    )
    const maxMinutes = 22 * 8 * 60
    const ocupacao = maxMinutes > 0 ? Math.min(Math.round((totalMinutes / maxMinutes) * 100), 100) : 0
    const faturamentoMes = r.appointments.reduce((sum, a) => sum + a.priceCents, 0) / 100

    return {
      id: r.id,
      nome: r.name,
      especialidade: r.specialty,
      email: r.email,
      telefone: r.phone,
      status: r.status,
      desde: r.hiredAt ? r.hiredAt.toISOString() : null,
      comissao: Number(r.commissionPct),
      avaliacao: Number(r.rating),
      servicos: r.workingServices,
      dias: r.workingDays,
      horario: r.workingHours,
      unidade: r.salon?.name ?? null,
      atendimentosMes: r.appointments.length,
      faturamentoMes,
      ocupacao,
    }
  }

  private toEntity(row: ProfessionalRow): Professional {
    return new Professional(
      {
        organizationId: row.organizationId,
        salonId: row.salonId ?? undefined,
        name: row.name,
        specialty: row.specialty ?? undefined,
        email: row.email ?? undefined,
        phone: row.phone ?? undefined,
        status: row.status,
        commissionPct: Number(row.commissionPct),
        rating: Number(row.rating),
        workingServices: row.workingServices,
        workingDays: row.workingDays,
        workingHours: row.workingHours ?? undefined,
        hiredAt: row.hiredAt ?? undefined,
      },
      row.id,
    )
  }
}
