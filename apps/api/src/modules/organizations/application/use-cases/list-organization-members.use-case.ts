import type { UseCase } from "@/shared/application/use-case"
import type { IOrganizationRepository } from "../../domain/organization.repository"
import type { OrganizationMemberDTO } from "../dtos/organization-member.dto"

interface Input {
  organizationId: string
}

export class ListOrganizationMembersUseCase implements UseCase<Input, OrganizationMemberDTO[]> {
  constructor(private readonly repo: IOrganizationRepository) {}

  async execute({ organizationId }: Input): Promise<OrganizationMemberDTO[]> {
    return this.repo.listMembers(organizationId)
  }
}
