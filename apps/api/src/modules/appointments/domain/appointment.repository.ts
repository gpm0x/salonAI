import type { Appointment } from "./appointment.entity"
import type { AppointmentItemDTO } from "../application/dtos/appointment-item.dto"
import type {
  ProfessionalBookingInput,
  ProfessionalBookingResult,
} from "@/shared/infrastructure/prisma/with-professional-booking-lock"

export interface CompleteAppointmentData {
  serviceName: string
  amountCents: number
  clientId: string
  professionalId: string
}

export interface IAppointmentRepository {
  /** Cria o agendamento sob lock transacional por profissional (previne double booking). */
  createWithLock(input: ProfessionalBookingInput): Promise<ProfessionalBookingResult>
  list(organizationId: string, date: Date): Promise<AppointmentItemDTO[]>
  findByIdWithDetails(id: string, organizationId: string): Promise<AppointmentItemDTO | null>
  findById(id: string, organizationId: string): Promise<Appointment | null>
  updateStatus(id: string, organizationId: string, status: string): Promise<void>
  /** Atualiza o status pra "concluido" e cria a Transaction correspondente numa unica transacao de banco. */
  completeWithTransaction(id: string, organizationId: string, data: CompleteAppointmentData): Promise<void>
}
