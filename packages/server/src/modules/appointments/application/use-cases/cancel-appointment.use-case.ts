import type { UseCase } from "@/shared/application/use-case"
import type { IAppointmentRepository } from "../../domain/appointment.repository"
import { NotFoundError } from "@/shared/domain/errors"

interface Input { id: string; organizationId: string }

export class CancelAppointmentUseCase implements UseCase<Input, void> {
  constructor(private readonly repo: IAppointmentRepository) {}

  async execute({ id, organizationId }: Input): Promise<void> {
    const existing = await this.repo.findById(id, organizationId)
    if (!existing) throw new NotFoundError("Agendamento nao encontrado")
    await this.repo.updateStatus(id, "cancelado")
  }
}
