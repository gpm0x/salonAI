import { z } from "zod"

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

// Formato de email/telefone é validado pelos Value Objects (Email, Phone) no use-case.
export const updateClientSchema = z.object({
  nome: z.string().min(2).max(100).trim().optional(),
  email: z.string().max(254).trim().nullable().optional(),
  telefone: z.string().trim().nullable().optional(),
  status: z.enum(["ativo", "novo", "inativo", "vip"]).optional(),
  aniversario: z.string().regex(DATE_REGEX, "Data inválida (use YYYY-MM-DD)").nullable().optional(),
  servicoFavorito: z.string().max(100).trim().nullable().optional(),
  profissionalPreferidoId: z.string().uuid().nullable().optional(),
}).strict()

export type UpdateClientInput = z.infer<typeof updateClientSchema>
