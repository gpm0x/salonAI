import { z } from "zod"

export const createAppointmentSchema = z.object({
  salonId: z.string().uuid(),
  professionalId: z.string().uuid(),
  clientId: z.string().uuid(),
  serviceId: z.string().uuid(),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  inicio: z.string().regex(/^\d{2}:\d{2}$/),
  observacoes: z.string().optional(),
  valor: z.number().positive().optional(),
})

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>
