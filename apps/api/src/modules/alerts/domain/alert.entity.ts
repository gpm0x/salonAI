import { Entity } from "@/shared/domain/entity"

export type AlertTone = "risco" | "oportunidade" | "tendencia"
export type AlertArea = "ocupacao" | "retencao" | "servicos"

interface AlertProps {
  organizationId: string
  area: AlertArea
  tone: AlertTone
  title: string
  description: string
  impactCents: number
  confidence: number
  action?: string
  isRead: boolean
}

export class Alert extends Entity<AlertProps> {
  get organizationId() { return this.props.organizationId }
  get area() { return this.props.area }
  get tone() { return this.props.tone }
  get title() { return this.props.title }
  get description() { return this.props.description }
  get impactCents() { return this.props.impactCents }
  get confidence() { return this.props.confidence }
  get action() { return this.props.action }
  get isRead() { return this.props.isRead }

  static create(props: Omit<AlertProps, "isRead">): Alert {
    return new Alert({ ...props, isRead: false })
  }
}
