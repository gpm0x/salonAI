import { z } from "zod"

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const PHONE_REGEX = /^[\d\s\+\-\(\)]{7,20}$/

export const createClientSchema = z.object({
  nome: z.string().min(2).max(100).trim(),
  email: z.string().email().max(254).optional(),
  telefone: z.string().regex(PHONE_REGEX, "Telefone inválido").optional(),
  status: z.enum(["ativo", "novo", "inativo", "vip"]).default("novo"),
  aniversario: z.string().regex(DATE_REGEX, "Data inválida (use YYYY-MM-DD)").optional(),
  servicoFavorito: z.string().max(100).trim().optional(),
  profissionalPreferidoId: z.string().uuid().optional(),
}).strict()

export type CreateClientInput = z.infer<typeof createClientSchema>
