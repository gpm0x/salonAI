import type { UseCase } from "@/shared/application/use-case"
import type { IPublicBookingRepository } from "../../domain/public-booking.repository"
import type { IClientRepository } from "@/modules/clients/domain/client.repository"
import type { CreatePublicAppointmentInput } from "../dtos/create-public-appointment.dto"
import type { PublicAppointmentResultDTO } from "../dtos/public-appointment-result.dto"
import { NotFoundError, ValidationError } from "@/shared/domain/errors"
import { Phone } from "@/shared/domain/value-objects"

export class CreatePublicAppointmentUseCase implements UseCase<CreatePublicAppointmentInput, PublicAppointmentResultDTO> {
  constructor(
    private readonly bookingRepo: IPublicBookingRepository,
    private readonly clientRepo: IClientRepository,
  ) {}

  async execute(input: CreatePublicAppointmentInput): Promise<PublicAppointmentResultDTO> {
    const salon = await this.bookingRepo.findSalonBySlug(input.salonSlug)
    if (!salon) throw new NotFoundError("Salao nao encontrado")

    const [service, professional] = await Promise.all([
      this.bookingRepo.findServiceInOrg(input.serviceId, salon.organizationId),
      this.bookingRepo.findProfessionalInSalon(input.professionalId, salon.organizationId, salon.id),
    ])
    if (!service) throw new NotFoundError("Servico nao encontrado")
    if (!professional) throw new NotFoundError("Profissional nao encontrado")

    const startsAt = new Date(input.startsAt)
    if (isNaN(startsAt.getTime())) throw new ValidationError("Data/hora invalida")
    if (startsAt < new Date()) throw new ValidationError("Nao e possivel agendar no passado")

    const endsAt = new Date(startsAt.getTime() + service.durationMin * 60 * 1000)

    const phone = Phone.create(input.clientPhone)
    const client = await this.clientRepo.findOrCreateByPhone(
      salon.organizationId,
      phone.toString(),
      input.clientName,
    )

    const result = await this.bookingRepo.createBookingWithLock({
      organizationId: salon.organizationId,
      salonId: salon.id,
      professionalId: input.professionalId,
      serviceId: input.serviceId,
      clientId: client.id,
      startsAt,
      endsAt,
      priceCents: service.priceCents,
    })

    return {
      id: result.id,
      startsAt: result.startsAt.toISOString(),
      salon: salon.name,
      service: service.name,
      professional: professional.name,
    }
  }
}
