import type { IAlertRepository } from "../../domain/alert.repository"
import { occupancyAlerts, retentionAlerts, serviceTrendAlerts } from "../../alerts-engine"

interface GenerateAlertsOutput {
  generated: number
}

export class GenerateAlertsUseCase {
  constructor(private readonly repo: IAlertRepository) {}

  async execute(organizationId: string): Promise<GenerateAlertsOutput> {
    const [profData, serviceData] = await Promise.all([
      this.repo.getProfessionalOccupancyData(organizationId),
      this.repo.getServiceTrendData(organizationId),
    ])

    const avgTicketCents =
      serviceData.length > 0
        ? Math.round(serviceData.reduce((s, sv) => s + sv.avgPriceCents, 0) / serviceData.length)
        : 0

    const staleCount = await this.repo.getStaleClientsCount(organizationId, 45)

    const alerts = [
      ...occupancyAlerts(profData, organizationId),
      ...retentionAlerts(staleCount, avgTicketCents, organizationId),
      ...serviceTrendAlerts(serviceData, organizationId),
    ]

    await this.repo.clearUnread(organizationId)
    if (alerts.length > 0) await this.repo.createMany(alerts)

    return { generated: alerts.length }
  }
}
