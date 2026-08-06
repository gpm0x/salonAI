import type { UseCase } from "@/shared/application/use-case"
import type { IServiceRepository } from "../../domain/service.repository"
import { Service } from "../../domain/service.entity"
import type { CreateServiceInput } from "../dtos/create-service.dto"

interface Input extends CreateServiceInput { organizationId: string }
interface Output { serviceId: string }

export class CreateServiceUseCase implements UseCase<Input, Output> {
  constructor(private readonly repo: IServiceRepository) {}

  async execute(input: Input): Promise<Output> {
    const service = Service.create({
      organizationId: input.organizationId,
      name: input.nome,
      category: input.categoria,
      durationMin: input.duracao,
      priceCents: Math.round(input.preco * 100),
      commissionPct: input.comissao ?? 0,
    })
    await this.repo.create(service)
    return { serviceId: service.id }
  }
}
