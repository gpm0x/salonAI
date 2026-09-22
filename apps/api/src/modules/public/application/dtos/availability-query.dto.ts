import { z } from "zod"

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

export const availabilityQuerySchema = z.object({
  date: z.string().regex(DATE_REGEX, "Data inválida (use YYYY-MM-DD)"),
  professionalId: z.string().uuid(),
  serviceId: z.string().uuid(),
}).strict()

export type AvailabilityQueryInput = z.infer<typeof availabilityQuerySchema>
