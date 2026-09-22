import { z } from "zod"

export const createPublicAppointmentSchema = z.object({
  salonSlug: z.string().min(1).max(120).trim(),
  serviceId: z.string().uuid(),
  professionalId: z.string().uuid(),
  startsAt: z.string().datetime(),
  clientName: z.string().min(2).max(80).trim(),
  clientPhone: z.string().min(1).max(20).trim(),
}).strict()

export type CreatePublicAppointmentInput = z.infer<typeof createPublicAppointmentSchema>
