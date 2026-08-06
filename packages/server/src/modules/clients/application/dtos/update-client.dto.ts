import { z } from "zod"

export const updateClientSchema = z.object({
  nome: z.string().min(2).max(100).optional(),
  email: z.string().email().nullable().optional(),
  telefone: z.string().nullable().optional(),
  status: z.enum(["ativo", "novo", "inativo", "vip"]).optional(),
  aniversario: z.string().nullable().optional(),
  servicoFavorito: z.string().nullable().optional(),
  profissionalPreferidoId: z.string().uuid().nullable().optional(),
})

export type UpdateClientInput = z.infer<typeof updateClientSchema>
