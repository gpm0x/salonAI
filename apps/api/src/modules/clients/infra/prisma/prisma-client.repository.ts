import type { Prisma, PrismaClient } from "@prisma/client"
import { Client } from "../../domain/client.entity"
import type { IClientRepository } from "../../domain/client.repository"
import type { ClientItemDTO } from "../../application/dtos/client-item.dto"
import { Email, Phone } from "@/shared/domain/value-objects"

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
        email: c.email?.toString() ?? null,
        phone: c.phone?.toString() ?? null,
        status: c.status,
        birthday: c.birthday ?? null,
        favoriteService: c.favoriteService ?? null,
        preferredProfessionalId: c.preferredProfessionalId ?? null,
      },
    })
  }

  async list(organizationId: string, _monthStart: Date, _monthEnd: Date, search?: string): Promise<ClientItemDTO[]> {
    const where: Prisma.ClientWhereInput = { organizationId, status: { not: "inativo" } }

    if (search) {
      const digits = search.replace(/\D/g, "")
      const orConditions: Prisma.ClientWhereInput[] = [
        { name: { contains: search, mode: "insensitive" } },
      ]
      if (digits.length > 0) {
        orConditions.push({ phone: { contains: digits } })
      }
      where.OR = orConditions
    }

    const rows = await this.prisma.client.findMany({
      where,
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
        email: c.email?.toString() ?? null,
        phone: c.phone?.toString() ?? null,
        status: c.status,
        birthday: c.birthday ?? null,
        favoriteService: c.favoriteService ?? null,
        preferredProfessionalId: c.preferredProfessionalId ?? null,
      },
    })
  }

  async softDelete(id: string, organizationId: string): Promise<void> {
    await this.prisma.client.updateMany({
      where: { id, organizationId },
      data: { status: "inativo" },
    })
  }

  async findOrCreateByPhone(organizationId: string, phone: string, name: string): Promise<Client> {
    const digits = Phone.create(phone).toString()
    const existing = await this.prisma.client.findFirst({
      where: { organizationId, phone: digits },
    })
    if (existing) return this.toEntity(existing)

    const client = Client.create({
      organizationId,
      name,
      phone: Phone.create(digits),
      status: "novo",
    })
    await this.create(client)
    return client
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
        email: row.email ? Email.create(row.email) : undefined,
        phone: row.phone ? Phone.create(row.phone) : undefined,
        status: row.status,
        birthday: row.birthday ?? undefined,
        favoriteService: row.favoriteService ?? undefined,
        preferredProfessionalId: row.preferredProfessionalId ?? undefined,
      },
      row.id,
    )
  }
}
