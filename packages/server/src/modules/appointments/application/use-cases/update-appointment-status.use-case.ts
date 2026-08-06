import type { UseCase } from "@/shared/application/use-case"
import type { IAppointmentRepository } from "../../domain/appointment.repository"
import type { UpdateAppointmentStatusInput } from "../dtos/update-appointment-status.dto"
import { NotFoundError } from "@/shared/domain/errors"

interface Input extends UpdateAppointmentStatusInput { id: string; organizationId: string }

export class UpdateAppointmentStatusUseCase implements UseCase<Input, void> {
  constructor(private readonly repo: IAppointmentRepository) {}

  async execute({ id, organizationId, status }: Input): Promise<void> {
    const existing = await this.repo.findById(id, organizationId)
    if (!existing) throw new NotFoundError("Agendamento nao encontrado")
    await this.repo.updateStatus(id, status)
  }
}
