import type { UseCase } from "@/shared/application/use-case"
import type { IClientRepository } from "../../domain/client.repository"
import { Client } from "../../domain/client.entity"
import type { CreateClientInput } from "../dtos/create-client.dto"
import { Email, Phone } from "@/shared/domain/value-objects"

interface Input extends CreateClientInput { organizationId: string }
interface Output { clientId: string }

export class CreateClientUseCase implements UseCase<Input, Output> {
  constructor(private readonly repo: IClientRepository) {}

  async execute(input: Input): Promise<Output> {
    const client = Client.create({
      organizationId: input.organizationId,
      name: input.nome,
      email: input.email ? Email.create(input.email) : undefined,
      phone: input.telefone ? Phone.create(input.telefone) : undefined,
      status: input.status ?? "novo",
      birthday: input.aniversario,
      favoriteService: input.servicoFavorito,
      preferredProfessionalId: input.profissionalPreferidoId,
    })

    await this.repo.create(client)
    return { clientId: client.id }
  }
}
