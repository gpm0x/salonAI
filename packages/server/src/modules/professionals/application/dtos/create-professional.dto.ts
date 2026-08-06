import { z } from "zod"

export const createProfessionalSchema = z.object({
  nome: z.string().min(2).max(100),
  especialidade: z.string().optional(),
  email: z.string().email().optional(),
  telefone: z.string().optional(),
  salonId: z.string().uuid().optional(),
  status: z.enum(["ativo", "ferias", "inativo"]).default("ativo"),
  comissao: z.number().min(0).max(100).default(0),
  servicos: z.array(z.string()).default([]),
  dias: z.array(z.string()).default([]),
  horario: z.string().optional(),
  desde: z.string().optional(),
})

export type CreateProfessionalInput = z.infer<typeof createProfessionalSchema>
