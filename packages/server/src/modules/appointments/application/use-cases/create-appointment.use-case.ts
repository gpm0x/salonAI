import type { UseCase } from "@/shared/application/use-case"
import type { IAppointmentRepository } from "../../domain/appointment.repository"
import { Appointment } from "../../domain/appointment.entity"
import type { CreateAppointmentInput } from "../dtos/create-appointment.dto"
import { ConflictError, NotFoundError } from "@/shared/domain/errors"
import { prisma } from "@/shared/infrastructure/prisma/client"

interface Input extends CreateAppointmentInput { organizationId: string }
interface Output { appointmentId: string }

export class CreateAppointmentUseCase implements UseCase<Input, Output> {
  constructor(private readonly repo: IAppointmentRepository) {}

  async execute(input: Input): Promise<Output> {
    const service = await prisma.service.findFirst({
      where: { id: input.serviceId, organizationId: input.organizationId },
    })
    if (!service) throw new NotFoundError("Servico nao encontrado")

    const [hours, minutes] = input.inicio.split(":").map(Number)
    const startsAt = new Date(`${input.data}T00:00:00`)
    startsAt.setHours(hours, minutes, 0, 0)
    const endsAt = new Date(startsAt.getTime() + service.durationMin * 60 * 1000)

    const conflict = await this.repo.hasConflict(input.professionalId, startsAt, endsAt)
    if (conflict) throw new ConflictError("Profissional ja tem agendamento neste horario")

    const priceCents = input.valor ? Math.round(input.valor * 100) : service.priceCents

    const appointment = Appointment.create({
      organizationId: input.organizationId,
      salonId: input.salonId,
      professionalId: input.professionalId,
      clientId: input.clientId,
      serviceId: input.serviceId,
      startsAt,
      endsAt,
      status: "aguardando",
      priceCents,
      notes: input.observacoes,
    })

    await this.repo.create(appointment)
    return { appointmentId: appointment.id }
  }
}
