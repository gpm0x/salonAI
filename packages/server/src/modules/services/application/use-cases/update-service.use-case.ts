import type { UseCase } from "@/shared/application/use-case"
import type { IServiceRepository } from "../../domain/service.repository"
import { Service } from "../../domain/service.entity"
import type { UpdateServiceInput } from "../dtos/update-service.dto"
import { NotFoundError } from "@/shared/domain/errors"

interface Input extends UpdateServiceInput { id: string; organizationId: string }

export class UpdateServiceUseCase implements UseCase<Input, void> {
  constructor(private readonly repo: IServiceRepository) {}

  async execute({ id, organizationId, ...data }: Input): Promise<void> {
    const existing = await this.repo.findById(id, organizationId)
    if (!existing) throw new NotFoundError("Servico nao encontrado")

    const updated = new Service(
      {
        organizationId,
        name: data.nome ?? existing.name,
        category: data.categoria ?? existing.category,
        durationMin: data.duracao ?? existing.durationMin,
        priceCents: data.preco !== undefined ? Math.round(data.preco * 100) : existing.priceCents,
        commissionPct: data.comissao ?? existing.commissionPct,
        isActive: data.ativo ?? existing.isActive,
      },
      id,
    )
    await this.repo.update(updated)
  }
}
