import type { UseCase } from "@/shared/application/use-case"
import type { ISalonRepository } from "../../domain/salon.repository"
import { NotFoundError } from "@/shared/domain/errors"

interface Input { id: string; organizationId: string }

export class DeleteSalonUseCase implements UseCase<Input, void> {
  constructor(private readonly repo: ISalonRepository) {}

  async execute({ id, organizationId }: Input): Promise<void> {
    const existing = await this.repo.findById(id, organizationId)
    if (!existing) throw new NotFoundError("Unidade nao encontrada")
    await this.repo.softDelete(id, organizationId)
  }
}
