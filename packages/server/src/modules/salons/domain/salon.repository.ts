import type { Salon } from "./salon.entity"
import type { SalonItemDTO } from "../application/dtos/salon-item.dto"

export interface DateRange {
  monthStart: Date
  monthEnd: Date
  todayStart: Date
  todayEnd: Date
}

export interface ISalonRepository {
  create(salon: Salon): Promise<void>
  list(organizationId: string, range: DateRange): Promise<SalonItemDTO[]>
  findByIdWithMetrics(id: string, organizationId: string, range: DateRange): Promise<SalonItemDTO | null>
  findById(id: string, organizationId: string): Promise<Salon | null>
  update(salon: Salon): Promise<void>
  softDelete(id: string, organizationId: string): Promise<void>
  clearMainSalon(organizationId: string): Promise<void>
}
