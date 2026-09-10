import type { UseCase } from "@/shared/application/use-case"
import type { IOrganizationRepository } from "../domain/organization.repository"
import { Organization } from "../domain/organization.entity"
import { ConflictError } from "@/shared/domain/errors"

interface Input {
  name: string
  ownerId: string
}

interface Output {
  organizationId: string
}

export class CreateOrganizationUseCase implements UseCase<Input, Output> {
  constructor(private readonly repo: IOrganizationRepository) {}

  async execute({ name, ownerId }: Input): Promise<Output> {
    const existing = await this.repo.findByOwnerId(ownerId)
    if (existing) throw new ConflictError("Organizacao ja existe para este usuario")

    const org = Organization.create({ name, ownerId })
    await this.repo.create(org)

    return { organizationId: org.id }
  }
}
