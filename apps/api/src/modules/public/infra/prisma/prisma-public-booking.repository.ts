import type { PrismaClient } from "@prisma/client"
import type {
  CreateBookingInput,
  CreateBookingResult,
  IPublicBookingRepository,
  PublicProfessionalRow,
  PublicSalonRow,
  PublicServiceRow,
} from "../../domain/public-booking.repository"
import type { BookedInterval } from "../../domain/available-slots"
import { createAppointmentWithProfessionalLock } from "@/shared/infrastructure/prisma/with-professional-booking-lock"

export class PrismaPublicBookingRepository implements IPublicBookingRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findSalonBySlug(slug: string): Promise<PublicSalonRow | null> {
    const row = await this.prisma.salon.findFirst({
      where: { slug, isActive: true },
      select: {
        id: true,
        organizationId: true,
        name: true,
        slug: true,
        address: true,
        phone: true,
        businessHours: true,
      },
    })
    return row
  }

  async listActiveServices(organizationId: string): Promise<PublicServiceRow[]> {
    return this.prisma.service.findMany({
      where: { organizationId, isActive: true },
      select: { id: true, name: true, durationMin: true, priceCents: true },
      orderBy: { name: "asc" },
    })
  }

  async listActiveProfessionals(organizationId: string, salonId: string): Promise<PublicProfessionalRow[]> {
    return this.prisma.professional.findMany({
      where: { organizationId, salonId, status: { not: "inativo" } },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    })
  }

  async findServiceInOrg(serviceId: string, organizationId: string): Promise<PublicServiceRow | null> {
    return this.prisma.service.findFirst({
      where: { id: serviceId, organizationId, isActive: true },
      select: { id: true, name: true, durationMin: true, priceCents: true },
    })
  }

  async findProfessionalInSalon(
    professionalId: string,
    organizationId: string,
    salonId: string,
  ): Promise<PublicProfessionalRow | null> {
    return this.prisma.professional.findFirst({
      where: { id: professionalId, organizationId, salonId, status: { not: "inativo" } },
      select: { id: true, name: true },
    })
  }

  async getBookedIntervals(professionalId: string, dayStart: Date, dayEnd: Date): Promise<BookedInterval[]> {
    const rows = await this.prisma.appointment.findMany({
      where: {
        professionalId,
        status: { not: "cancelado" },
        startsAt: { lt: dayEnd },
        endsAt: { gt: dayStart },
      },
      select: { startsAt: true, endsAt: true },
    })
    return rows
  }

  async createBookingWithLock(input: CreateBookingInput): Promise<CreateBookingResult> {
    return createAppointmentWithProfessionalLock(this.prisma, input)
  }
}
