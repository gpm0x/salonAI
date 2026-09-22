import type { UseCase } from "@/shared/application/use-case"
import type { IOnboardingRepository } from "../../domain/onboarding.repository"
import type { OnboardingStatusDTO, OnboardingStep } from "../dtos/onboarding-status.dto"

interface Input {
  userId: string
}

export class GetOnboardingStatusUseCase implements UseCase<Input, OnboardingStatusDTO> {
  constructor(private readonly repo: IOnboardingRepository) {}

  async execute({ userId }: Input): Promise<OnboardingStatusDTO> {
    const counts = await this.repo.getCounts(userId)

    const hasOrganization = counts.organizationId !== null
    const hasSalon = counts.salonCount > 0
    const hasProfessional = counts.professionalCount > 0
    const completed = hasOrganization && hasSalon && hasProfessional

    const nextStep: OnboardingStep | null = !hasOrganization
      ? "organization"
      : !hasSalon
        ? "salon"
        : !hasProfessional
          ? "professional"
          : null

    return {
      hasOrganization,
      hasSalon,
      hasProfessional,
      completed,
      nextStep,
      organizationId: counts.organizationId ?? undefined,
      salonId: counts.firstSalonId ?? undefined,
    }
  }
}
