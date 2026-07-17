export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export interface Appointment {
  id: string;
  salonId: string;
  professionalId: string;
  clientId: string;
  serviceId: string;
  startsAt: string; // ISO 8601
  endsAt: string; // ISO 8601
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}
