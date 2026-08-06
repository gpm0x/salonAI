import type { Professional } from "./professional.entity"
import type { ProfessionalItemDTO } from "../application/dtos/professional-item.dto"

export interface IProfessionalRepository {
  create(professional: Professional): Promise<void>
  list(organizationId: string, monthStart: Date, monthEnd: Date): Promise<ProfessionalItemDTO[]>
  findByIdWithMetrics(id: string, organizationId: string, monthStart: Date, monthEnd: Date): Promise<ProfessionalItemDTO | null>
  findById(id: string, organizationId: string): Promise<Professional | null>
  update(professional: Professional): Promise<void>
  softDelete(id: string, organizationId: string): Promise<void>
}
