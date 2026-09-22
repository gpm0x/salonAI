export interface TransactionReportPeriodDTO {
  period: string
  incomeCents: number
  expenseCents: number
  netCents: number
  count: number
}

export interface TransactionReportDTO {
  data: TransactionReportPeriodDTO[]
  totals: {
    incomeCents: number
    expenseCents: number
    netCents: number
    count: number
  }
}
