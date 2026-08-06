import type { UseCase } from "@/shared/application/use-case"
import type { ITransactionRepository } from "../../domain/transaction.repository"
import type { TransactionItemDTO } from "../dtos/transaction-item.dto"

interface Input { organizationId: string; mes?: string }
interface Output { data: TransactionItemDTO[] }

export class ListTransactionsUseCase implements UseCase<Input, Output> {
  constructor(private readonly repo: ITransactionRepository) {}

  async execute({ organizationId, mes }: Input): Promise<Output> {
    let year: number, month: number
    if (mes) {
      const [y, m] = mes.split("-").map(Number)
      year = y; month = m - 1
    } else {
      const now = new Date()
      year = now.getFullYear(); month = now.getMonth()
    }
    const monthStart = new Date(year, month, 1)
    const monthEnd = new Date(year, month + 1, 0, 23, 59, 59, 999)
    const data = await this.repo.list(organizationId, monthStart, monthEnd)
    return { data }
  }
}
