import type { UseCase } from "@/shared/application/use-case"
import type { ITransactionRepository } from "../../domain/transaction.repository"
import type { TransactionItemDTO } from "../dtos/transaction-item.dto"
import { NotFoundError } from "@/shared/domain/errors"

interface Input { id: string; organizationId: string }

export class GetTransactionUseCase implements UseCase<Input, TransactionItemDTO> {
  constructor(private readonly repo: ITransactionRepository) {}

  async execute({ id, organizationId }: Input): Promise<TransactionItemDTO> {
    const dto = await this.repo.findById(id, organizationId)
    if (!dto) throw new NotFoundError("Transacao nao encontrada")
    return dto
  }
}
