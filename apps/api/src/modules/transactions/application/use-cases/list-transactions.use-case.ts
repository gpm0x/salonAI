import type { UseCase } from "@/shared/application/use-case"
import type { ITransactionRepository } from "../../domain/transaction.repository"
import type { TransactionItemDTO } from "../dtos/transaction-item.dto"

interface Input { organizationId: string; mes?: string }
interface Output { data: TransactionItemDTO[] }

export class ListTransactionsUseCase implements UseCase<Input, Output> {
  constructor(private readonly repo: ITransactionRepository) {}

  async execute({ organizationId, mes }: Input): Promise<Output> {
    const now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth()

    if (mes) {
      if (!/^\d{4}-\d{2}$/.test(mes)) {
        const data = await this.repo.list(
          organizationId,
          new Date(year, month, 1),
          new Date(year, month + 1, 0, 23, 59, 59, 999),
        )
        return { data }
      }
      const [y, m] = mes.split("-").map(Number)
      if (!isNaN(y) && !isNaN(m) && m >= 1 && m <= 12) {
        year = y
        month = m - 1
      }
    }

    const monthStart = new Date(year, month, 1)
    const monthEnd = new Date(year, month + 1, 0, 23, 59, 59, 999)
    const data = await this.repo.list(organizationId, monthStart, monthEnd)
    return { data }
  }
}
