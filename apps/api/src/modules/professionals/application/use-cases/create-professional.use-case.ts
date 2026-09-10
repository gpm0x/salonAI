import type { UseCase } from "@/shared/application/use-case"
import type { IProfessionalRepository } from "../../domain/professional.repository"
import { Professional } from "../../domain/professional.entity"
import type { CreateProfessionalInput } from "../dtos/create-professional.dto"

interface Input extends CreateProfessionalInput { organizationId: string }
interface Output { professionalId: string }

export class CreateProfessionalUseCase implements UseCase<Input, Output> {
  constructor(private readonly repo: IProfessionalRepository) {}

  async execute(input: Input): Promise<Output> {
    const professional = Professional.create({
      organizationId: input.organizationId,
      salonId: input.salonId ?? undefined,
      name: input.nome,
      specialty: input.especialidade ?? undefined,
      email: input.email ?? undefined,
      phone: input.telefone ?? undefined,
      status: input.status ?? "ativo",
      commissionPct: input.comissao ?? 0,
      workingServices: input.servicos ?? [],
      workingDays: input.dias ?? [],
      workingHours: input.horario ?? undefined,
      hiredAt: input.desde ? new Date(input.desde) : undefined,
    })

    await this.repo.create(professional)
    return { professionalId: professional.id }
  }
}
