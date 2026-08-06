import type { UseCase } from "@/shared/application/use-case"
import type { ISalonRepository } from "../../domain/salon.repository"
import { Salon } from "../../domain/salon.entity"
import type { CreateSalonInput } from "../dtos/create-salon.dto"

interface Input extends CreateSalonInput { organizationId: string }
interface Output { salonId: string }

export class CreateSalonUseCase implements UseCase<Input, Output> {
  constructor(private readonly repo: ISalonRepository) {}

  async execute(input: Input): Promise<Output> {
    if (input.principal) await this.repo.clearMainSalon(input.organizationId)

    const salon = Salon.create({
      organizationId: input.organizationId,
      name: input.nome,
      address: input.endereco,
      city: input.cidade,
      phone: input.telefone,
      businessHours: input.horario,
      totalChairs: input.cadeiras ?? 1,
      isMain: input.principal ?? false,
    })

    await this.repo.create(salon)
    return { salonId: salon.id }
  }
}
