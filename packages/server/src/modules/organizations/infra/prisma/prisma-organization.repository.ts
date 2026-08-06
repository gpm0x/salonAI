import type { PrismaClient } from "@prisma/client"
import { Organization } from "../../domain/organization.entity"
import type { IOrganizationRepository } from "../../domain/organization.repository"

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
    await this.prisma.organization.create({
      data: {
        id: org.id,
        name: org.name,
        ownerId: org.ownerId,
        slug: org.slug ?? null,
        subscriptionStatus: org.subscriptionStatus,
      },
    })
  }

  async findById(id: string): Promise<Organization | null> {
    const row = await this.prisma.organization.findUnique({ where: { id } })
    return row ? this.toEntity(row) : null
  }

  async findByOwnerId(ownerId: string): Promise<Organization | null> {
    const row = await this.prisma.organization.findFirst({ where: { ownerId } })
    return row ? this.toEntity(row) : null
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
