import type { UseCase } from "@/shared/application/use-case"
import type { IAppointmentRepository } from "../../domain/appointment.repository"
import type { AppointmentItemDTO } from "../dtos/appointment-item.dto"
import { NotFoundError } from "@/shared/domain/errors"

interface Input { id: string; organizationId: string }

export class GetAppointmentUseCase implements UseCase<Input, AppointmentItemDTO> {
  constructor(private readonly repo: IAppointmentRepository) {}

  async execute({ id, organizationId }: Input): Promise<AppointmentItemDTO> {
    const dto = await this.repo.findByIdWithDetails(id, organizationId)
    if (!dto) throw new NotFoundError("Agendamento nao encontrado")
    return dto
  }
}
