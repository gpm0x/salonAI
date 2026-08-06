import type { UseCase } from "@/shared/application/use-case"
import type { ISalonRepository } from "../../domain/salon.repository"
import { Salon } from "../../domain/salon.entity"
import type { UpdateSalonInput } from "../dtos/update-salon.dto"
import { NotFoundError } from "@/shared/domain/errors"

interface Input extends UpdateSalonInput { id: string; organizationId: string }

export class UpdateSalonUseCase implements UseCase<Input, void> {
  constructor(private readonly repo: ISalonRepository) {}

  async execute({ id, organizationId, ...data }: Input): Promise<void> {
    const existing = await this.repo.findById(id, organizationId)
    if (!existing) throw new NotFoundError("Unidade nao encontrada")

    if (data.principal === true) await this.repo.clearMainSalon(organizationId)

    const updated = new Salon(
      {
        organizationId,
        name: data.nome ?? existing.name,
        address: data.endereco !== undefined ? (data.endereco ?? undefined) : existing.address,
        city: data.cidade !== undefined ? (data.cidade ?? undefined) : existing.city,
        phone: data.telefone !== undefined ? (data.telefone ?? undefined) : existing.phone,
        businessHours: data.horario !== undefined ? (data.horario ?? undefined) : existing.businessHours,
        totalChairs: data.cadeiras ?? existing.totalChairs,
        isActive: data.ativa ?? existing.isActive,
        isMain: data.principal ?? existing.isMain,
      },
      id,
    )

    await this.repo.update(updated)
  }
}
