import type { Appointment } from "./appointment.entity"
import type { AppointmentItemDTO } from "../application/dtos/appointment-item.dto"

export interface IAppointmentRepository {
  create(appointment: Appointment): Promise<void>
  list(organizationId: string, date: Date): Promise<AppointmentItemDTO[]>
  findByIdWithDetails(id: string, organizationId: string): Promise<AppointmentItemDTO | null>
  findById(id: string, organizationId: string): Promise<Appointment | null>
  updateStatus(id: string, status: string): Promise<void>
  hasConflict(professionalId: string, startsAt: Date, endsAt: Date, excludeId?: string): Promise<boolean>
}
