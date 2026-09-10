import type { UseCase } from "@/shared/application/use-case"
import type { IAppointmentRepository } from "../../domain/appointment.repository"
import type { AppointmentItemDTO } from "../dtos/appointment-item.dto"

interface Input { organizationId: string; data?: string }
interface Output { data: AppointmentItemDTO[] }

export class ListAppointmentsUseCase implements UseCase<Input, Output> {
  constructor(private readonly repo: IAppointmentRepository) {}

  async execute({ organizationId, data }: Input): Promise<Output> {
    const date = data ? new Date(data) : new Date()
    const items = await this.repo.list(organizationId, date)
    return { data: items }
  }
}
