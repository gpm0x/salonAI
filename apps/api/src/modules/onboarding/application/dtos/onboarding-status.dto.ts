export type OnboardingStep = "organization" | "salon" | "professional"

export interface OnboardingStatusDTO {
  hasOrganization: boolean
  hasSalon: boolean
  hasProfessional: boolean
  completed: boolean
  nextStep: OnboardingStep | null
  organizationId?: string
  salonId?: string
}
