import type { UseCase } from "@/shared/application/use-case"
import type { ISalonRepository } from "../../domain/salon.repository"
import type { SalonItemDTO } from "../dtos/salon-item.dto"

interface Input { organizationId: string }
interface Output { data: SalonItemDTO[] }

export class ListSalonsUseCase implements UseCase<Input, Output> {
  constructor(private readonly repo: ISalonRepository) {}

  async execute({ organizationId }: Input): Promise<Output> {
    const now = new Date()
    const range = {
      monthStart: new Date(now.getFullYear(), now.getMonth(), 1),
      monthEnd: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
      todayStart: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      todayEnd: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999),
    }
    const data = await this.repo.list(organizationId, range)
    return { data }
  }
}
