import type { Organization } from "./organization.entity"

export interface IOrganizationRepository {
  create(org: Organization): Promise<void>
  findById(id: string): Promise<Organization | null>
  findByOwnerId(ownerId: string): Promise<Organization | null>
}
