export interface OnboardingCounts {
  organizationId: string | null
  salonCount: number
  professionalCount: number
  firstSalonId: string | null
}

export interface IOnboardingRepository {
  getCounts(userId: string): Promise<OnboardingCounts>
}
