import { z } from "zod"

export const updateProfessionalSchema = z.object({
  nome: z.string().min(2).max(100).optional(),
  especialidade: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  telefone: z.string().nullable().optional(),
  salonId: z.string().uuid().nullable().optional(),
  status: z.enum(["ativo", "ferias", "inativo"]).optional(),
  comissao: z.number().min(0).max(100).optional(),
  avaliacao: z.number().min(0).max(5).optional(),
  servicos: z.array(z.string()).optional(),
  dias: z.array(z.string()).optional(),
  horario: z.string().nullable().optional(),
  desde: z.string().nullable().optional(),
})

export type UpdateProfessionalInput = z.infer<typeof updateProfessionalSchema>
