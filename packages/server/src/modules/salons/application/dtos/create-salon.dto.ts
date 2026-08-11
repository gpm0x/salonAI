import { z } from "zod"

const PHONE_REGEX = /^[\d\s\+\-\(\)]{7,20}$/

export const createSalonSchema = z.object({
  nome: z.string().min(2).max(100).trim(),
  endereco: z.string().max(300).trim().optional(),
  cidade: z.string().max(100).trim().optional(),
  telefone: z.string().regex(PHONE_REGEX, "Telefone inválido").optional(),
  horario: z.string().max(1000).optional(),
  cadeiras: z.number().int().min(1).max(500).default(1),
  principal: z.boolean().default(false),
})

export type CreateSalonInput = z.infer<typeof createSalonSchema>
