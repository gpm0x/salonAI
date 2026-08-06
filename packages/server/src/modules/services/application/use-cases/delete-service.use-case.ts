import type { UseCase } from "@/shared/application/use-case"
import type { IServiceRepository } from "../../domain/service.repository"
import { NotFoundError } from "@/shared/domain/errors"

interface Input { id: string; organizationId: string }

export class DeleteServiceUseCase implements UseCase<Input, void> {
  constructor(private readonly repo: IServiceRepository) {}

  async execute({ id, organizationId }: Input): Promise<void> {
    const existing = await this.repo.findById(id, organizationId)
    if (!existing) throw new NotFoundError("Servico nao encontrado")
    await this.repo.softDelete(id, organizationId)
  }
}
