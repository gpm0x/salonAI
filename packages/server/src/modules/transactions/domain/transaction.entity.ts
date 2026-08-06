import { Entity } from "@/shared/domain/entity"

interface TransactionProps {
  organizationId: string
  appointmentId?: string
  clientId?: string
  professionalId?: string
  serviceName?: string
  amountCents: number
  paymentMethod: string
  paidAt: Date
}

export class Transaction extends Entity<TransactionProps> {
  get organizationId() { return this.props.organizationId }
  get appointmentId() { return this.props.appointmentId }
  get clientId() { return this.props.clientId }
  get professionalId() { return this.props.professionalId }
  get serviceName() { return this.props.serviceName }
  get amountCents() { return this.props.amountCents }
  get paymentMethod() { return this.props.paymentMethod }
  get paidAt() { return this.props.paidAt }

  static create(props: TransactionProps, id?: string): Transaction {
    return new Transaction(props, id)
  }
}
