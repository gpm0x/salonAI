import type { IAlertRepository } from "../../domain/alert.repository"
import type { AlertItemDTO } from "../dtos/alert-item.dto"

export class ListAlertsUseCase {
  constructor(private readonly repo: IAlertRepository) {}

  async execute(organizationId: string): Promise<AlertItemDTO[]> {
    return this.repo.list(organizationId)
  }
}
