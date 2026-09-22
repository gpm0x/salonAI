import type { UserRole } from "@/shared/domain/user-role"

export interface UserMembership {
  organizationId: string | null
  role: UserRole
}

export interface IUserRoleRepository {
  findMembership(userId: string): Promise<UserMembership | null>
  countAdminsInOrganization(organizationId: string): Promise<number>
  updateRole(userId: string, role: UserRole): Promise<void>
}
