import type { UseCase } from "@/shared/application/use-case"
import type { IOrganizationRepository } from "../../domain/organization.repository"
import type { IUserRoleRepository } from "../../domain/user-role.repository"
import type { UserRole } from "@/shared/domain/user-role"
import { NotFoundError, ConflictError } from "@/shared/domain/errors"

interface Input {
  organizationId: string
  requesterId: string
  targetUserId: string
  role: UserRole
}

export class UpdateMemberRoleUseCase implements UseCase<Input, void> {
  constructor(
    private readonly organizationRepo: IOrganizationRepository,
    private readonly userRoleRepo: IUserRoleRepository,
  ) {}

  async execute({ organizationId, requesterId, targetUserId, role }: Input): Promise<void> {
    const organization = await this.organizationRepo.findById(organizationId)
    if (!organization) throw new NotFoundError("Organizacao nao encontrada")

    const membership = await this.userRoleRepo.findMembership(targetUserId)
    if (!membership || membership.organizationId !== organizationId) {
      throw new NotFoundError("Usuario nao encontrado nesta organizacao")
    }

    if (targetUserId === organization.ownerId) {
      throw new ConflictError("Nao e possivel alterar o cargo do proprietario da organizacao")
    }

    const isSelfDemotionFromAdmin =
      targetUserId === requesterId && membership.role === "admin" && role !== "admin"
    if (isSelfDemotionFromAdmin) {
      const adminCount = await this.userRoleRepo.countAdminsInOrganization(organizationId)
      if (adminCount <= 1) {
        throw new ConflictError("Nao e possivel remover o unico administrador da organizacao")
      }
    }

    await this.userRoleRepo.updateRole(targetUserId, role)
  }
}
