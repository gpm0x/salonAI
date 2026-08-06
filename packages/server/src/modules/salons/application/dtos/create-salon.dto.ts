import { z } from "zod"

export const createSalonSchema = z.object({
  nome: z.string().min(2).max(100),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  telefone: z.string().optional(),
  horario: z.string().optional(),
  cadeiras: z.number().int().min(1).default(1),
  principal: z.boolean().default(false),
})

export type CreateSalonInput = z.infer<typeof createSalonSchema>
