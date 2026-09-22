import type { PrismaClient } from "@prisma/client"
import type { IOnboardingRepository, OnboardingCounts } from "../../domain/onboarding.repository"
import { resolveUserOrganizationId } from "@/shared/infrastructure/prisma/resolve-user-organization-id"

export class PrismaOnboardingRepository implements IOnboardingRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getCounts(userId: string): Promise<OnboardingCounts> {
    const organizationId = await resolveUserOrganizationId(userId)

    if (!organizationId) {
      return { organizationId: null, salonCount: 0, professionalCount: 0, firstSalonId: null }
    }

    const [salonCount, professionalCount, firstSalon] = await Promise.all([
      this.prisma.salon.count({ where: { organizationId } }),
      this.prisma.professional.count({ where: { organizationId } }),
      this.prisma.salon.findFirst({
        where: { organizationId },
        orderBy: { createdAt: "asc" },
        select: { id: true },
      }),
    ])

    return {
      organizationId,
      salonCount,
      professionalCount,
      firstSalonId: firstSalon?.id ?? null,
    }
  }
}
