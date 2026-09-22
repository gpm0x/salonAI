import type { Transaction } from "./transaction.entity"
import type { TransactionItemDTO } from "../application/dtos/transaction-item.dto"
import type { TransactionSummaryDTO } from "../application/dtos/transaction-summary.dto"
import type { TransactionReportDTO } from "../application/dtos/transaction-report.dto"

export interface GetReportParams {
  organizationId: string
  from: Date
  to: Date
  salonId?: string
  professionalId?: string
  groupBy: "day" | "week" | "month"
}

export interface ITransactionRepository {
  create(transaction: Transaction): Promise<void>
  list(organizationId: string, monthStart: Date, monthEnd: Date): Promise<TransactionItemDTO[]>
  findById(id: string, organizationId: string): Promise<TransactionItemDTO | null>
  getSummary(organizationId: string): Promise<TransactionSummaryDTO>
  getReport(params: GetReportParams): Promise<TransactionReportDTO>
}
