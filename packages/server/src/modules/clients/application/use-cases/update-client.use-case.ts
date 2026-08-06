import type { UseCase } from "@/shared/application/use-case"
import type { IClientRepository } from "../../domain/client.repository"
import { Client } from "../../domain/client.entity"
import type { UpdateClientInput } from "../dtos/update-client.dto"
import { NotFoundError } from "@/shared/domain/errors"

interface Input extends UpdateClientInput { id: string; organizationId: string }

export class UpdateClientUseCase implements UseCase<Input, void> {
  constructor(private readonly repo: IClientRepository) {}

  async execute({ id, organizationId, ...data }: Input): Promise<void> {
    const existing = await this.repo.findById(id, organizationId)
    if (!existing) throw new NotFoundError("Cliente nao encontrado")

    const updated = new Client(
      {
        organizationId,
        name: data.nome ?? existing.name,
        email: data.email !== undefined ? (data.email ?? undefined) : existing.email,
        phone: data.telefone !== undefined ? (data.telefone ?? undefined) : existing.phone,
        status: data.status ?? existing.status,
        birthday: data.aniversario !== undefined ? (data.aniversario ?? undefined) : existing.birthday,
        favoriteService: data.servicoFavorito !== undefined ? (data.servicoFavorito ?? undefined) : existing.favoriteService,
        preferredProfessionalId: data.profissionalPreferidoId !== undefined ? (data.profissionalPreferidoId ?? undefined) : existing.preferredProfessionalId,
      },
      id,
    )

    await this.repo.update(updated)
  }
}
