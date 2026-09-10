import type { UseCase } from "@/shared/application/use-case"
import type { IServiceRepository } from "../../domain/service.repository"
import type { ServiceItemDTO } from "../dtos/service-item.dto"

interface Input { organizationId: string }
interface Output { data: ServiceItemDTO[] }

export class ListServicesUseCase implements UseCase<Input, Output> {
  constructor(private readonly repo: IServiceRepository) {}

  async execute({ organizationId }: Input): Promise<Output> {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    const data = await this.repo.list(organizationId, monthStart, monthEnd)
    return { data }
  }
}
