import type { PrismaClient } from "@prisma/client"
import { Client } from "../../domain/client.entity"
import type { IClientRepository } from "../../domain/client.repository"
import type { ClientItemDTO } from "../../application/dtos/client-item.dto"

type ClientRow = {
  id: string; organizationId: string; name: string; email: string | null
  phone: string | null; status: string; birthday: string | null
  favoriteService: string | null; preferredProfessionalId: string | null
  createdAt: Date
}

export class PrismaClientRepository implements IClientRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(c: Client): Promise<void> {
    await this.prisma.client.create({
      data: {
        id: c.id,
        organizationId: c.organizationId,
        name: c.name,
        email: c.email ?? null,
        phone: c.phone ?? null,
        status: c.status,
        birthday: c.birthday ?? null,
        favoriteService: c.favoriteService ?? null,
        preferredProfessionalId: c.preferredProfessionalId ?? null,
      },
    })
  }

  async list(organizationId: string, _monthStart: Date, _monthEnd: Date): Promise<ClientItemDTO[]> {
    const rows = await this.prisma.client.findMany({
      where: { organizationId, status: { not: "inativo" } },
      orderBy: { createdAt: "desc" },
      include: {
        preferredProfessional: { select: { name: true } },
        appointments: {
          where: { status: { not: "cancelado" } },
          select: { startsAt: true },
          orderBy: { startsAt: "desc" },
        },
        transactions: { select: { amountCents: true } },
      },
    })

    return rows.map((r) => this.toDTO(r))
  }

  async findByIdWithMetrics(id: string, organizationId: string): Promise<ClientItemDTO | null> {
    const r = await this.prisma.client.findFirst({
      where: { id, organizationId },
      include: {
        preferredProfessional: { select: { name: true } },
        appointments: {
          where: { status: { not: "cancelado" } },
          select: { startsAt: true },
          orderBy: { startsAt: "desc" },
        },
        transactions: { select: { amountCents: true } },
      },
    })
    return r ? this.toDTO(r) : null
  }

  async findById(id: string, organizationId: string): Promise<Client | null> {
    const row = await this.prisma.client.findFirst({ where: { id, organizationId } })
    return row ? this.toEntity(row) : null
  }

  async update(c: Client): Promise<void> {
    await this.prisma.client.update({
      where: { id: c.id },
      data: {
        name: c.name,
        email: c.email ?? null,
        phone: c.phone ?? null,
        status: c.status,
        birthday: c.birthday ?? null,
        favoriteService: c.favoriteService ?? null,
        preferredProfessionalId: c.preferredProfessionalId ?? null,
      },
    })
  }

  async softDelete(id: string, _organizationId: string): Promise<void> {
    await this.prisma.client.update({ where: { id }, data: { status: "inativo" } })
  }

  private toDTO(
    r: ClientRow & {
      preferredProfessional: { name: string } | null
      appointments: { startsAt: Date }[]
      transactions: { amountCents: number }[]
    },
  ): ClientItemDTO {
    const ultimaVisita = r.appointments.length > 0 ? r.appointments[0].startsAt.toISOString() : null
    const totalGasto = r.transactions.reduce((sum, t) => sum + t.amountCents, 0) / 100

    return {
      id: r.id,
      nome: r.name,
      email: r.email,
      telefone: r.phone,
      status: r.status,
      dataCadastro: r.createdAt.toISOString(),
      aniversario: r.birthday,
      servicoFavorito: r.favoriteService,
      profissionalPreferido: r.preferredProfessional?.name ?? null,
      ultimaVisita,
      totalVisitas: r.appointments.length,
      totalGasto,
    }
  }

  private toEntity(row: ClientRow): Client {
    return new Client(
      {
        organizationId: row.organizationId,
        name: row.name,
        email: row.email ?? undefined,
        phone: row.phone ?? undefined,
        status: row.status,
        birthday: row.birthday ?? undefined,
        favoriteService: row.favoriteService ?? undefined,
        preferredProfessionalId: row.preferredProfessionalId ?? undefined,
      },
      row.id,
    )
  }
}
