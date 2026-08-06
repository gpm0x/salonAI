import { Entity } from "@/shared/domain/entity"

interface SalonProps {
  organizationId: string
  name: string
  address?: string
  city?: string
  phone?: string
  businessHours?: string
  totalChairs: number
  isActive: boolean
  isMain: boolean
}

export class Salon extends Entity<SalonProps> {
  get organizationId() { return this.props.organizationId }
  get name() { return this.props.name }
  get address() { return this.props.address }
  get city() { return this.props.city }
  get phone() { return this.props.phone }
  get businessHours() { return this.props.businessHours }
  get totalChairs() { return this.props.totalChairs }
  get isActive() { return this.props.isActive }
  get isMain() { return this.props.isMain }

  static create(
    props: Omit<SalonProps, "isActive" | "isMain"> & { isMain?: boolean },
    id?: string,
  ): Salon {
    return new Salon({ ...props, isActive: true, isMain: props.isMain ?? false }, id)
  }
}
