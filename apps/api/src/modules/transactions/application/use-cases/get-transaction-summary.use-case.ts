import type { UseCase } from "@/shared/application/use-case"
import type { ITransactionRepository } from "../../domain/transaction.repository"
import type { TransactionSummaryDTO } from "../dtos/transaction-summary.dto"

interface Input { organizationId: string }

export class GetTransactionSummaryUseCase implements UseCase<Input, TransactionSummaryDTO> {
  constructor(private readonly repo: ITransactionRepository) {}

  async execute({ organizationId }: Input): Promise<TransactionSummaryDTO> {
    return this.repo.getSummary(organizationId)
  }
}
