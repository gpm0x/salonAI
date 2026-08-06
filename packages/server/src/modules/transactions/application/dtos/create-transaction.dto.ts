import { z } from "zod"

export const createTransactionSchema = z.object({
  clienteId: z.string().uuid().optional(),
  profissionalId: z.string().uuid().optional(),
  appointmentId: z.string().uuid().optional(),
  servico: z.string().optional(),
  valor: z.number().positive(),
  forma: z.enum(["Pix", "Crédito", "Débito", "Dinheiro"]),
  data: z.string().optional(),
})

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
