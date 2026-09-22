import type { UseCase } from "@/shared/application/use-case"
import type { IAppointmentRepository } from "../../domain/appointment.repository"
import type { CreateAppointmentInput } from "../dtos/create-appointment.dto"
import { ConflictError, NotFoundError } from "@/shared/domain/errors"
import { prisma } from "@/shared/infrastructure/prisma/client"

interface Input extends CreateAppointmentInput { organizationId: string }
interface Output { appointmentId: string }

export class CreateAppointmentUseCase implements UseCase<Input, Output> {
  constructor(private readonly repo: IAppointmentRepository) {}

  async execute(input: Input): Promise<Output> {
    // Verifica que todos os recursos pertencem à mesma organização (previne IDOR)
    const [service, salon, professional, client] = await Promise.all([
      prisma.service.findFirst({
        where: { id: input.serviceId, organizationId: input.organizationId },
      }),
      prisma.salon.findFirst({
        where: { id: input.salonId, organizationId: input.organizationId },
      }),
      prisma.professional.findFirst({
        where: { id: input.professionalId, organizationId: input.organizationId },
      }),
      prisma.client.findFirst({
        where: { id: input.clientId, organizationId: input.organizationId },
      }),
    ])

    if (!service) throw new NotFoundError("Servico nao encontrado")
    if (!salon) throw new NotFoundError("Unidade nao encontrada")
    if (!professional) throw new NotFoundError("Profissional nao encontrado")
    if (!client) throw new NotFoundError("Cliente nao encontrado")

    const [hours, minutes] = input.inicio.split(":").map(Number)
    const startsAt = new Date(`${input.data}T00:00:00`)
    startsAt.setHours(hours, minutes, 0, 0)

    if (startsAt < new Date()) throw new ConflictError("Nao e possivel agendar no passado")

    const endsAt = new Date(startsAt.getTime() + service.durationMin * 60 * 1000)
    const priceCents = input.valor ? Math.round(input.valor * 100) : service.priceCents

    const created = await this.repo.createWithLock({
      organizationId: input.organizationId,
      salonId: input.salonId,
      professionalId: input.professionalId,
      serviceId: input.serviceId,
      clientId: input.clientId,
      startsAt,
      endsAt,
      priceCents,
      notes: input.observacoes,
    })

    return { appointmentId: created.id }
  }
}
