import { z } from "zod"

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const PHONE_REGEX = /^[\d\s\+\-\(\)]{7,20}$/
const DIAS_VALIDOS = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"] as const

export const updateProfessionalSchema = z.object({
  nome: z.string().min(2).max(100).trim().optional(),
  especialidade: z.string().max(100).trim().nullable().optional(),
  email: z.string().email().max(254).nullable().optional(),
  telefone: z.string().regex(PHONE_REGEX, "Telefone inválido").nullable().optional(),
  salonId: z.string().uuid().nullable().optional(),
  status: z.enum(["ativo", "ferias", "inativo"]).optional(),
  comissao: z.number().min(0).max(100).optional(),
  avaliacao: z.number().min(0).max(5).optional(),
  servicos: z.array(z.string().uuid()).max(50).optional(),
  dias: z.array(z.enum(DIAS_VALIDOS)).max(7).optional(),
  horario: z.string().max(500).nullable().optional(),
  desde: z.string().regex(DATE_REGEX, "Data inválida (use YYYY-MM-DD)").nullable().optional(),
})

export type UpdateProfessionalInput = z.infer<typeof updateProfessionalSchema>
