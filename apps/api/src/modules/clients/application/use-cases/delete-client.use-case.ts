import type { UseCase } from "@/shared/application/use-case"
import type { IClientRepository } from "../../domain/client.repository"
import { NotFoundError } from "@/shared/domain/errors"

interface Input { id: string; organizationId: string }

export class DeleteClientUseCase implements UseCase<Input, void> {
  constructor(private readonly repo: IClientRepository) {}

  async execute({ id, organizationId }: Input): Promise<void> {
    const existing = await this.repo.findById(id, organizationId)
    if (!existing) throw new NotFoundError("Cliente nao encontrado")
    await this.repo.softDelete(id, organizationId)
  }
}
