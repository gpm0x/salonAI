import type { IAlertRepository } from "../../domain/alert.repository"

export class MarkAlertReadUseCase {
  constructor(private readonly repo: IAlertRepository) {}

  async execute(id: string, organizationId: string): Promise<void> {
    await this.repo.markAsRead(id, organizationId)
  }
}
