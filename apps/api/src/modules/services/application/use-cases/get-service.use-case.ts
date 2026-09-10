import type { UseCase } from "@/shared/application/use-case"
import type { IServiceRepository } from "../../domain/service.repository"
import type { ServiceItemDTO } from "../dtos/service-item.dto"
import { NotFoundError } from "@/shared/domain/errors"

interface Input { id: string; organizationId: string }

export class GetServiceUseCase implements UseCase<Input, ServiceItemDTO> {
  constructor(private readonly repo: IServiceRepository) {}

  async execute({ id, organizationId }: Input): Promise<ServiceItemDTO> {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    const item = await this.repo.findByIdWithMetrics(id, organizationId, monthStart, monthEnd)
    if (!item) throw new NotFoundError("Servico nao encontrado")
    return item
  }
}
