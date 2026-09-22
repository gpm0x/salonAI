import { z } from "zod"

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

export const transactionReportQuerySchema = z.object({
  from: z.string().regex(DATE_REGEX, "Data inválida (use YYYY-MM-DD)"),
  to: z.string().regex(DATE_REGEX, "Data inválida (use YYYY-MM-DD)"),
  salonId: z.string().uuid().optional(),
  professionalId: z.string().uuid().optional(),
  groupBy: z.enum(["day", "week", "month"]).default("day"),
}).strict()

export type TransactionReportQueryInput = z.infer<typeof transactionReportQuerySchema>
