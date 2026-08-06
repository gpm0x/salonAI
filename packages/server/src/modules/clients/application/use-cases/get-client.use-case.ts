import type { UseCase } from "@/shared/application/use-case"
import type { IClientRepository } from "../../domain/client.repository"
import type { ClientItemDTO } from "../dtos/client-item.dto"
import { NotFoundError } from "@/shared/domain/errors"

interface Input { id: string; organizationId: string }

export class GetClientUseCase implements UseCase<Input, ClientItemDTO> {
  constructor(private readonly repo: IClientRepository) {}

  async execute({ id, organizationId }: Input): Promise<ClientItemDTO> {
    const dto = await this.repo.findByIdWithMetrics(id, organizationId)
    if (!dto) throw new NotFoundError("Cliente nao encontrado")
    return dto
  }
}
