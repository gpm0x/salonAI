import type { Organization } from "./organization.entity"
import type { OrganizationMemberDTO } from "../application/dtos/organization-member.dto"

export interface IOrganizationRepository {
  create(org: Organization): Promise<void>
  findById(id: string): Promise<Organization | null>
  findByOwnerId(ownerId: string): Promise<Organization | null>
  listMembers(organizationId: string): Promise<OrganizationMemberDTO[]>
}
