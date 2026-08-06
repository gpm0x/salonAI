import { z } from "zod"

export const SERVICE_CATEGORIES = [
  "Cortes",
  "Coloração",
  "Barbearia",
  "Escova & Penteados",
  "Tratamentos",
  "Unhas",
] as const

export const createServiceSchema = z.object({
  nome: z.string().min(2).max(100),
  categoria: z.enum(SERVICE_CATEGORIES),
  duracao: z.number().int().min(10).refine((v) => v % 5 === 0, "Duração deve ser múltiplo de 5"),
  preco: z.number().positive(),
  comissao: z.number().min(0).max(100).default(0),
})

export type CreateServiceInput = z.infer<typeof createServiceSchema>
