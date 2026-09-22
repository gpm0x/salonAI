import type { PrismaClient } from "@prisma/client"
import { Organization } from "../../domain/organization.entity"
import type { IOrganizationRepository } from "../../domain/organization.repository"
import type { OrganizationMemberDTO } from "../../application/dtos/organization-member.dto"

type OrganizationRow = {
  id: string
  name: string
  ownerId: string
  slug: string | null
  subscriptionStatus: string
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
}

export class PrismaOrganizationRepository implements IOrganizationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(org: Organization): Promise<void> {
    // Cria a org e ja vincula o dono como admin dela na mesma transacao:
    // sem isso o owner ficaria sem organizationId ate o self-heal do auth.plugin.
    await this.prisma.$transaction([
      this.prisma.organization.create({
        data: {
          id: org.id,
          name: org.name,
          ownerId: org.ownerId,
          slug: org.slug ?? null,
          subscriptionStatus: org.subscriptionStatus,
        },
      }),
      this.prisma.user.update({
        where: { id: org.ownerId },
        data: { organizationId: org.id, role: "admin" },
      }),
    ])
  }

  async findById(id: string): Promise<Organization | null> {
    const row = await this.prisma.organization.findUnique({ where: { id } })
    return row ? this.toEntity(row) : null
  }

  async findByOwnerId(ownerId: string): Promise<Organization | null> {
    const row = await this.prisma.organization.findFirst({ where: { ownerId } })
    return row ? this.toEntity(row) : null
  }

  async listMembers(organizationId: string): Promise<OrganizationMemberDTO[]> {
    return this.prisma.user.findMany({
      where: { organizationId },
      select: { id: true, name: true, email: true, role: true },
      orderBy: { name: "asc" },
    })
  }

  private toEntity(row: OrganizationRow): Organization {
    return new Organization(
      {
        name: row.name,
        ownerId: row.ownerId,
        slug: row.slug ?? undefined,
        subscriptionStatus: row.subscriptionStatus,
        stripeCustomerId: row.stripeCustomerId ?? undefined,
        stripeSubscriptionId: row.stripeSubscriptionId ?? undefined,
      },
      row.id,
    )
  }
}
