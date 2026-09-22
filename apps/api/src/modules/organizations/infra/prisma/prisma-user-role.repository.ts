import type { PrismaClient } from "@prisma/client"
import type { IUserRoleRepository, UserMembership } from "../../domain/user-role.repository"
import type { UserRole } from "@/shared/domain/user-role"

export class PrismaUserRoleRepository implements IUserRoleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findMembership(userId: string): Promise<UserMembership | null> {
    const row = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { organizationId: true, role: true },
    })
    if (!row) return null

    return { organizationId: row.organizationId, role: row.role as UserRole }
  }

  async countAdminsInOrganization(organizationId: string): Promise<number> {
    return this.prisma.user.count({ where: { organizationId, role: "admin" } })
  }

  async updateRole(userId: string, role: UserRole): Promise<void> {
    await this.prisma.user.update({ where: { id: userId }, data: { role } })
  }
}
