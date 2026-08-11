import { z } from "zod"

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const PHONE_REGEX = /^[\d\s\+\-\(\)]{7,20}$/

export const updateClientSchema = z.object({
  nome: z.string().min(2).max(100).trim().optional(),
  email: z.string().email().max(254).nullable().optional(),
  telefone: z.string().regex(PHONE_REGEX, "Telefone inválido").nullable().optional(),
  status: z.enum(["ativo", "novo", "inativo", "vip"]).optional(),
  aniversario: z.string().regex(DATE_REGEX, "Data inválida (use YYYY-MM-DD)").nullable().optional(),
  servicoFavorito: z.string().max(100).trim().nullable().optional(),
  profissionalPreferidoId: z.string().uuid().nullable().optional(),
})

export type UpdateClientInput = z.infer<typeof updateClientSchema>
