import type { Alert } from "./alert.entity"
import type { AlertItemDTO } from "../application/dtos/alert-item.dto"

export interface ProfOccupancyRow {
  id: string
  name: string
  appointmentCount: number
}

export interface ServiceTrendRow {
  name: string
  currentCount: number
  prevCount: number
  avgPriceCents: number
}

export interface IAlertRepository {
  getProfessionalOccupancyData(organizationId: string): Promise<ProfOccupancyRow[]>
  getStaleClientsCount(organizationId: string, daysThreshold: number): Promise<number>
  getServiceTrendData(organizationId: string): Promise<ServiceTrendRow[]>
  createMany(alerts: Alert[]): Promise<void>
  list(organizationId: string): Promise<AlertItemDTO[]>
  markAsRead(id: string, organizationId: string): Promise<void>
  clearUnread(organizationId: string): Promise<void>
}
