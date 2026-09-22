import type { UseCase } from "@/shared/application/use-case"
import type { IAppointmentRepository } from "../../domain/appointment.repository"
import type { AppointmentItemDTO } from "../dtos/appointment-item.dto"
import { NotFoundError } from "@/shared/domain/errors"

interface Input { id: string; organizationId: string }

export class CompleteAppointmentUseCase implements UseCase<Input, AppointmentItemDTO> {
  constructor(private readonly repo: IAppointmentRepository) {}

  async execute({ id, organizationId }: Input): Promise<AppointmentItemDTO> {
    const existing = await this.repo.findByIdWithDetails(id, organizationId)
    if (!existing) throw new NotFoundError("Agendamento nao encontrado")

    // A checagem de "ja concluido"/"cancelado" acontece dentro da transacao
    // (WHERE do updateMany), nao aqui: evita a corrida entre este check e o
    // update em completes concorrentes do mesmo agendamento.
    await this.repo.completeWithTransaction(id, organizationId, {
      serviceName: existing.servico,
      amountCents: Math.round(existing.valor * 100),
      clientId: existing.clienteId,
      professionalId: existing.profissionalId,
    })

    const updated = await this.repo.findByIdWithDetails(id, organizationId)
    if (!updated) throw new NotFoundError("Agendamento nao encontrado")
    return updated
  }
}
