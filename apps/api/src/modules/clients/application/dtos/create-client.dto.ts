import { z } from "zod"

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

// Formato de email/telefone é validado pelos Value Objects (Email, Phone) no use-case.
export const createClientSchema = z.object({
  nome: z.string().min(2).max(100).trim(),
  email: z.string().max(254).trim().optional(),
  telefone: z.string().trim().optional(),
  status: z.enum(["ativo", "novo", "inativo", "vip"]).default("novo"),
  aniversario: z.string().regex(DATE_REGEX, "Data inválida (use YYYY-MM-DD)").optional(),
  servicoFavorito: z.string().max(100).trim().optional(),
  profissionalPreferidoId: z.string().uuid().optional(),
}).strict()

export type CreateClientInput = z.infer<typeof createClientSchema>
