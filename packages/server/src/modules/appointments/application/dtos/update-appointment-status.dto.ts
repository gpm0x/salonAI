import { z } from "zod"

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(["aguardando", "confirmado", "em_atendimento", "concluido", "cancelado"]),
})

export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>
