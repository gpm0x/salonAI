import type { UseCase } from "@/shared/application/use-case"
import type { PrismaDashboardRepository } from "../../infra/prisma/prisma-dashboard.repository"
import type { DashboardInsightsDTO } from "../dtos/dashboard-insights.dto"

interface Input { organizationId: string }

export class GetDashboardInsightsUseCase implements UseCase<Input, DashboardInsightsDTO> {
  constructor(private readonly repo: PrismaDashboardRepository) {}

  async execute({ organizationId }: Input): Promise<DashboardInsightsDTO> {
    return this.repo.getInsights(organizationId)
  }
}
