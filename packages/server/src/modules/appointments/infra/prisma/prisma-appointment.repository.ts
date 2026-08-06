import type { PrismaClient } from "@prisma/client"
import { Appointment } from "../../domain/appointment.entity"
import type { IAppointmentRepository } from "../../domain/appointment.repository"
import type { AppointmentItemDTO } from "../../application/dtos/appointment-item.dto"

function pad(n: number) { return String(n).padStart(2, "0") }
function toTime(d: Date) { return `${pad(d.getHours())}:${pad(d.getMinutes())}` }
function toDate(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` }

type ApptRow = {
  id: string; organizationId: string; salonId: string; professionalId: string
  clientId: string; serviceId: string; startsAt: Date; endsAt: Date
  status: string; priceCents: number; notes: string | null
}

export class PrismaAppointmentRepository implements IAppointmentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(a: Appointment): Promise<void> {
    await this.prisma.appointment.create({
      data: {
        id: a.id,
        organizationId: a.organizationId,
        salonId: a.salonId,
        professionalId: a.professionalId,
        clientId: a.clientId,
        serviceId: a.serviceId,
        startsAt: a.startsAt,
        endsAt: a.endsAt,
        status: a.status,
        priceCents: a.priceCents,
        notes: a.notes ?? null,
      },
    })
  }

  async list(organizationId: string, date: Date): Promise<AppointmentItemDTO[]> {
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)

    const rows = await this.prisma.appointment.findMany({
      where: { organizationId, startsAt: { gte: dayStart, lte: dayEnd } },
      orderBy: { startsAt: "asc" },
      include: {
        client: { select: { name: true } },
        service: { select: { name: true } },
        professional: { select: { name: true } },
        salon: { select: { name: true } },
      },
    })

    return rows.map((r) => this.toDTO(r))
  }

  async findByIdWithDetails(id: string, organizationId: string): Promise<AppointmentItemDTO | null> {
    const r = await this.prisma.appointment.findFirst({
      where: { id, organizationId },
      include: {
        client: { select: { name: true } },
        service: { select: { name: true } },
        professional: { select: { name: true } },
        salon: { select: { name: true } },
      },
    })
    return r ? this.toDTO(r) : null
  }

  async findById(id: string, organizationId: string): Promise<Appointment | null> {
    const row = await this.prisma.appointment.findFirst({ where: { id, organizationId } })
    return row ? this.toEntity(row) : null
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await this.prisma.appointment.update({ where: { id }, data: { status } })
  }

  async hasConflict(professionalId: string, startsAt: Date, endsAt: Date, excludeId?: string): Promise<boolean> {
    const count = await this.prisma.appointment.count({
      where: {
        professionalId,
        status: { not: "cancelado" },
        id: excludeId ? { not: excludeId } : undefined,
        AND: [
          { startsAt: { lt: endsAt } },
          { endsAt: { gt: startsAt } },
        ],
      },
    })
    return count > 0
  }

  private toDTO(
    r: ApptRow & {
      client: { name: string }
      service: { name: string }
      professional: { name: string }
      salon: { name: string }
    },
  ): AppointmentItemDTO {
    const duracao = Math.round((r.endsAt.getTime() - r.startsAt.getTime()) / 60000)
    return {
      id: r.id,
      data: toDate(r.startsAt),
      inicio: toTime(r.startsAt),
      fim: toTime(r.endsAt),
      duracao,
      cliente: r.client.name,
      clienteId: r.clientId,
      servico: r.service.name,
      servicoId: r.serviceId,
      profissional: r.professional.name,
      profissionalId: r.professionalId,
      unidade: r.salon.name,
      salonId: r.salonId,
      status: r.status,
      valor: r.priceCents / 100,
      observacoes: r.notes,
    }
  }

  private toEntity(row: ApptRow): Appointment {
    return new Appointment(
      {
        organizationId: row.organizationId,
        salonId: row.salonId,
        professionalId: row.professionalId,
        clientId: row.clientId,
        serviceId: row.serviceId,
        startsAt: row.startsAt,
        endsAt: row.endsAt,
        status: row.status,
        priceCents: row.priceCents,
        notes: row.notes ?? undefined,
      },
      row.id,
    )
  }
}
