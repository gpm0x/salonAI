import type { PrismaClient } from "@prisma/client"
import { Service } from "../../domain/service.entity"
import type { IServiceRepository } from "../../domain/service.repository"
import type { ServiceItemDTO } from "../../application/dtos/service-item.dto"

type ServiceRow = {
  id: string; organizationId: string; name: string; category: string
  durationMin: number; priceCents: number; commissionPct: { toNumber(): number }; isActive: boolean
}

export class PrismaServiceRepository implements IServiceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(service: Service): Promise<void> {
    await this.prisma.service.create({
      data: {
        id: service.id,
        organizationId: service.organizationId,
        name: service.name,
        category: service.category,
        durationMin: service.durationMin,
        priceCents: service.priceCents,
        commissionPct: service.commissionPct,
        isActive: service.isActive,
      },
    })
  }

  async list(organizationId: string, monthStart: Date, monthEnd: Date): Promise<ServiceItemDTO[]> {
    const services = await this.prisma.service.findMany({
      where: { organizationId, isActive: true },
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            appointments: {
              where: { startsAt: { gte: monthStart, lte: monthEnd }, status: { not: "cancelado" } },
            },
          },
        },
      },
    })
    return services.map((s) => this.toDTO(s, s._count.appointments))
  }

  async findByIdWithMetrics(
    id: string,
    organizationId: string,
    monthStart: Date,
    monthEnd: Date,
  ): Promise<ServiceItemDTO | null> {
    const s = await this.prisma.service.findFirst({
      where: { id, organizationId },
      include: {
        _count: {
          select: {
            appointments: {
              where: { startsAt: { gte: monthStart, lte: monthEnd }, status: { not: "cancelado" } },
            },
          },
        },
      },
    })
    return s ? this.toDTO(s, s._count.appointments) : null
  }

  async findById(id: string, organizationId: string): Promise<Service | null> {
    const row = await this.prisma.service.findFirst({ where: { id, organizationId } })
    return row ? this.toEntity(row) : null
  }

  async update(service: Service): Promise<void> {
    await this.prisma.service.update({
      where: { id: service.id },
      data: {
        name: service.name,
        category: service.category,
        durationMin: service.durationMin,
        priceCents: service.priceCents,
        commissionPct: service.commissionPct,
        isActive: service.isActive,
      },
    })
  }

  async softDelete(id: string, _organizationId: string): Promise<void> {
    await this.prisma.service.update({ where: { id }, data: { isActive: false } })
  }

  private toDTO(s: ServiceRow, realizadosMes: number): ServiceItemDTO {
    return {
      id: s.id,
      nome: s.name,
      categoria: s.category,
      duracao: s.durationMin,
      preco: s.priceCents / 100,
      comissao: Number(s.commissionPct),
      ativo: s.isActive,
      realizadosMes,
    }
  }

  private toEntity(row: ServiceRow): Service {
    return new Service(
      {
        organizationId: row.organizationId,
        name: row.name,
        category: row.category,
        durationMin: row.durationMin,
        priceCents: row.priceCents,
        commissionPct: Number(row.commissionPct),
        isActive: row.isActive,
      },
      row.id,
    )
  }
}
