import type { UseCase } from "@/shared/application/use-case"
import type { PrismaDashboardRepository } from "../../infra/prisma/prisma-dashboard.repository"
import type { DashboardMetricsDTO } from "../dtos/dashboard-metrics.dto"

interface Input { organizationId: string }

export class GetDashboardMetricsUseCase implements UseCase<Input, DashboardMetricsDTO> {
  constructor(private readonly repo: PrismaDashboardRepository) {}

  async execute({ organizationId }: Input): Promise<DashboardMetricsDTO> {
    return this.repo.getMetrics(organizationId)
  }
}
