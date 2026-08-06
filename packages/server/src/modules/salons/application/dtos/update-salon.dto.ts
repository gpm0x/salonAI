import { z } from "zod"

export const updateSalonSchema = z.object({
  nome: z.string().min(2).max(100).optional(),
  endereco: z.string().nullable().optional(),
  cidade: z.string().nullable().optional(),
  telefone: z.string().nullable().optional(),
  horario: z.string().nullable().optional(),
  cadeiras: z.number().int().min(1).optional(),
  principal: z.boolean().optional(),
  ativa: z.boolean().optional(),
})

export type UpdateSalonInput = z.infer<typeof updateSalonSchema>
