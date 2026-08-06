import type { UseCase } from "@/shared/application/use-case"
import type { ISalonRepository } from "../../domain/salon.repository"
import type { SalonItemDTO } from "../dtos/salon-item.dto"
import { NotFoundError } from "@/shared/domain/errors"

interface Input { id: string; organizationId: string }

export class GetSalonUseCase implements UseCase<Input, SalonItemDTO> {
  constructor(private readonly repo: ISalonRepository) {}

  async execute({ id, organizationId }: Input): Promise<SalonItemDTO> {
    const now = new Date()
    const range = {
      monthStart: new Date(now.getFullYear(), now.getMonth(), 1),
      monthEnd: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
      todayStart: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      todayEnd: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999),
    }
    const item = await this.repo.findByIdWithMetrics(id, organizationId, range)
    if (!item) throw new NotFoundError("Unidade nao encontrada")
    return item
  }
}
