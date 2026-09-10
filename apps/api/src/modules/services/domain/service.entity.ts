import { Entity } from "@/shared/domain/entity"

interface ServiceProps {
  organizationId: string
  name: string
  category: string
  durationMin: number
  priceCents: number
  commissionPct: number
  isActive: boolean
}

export class Service extends Entity<ServiceProps> {
  get organizationId() { return this.props.organizationId }
  get name() { return this.props.name }
  get category() { return this.props.category }
  get durationMin() { return this.props.durationMin }
  get priceCents() { return this.props.priceCents }
  get commissionPct() { return this.props.commissionPct }
  get isActive() { return this.props.isActive }

  static create(props: Omit<ServiceProps, "isActive">, id?: string): Service {
    return new Service({ ...props, isActive: true }, id)
  }
}
