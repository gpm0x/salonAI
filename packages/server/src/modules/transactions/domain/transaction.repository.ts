import type { Transaction } from "./transaction.entity"
import type { TransactionItemDTO } from "../application/dtos/transaction-item.dto"
import type { TransactionSummaryDTO } from "../application/dtos/transaction-summary.dto"

export interface ITransactionRepository {
  create(transaction: Transaction): Promise<void>
  list(organizationId: string, monthStart: Date, monthEnd: Date): Promise<TransactionItemDTO[]>
  findById(id: string, organizationId: string): Promise<TransactionItemDTO | null>
  getSummary(organizationId: string): Promise<TransactionSummaryDTO>
}
