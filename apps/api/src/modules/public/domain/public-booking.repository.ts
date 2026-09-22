import type { BookedInterval } from "./available-slots"

export interface PublicSalonRow {
  id: string
  organizationId: string
  name: string
  slug: string
  address: string | null
  phone: string | null
  businessHours: string | null
}

export interface PublicServiceRow {
  id: string
  name: string
  durationMin: number
  priceCents: number
}

export interface PublicProfessionalRow {
  id: string
  name: string
}

export interface CreateBookingInput {
  organizationId: string
  salonId: string
  professionalId: string
  serviceId: string
  clientId: string
  startsAt: Date
  endsAt: Date
  priceCents: number
}

export interface CreateBookingResult {
  id: string
  startsAt: Date
}

export interface IPublicBookingRepository {
  findSalonBySlug(slug: string): Promise<PublicSalonRow | null>
  listActiveServices(organizationId: string): Promise<PublicServiceRow[]>
  listActiveProfessionals(organizationId: string, salonId: string): Promise<PublicProfessionalRow[]>
  findServiceInOrg(serviceId: string, organizationId: string): Promise<PublicServiceRow | null>
  findProfessionalInSalon(
    professionalId: string,
    organizationId: string,
    salonId: string,
  ): Promise<PublicProfessionalRow | null>
  getBookedIntervals(professionalId: string, dayStart: Date, dayEnd: Date): Promise<BookedInterval[]>
  /** Cria o agendamento sob lock transacional por profissional (previne double booking). */
  createBookingWithLock(input: CreateBookingInput): Promise<CreateBookingResult>
}
