import { Entity } from "@/shared/domain/entity"

interface AppointmentProps {
  organizationId: string
  salonId: string
  professionalId: string
  clientId: string
  serviceId: string
  startsAt: Date
  endsAt: Date
  status: string
  priceCents: number
  notes?: string
}

export class Appointment extends Entity<AppointmentProps> {
  get organizationId() { return this.props.organizationId }
  get salonId() { return this.props.salonId }
  get professionalId() { return this.props.professionalId }
  get clientId() { return this.props.clientId }
  get serviceId() { return this.props.serviceId }
  get startsAt() { return this.props.startsAt }
  get endsAt() { return this.props.endsAt }
  get status() { return this.props.status }
  get priceCents() { return this.props.priceCents }
  get notes() { return this.props.notes }

  static create(props: AppointmentProps, id?: string): Appointment {
    return new Appointment(props, id)
  }
}
