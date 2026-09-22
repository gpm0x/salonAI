import type { PrismaClient } from "@prisma/client"
import { ConflictError } from "@/shared/domain/errors"

export interface ProfessionalBookingInput {
  organizationId: string
  salonId: string
  professionalId: string
  serviceId: string
  clientId: string
  startsAt: Date
  endsAt: Date
  priceCents: number
  notes?: string
}

export interface ProfessionalBookingResult {
  id: string
  startsAt: Date
}

/**
 * Cria um agendamento sob lock transacional por profissional (pg_advisory_xact_lock),
 * prevenindo double booking em criacoes concorrentes (SEC-12). Compartilhado pelo
 * fluxo autenticado (appointments) e pelo publico (public booking): mesma regra de
 * conflito nos dois: status != cancelado e overlap de intervalo ([startsAt, endsAt)).
 */
export async function createAppointmentWithProfessionalLock(
  prisma: PrismaClient,
  input: ProfessionalBookingInput,
): Promise<ProfessionalBookingResult> {
  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${input.professionalId}))`

    const conflict = await tx.appointment.count({
      where: {
        professionalId: input.professionalId,
        status: { not: "cancelado" },
        AND: [{ startsAt: { lt: input.endsAt } }, { endsAt: { gt: input.startsAt } }],
      },
    })
    if (conflict > 0) throw new ConflictError("Horario nao esta mais disponivel")

    return tx.appointment.create({
      data: {
        organizationId: input.organizationId,
        salonId: input.salonId,
        professionalId: input.professionalId,
        serviceId: input.serviceId,
        clientId: input.clientId,
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        status: "aguardando",
        priceCents: input.priceCents,
        notes: input.notes ?? null,
      },
      select: { id: true, startsAt: true },
    })
  })
}
