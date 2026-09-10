import type { Service } from "./service.entity"
import type { ServiceItemDTO } from "../application/dtos/service-item.dto"

export interface IServiceRepository {
  create(service: Service): Promise<void>
  list(organizationId: string, monthStart: Date, monthEnd: Date): Promise<ServiceItemDTO[]>
  findByIdWithMetrics(id: string, organizationId: string, monthStart: Date, monthEnd: Date): Promise<ServiceItemDTO | null>
  findById(id: string, organizationId: string): Promise<Service | null>
  update(service: Service): Promise<void>
  softDelete(id: string, organizationId: string): Promise<void>
}
