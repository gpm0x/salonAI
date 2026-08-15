import { z } from "zod"

export const createTransactionSchema = z.object({
  clienteId: z.string().uuid().optional(),
  profissionalId: z.string().uuid().optional(),
  appointmentId: z.string().uuid().optional(),
  servico: z.string().max(100).trim().optional(),
  valor: z.number().positive().max(100_000),
  forma: z.enum(["Pix", "Crédito", "Débito", "Dinheiro"]),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida (use YYYY-MM-DD)").optional(),
}).strict()

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
