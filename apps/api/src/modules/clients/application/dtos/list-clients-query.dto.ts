import { z } from "zod"

export const listClientsQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
}).strict()

export type ListClientsQueryInput = z.infer<typeof listClientsQuerySchema>
