import { z } from "zod"

const PHONE_REGEX = /^[\d\s\+\-\(\)]{7,20}$/

export const updateSalonSchema = z.object({
  nome: z.string().min(2).max(100).trim().optional(),
  endereco: z.string().max(300).trim().nullable().optional(),
  cidade: z.string().max(100).trim().nullable().optional(),
  telefone: z.string().regex(PHONE_REGEX, "Telefone inválido").nullable().optional(),
  horario: z.string().max(1000).nullable().optional(),
  cadeiras: z.number().int().min(1).max(500).optional(),
  principal: z.boolean().optional(),
  ativa: z.boolean().optional(),
}).strict()

export type UpdateSalonInput = z.infer<typeof updateSalonSchema>
