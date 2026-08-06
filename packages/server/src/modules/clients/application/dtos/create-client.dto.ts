import { z } from "zod"

export const createClientSchema = z.object({
  nome: z.string().min(2).max(100),
  email: z.string().email().optional(),
  telefone: z.string().optional(),
  status: z.enum(["ativo", "novo", "inativo", "vip"]).default("novo"),
  aniversario: z.string().optional(),
  servicoFavorito: z.string().optional(),
  profissionalPreferidoId: z.string().uuid().optional(),
})

export type CreateClientInput = z.infer<typeof createClientSchema>
