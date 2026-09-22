import type { UseCase } from "@/shared/application/use-case"
import type { IPublicBookingRepository } from "../../domain/public-booking.repository"
import type { AvailabilityQueryInput } from "../dtos/availability-query.dto"
import type { AvailabilityResultDTO } from "../dtos/availability-result.dto"
import { NotFoundError, ValidationError } from "@/shared/domain/errors"
import { parseBusinessHours } from "../../domain/opening-hours"
import { generateAvailableSlots } from "../../domain/available-slots"

interface Input extends AvailabilityQueryInput {
  slug: string
}

export class GetAvailabilityUseCase implements UseCase<Input, AvailabilityResultDTO> {
  constructor(private readonly repo: IPublicBookingRepository) {}

  async execute(input: Input): Promise<AvailabilityResultDTO> {
    const salon = await this.repo.findSalonBySlug(input.slug)
    if (!salon) throw new NotFoundError("Salao nao encontrado")

    const [service, professional] = await Promise.all([
      this.repo.findServiceInOrg(input.serviceId, salon.organizationId),
      this.repo.findProfessionalInSalon(input.professionalId, salon.organizationId, salon.id),
    ])
    if (!service) throw new NotFoundError("Servico nao encontrado")
    if (!professional) throw new NotFoundError("Profissional nao encontrado")

    // Mesma convencao de parsing de data usada em appointments (fuso do processo).
    const dayBase = new Date(`${input.date}T00:00:00`)
    if (isNaN(dayBase.getTime())) throw new ValidationError("Data invalida")

    const dayEnd = new Date(dayBase)
    dayEnd.setHours(23, 59, 59, 999)

    const now = new Date()
    const todayBase = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    if (dayBase < todayBase) {
      throw new ValidationError("Nao e possivel consultar disponibilidade para datas passadas")
    }

    const bookedIntervals = await this.repo.getBookedIntervals(input.professionalId, dayBase, dayEnd)
    const hours = parseBusinessHours(salon.businessHours)

    const slots = generateAvailableSlots({
      dayBase,
      hours,
      durationMinutes: service.durationMin || 30,
      bookedIntervals,
      now: dayBase.getTime() === todayBase.getTime() ? now : undefined,
    })

    return {
      slots: slots.map((s) => ({ startsAt: s.startsAt.toISOString(), endsAt: s.endsAt.toISOString() })),
    }
  }
}
