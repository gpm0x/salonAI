import type { UseCase } from "@/shared/application/use-case"
import type { IProfessionalRepository } from "../../domain/professional.repository"
import { Professional } from "../../domain/professional.entity"
import type { UpdateProfessionalInput } from "../dtos/update-professional.dto"
import { NotFoundError } from "@/shared/domain/errors"

interface Input extends UpdateProfessionalInput { id: string; organizationId: string }

export class UpdateProfessionalUseCase implements UseCase<Input, void> {
  constructor(private readonly repo: IProfessionalRepository) {}

  async execute({ id, organizationId, ...data }: Input): Promise<void> {
    const existing = await this.repo.findById(id, organizationId)
    if (!existing) throw new NotFoundError("Profissional nao encontrado")

    const updated = new Professional(
      {
        organizationId,
        salonId: data.salonId !== undefined ? (data.salonId ?? undefined) : existing.salonId,
        name: data.nome ?? existing.name,
        specialty: data.especialidade !== undefined ? (data.especialidade ?? undefined) : existing.specialty,
        email: data.email !== undefined ? (data.email ?? undefined) : existing.email,
        phone: data.telefone !== undefined ? (data.telefone ?? undefined) : existing.phone,
        status: data.status ?? existing.status,
        commissionPct: data.comissao ?? existing.commissionPct,
        rating: data.avaliacao ?? existing.rating,
        workingServices: data.servicos ?? existing.workingServices,
        workingDays: data.dias ?? existing.workingDays,
        workingHours: data.horario !== undefined ? (data.horario ?? undefined) : existing.workingHours,
        hiredAt: data.desde !== undefined ? (data.desde ? new Date(data.desde) : undefined) : existing.hiredAt,
      },
      id,
    )

    await this.repo.update(updated)
  }
}
