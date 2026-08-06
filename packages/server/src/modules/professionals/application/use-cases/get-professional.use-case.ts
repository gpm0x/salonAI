import type { UseCase } from "@/shared/application/use-case"
import type { IProfessionalRepository } from "../../domain/professional.repository"
import type { ProfessionalItemDTO } from "../dtos/professional-item.dto"
import { NotFoundError } from "@/shared/domain/errors"

interface Input { id: string; organizationId: string }

export class GetProfessionalUseCase implements UseCase<Input, ProfessionalItemDTO> {
  constructor(private readonly repo: IProfessionalRepository) {}

  async execute({ id, organizationId }: Input): Promise<ProfessionalItemDTO> {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    const dto = await this.repo.findByIdWithMetrics(id, organizationId, monthStart, monthEnd)
    if (!dto) throw new NotFoundError("Profissional nao encontrado")
    return dto
  }
}
