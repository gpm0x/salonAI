import { Entity } from "@/shared/domain/entity"

interface ClientProps {
  organizationId: string
  name: string
  email?: string
  phone?: string
  status: string
  birthday?: string
  favoriteService?: string
  preferredProfessionalId?: string
}

export class Client extends Entity<ClientProps> {
  get organizationId() { return this.props.organizationId }
  get name() { return this.props.name }
  get email() { return this.props.email }
  get phone() { return this.props.phone }
  get status() { return this.props.status }
  get birthday() { return this.props.birthday }
  get favoriteService() { return this.props.favoriteService }
  get preferredProfessionalId() { return this.props.preferredProfessionalId }

  static create(props: ClientProps, id?: string): Client {
    return new Client(props, id)
  }
}
