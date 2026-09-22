import type { UseCase } from "@/shared/application/use-case"
import type { IPublicBookingRepository } from "../../domain/public-booking.repository"
import type { PublicSalonDTO } from "../dtos/public-salon.dto"
import { NotFoundError } from "@/shared/domain/errors"

interface Input {
  slug: string
}

export class GetPublicSalonUseCase implements UseCase<Input, PublicSalonDTO> {
  constructor(private readonly repo: IPublicBookingRepository) {}

  async execute({ slug }: Input): Promise<PublicSalonDTO> {
    const salon = await this.repo.findSalonBySlug(slug)
    if (!salon) throw new NotFoundError("Salao nao encontrado")

    const [services, professionals] = await Promise.all([
      this.repo.listActiveServices(salon.organizationId),
      this.repo.listActiveProfessionals(salon.organizationId, salon.id),
    ])

    return {
      id: salon.id,
      name: salon.name,
      slug: salon.slug,
      address: salon.address,
      phone: salon.phone,
      services: services.map((s) => ({
        id: s.id,
        name: s.name,
        durationMinutes: s.durationMin,
        priceCents: s.priceCents,
      })),
      professionals: professionals.map((p) => ({
        id: p.id,
        name: p.name,
        avatarUrl: null,
      })),
    }
  }
}
