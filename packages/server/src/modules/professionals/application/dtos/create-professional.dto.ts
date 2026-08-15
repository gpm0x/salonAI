import { z } from "zod"

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const PHONE_REGEX = /^[\d\s\+\-\(\)]{7,20}$/
const DIAS_VALIDOS = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"] as const

export const createProfessionalSchema = z.object({
  nome: z.string().min(2).max(100).trim(),
  especialidade: z.string().max(100).trim().optional(),
  email: z.string().email().max(254).optional(),
  telefone: z.string().regex(PHONE_REGEX, "Telefone inválido").optional(),
  salonId: z.string().uuid().optional(),
  status: z.enum(["ativo", "ferias", "inativo"]).default("ativo"),
  comissao: z.number().min(0).max(100).default(0),
  servicos: z.array(z.string().uuid()).max(50).default([]),
  dias: z.array(z.enum(DIAS_VALIDOS)).max(7).default([]),
  horario: z.string().max(500).optional(),
  desde: z.string().regex(DATE_REGEX, "Data inválida (use YYYY-MM-DD)").optional(),
}).strict()

export type CreateProfessionalInput = z.infer<typeof createProfessionalSchema>
