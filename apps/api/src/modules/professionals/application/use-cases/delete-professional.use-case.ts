import type { UseCase } from "@/shared/application/use-case"
import type { IProfessionalRepository } from "../../domain/professional.repository"
import { NotFoundError } from "@/shared/domain/errors"

interface Input { id: string; organizationId: string }

export class DeleteProfessionalUseCase implements UseCase<Input, void> {
  constructor(private readonly repo: IProfessionalRepository) {}

  async execute({ id, organizationId }: Input): Promise<void> {
    const existing = await this.repo.findById(id, organizationId)
    if (!existing) throw new NotFoundError("Profissional nao encontrado")
    await this.repo.softDelete(id, organizationId)
  }
}
