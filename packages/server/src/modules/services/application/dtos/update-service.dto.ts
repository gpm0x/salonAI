import { z } from "zod"
import { SERVICE_CATEGORIES } from "./create-service.dto"

export const updateServiceSchema = z.object({
  nome: z.string().min(2).max(100).optional(),
  categoria: z.enum(SERVICE_CATEGORIES).optional(),
  duracao: z
    .number()
    .int()
    .min(10)
    .refine((v) => v % 5 === 0, "Duração deve ser múltiplo de 5")
    .optional(),
  preco: z.number().positive().optional(),
  comissao: z.number().min(0).max(100).optional(),
  ativo: z.boolean().optional(),
})

export type UpdateServiceInput = z.infer<typeof updateServiceSchema>
