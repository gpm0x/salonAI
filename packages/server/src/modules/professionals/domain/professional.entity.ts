import { Entity } from "@/shared/domain/entity"

interface ProfessionalProps {
  organizationId: string
  salonId?: string
  name: string
  specialty?: string
  email?: string
  phone?: string
  status: string
  commissionPct: number
  rating: number
  workingServices: string[]
  workingDays: string[]
  workingHours?: string
  hiredAt?: Date
}

export class Professional extends Entity<ProfessionalProps> {
  get organizationId() { return this.props.organizationId }
  get salonId() { return this.props.salonId }
  get name() { return this.props.name }
  get specialty() { return this.props.specialty }
  get email() { return this.props.email }
  get phone() { return this.props.phone }
  get status() { return this.props.status }
  get commissionPct() { return this.props.commissionPct }
  get rating() { return this.props.rating }
  get workingServices() { return this.props.workingServices }
  get workingDays() { return this.props.workingDays }
  get workingHours() { return this.props.workingHours }
  get hiredAt() { return this.props.hiredAt }

  static create(props: Omit<ProfessionalProps, "rating"> & { rating?: number }, id?: string): Professional {
    return new Professional({ ...props, rating: props.rating ?? 0 }, id)
  }
}
