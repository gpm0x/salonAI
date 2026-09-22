import { z } from "zod"

export const USER_ROLES = ["admin", "staff", "client"] as const

export type UserRole = (typeof USER_ROLES)[number]

export const userRoleSchema = z.enum(USER_ROLES)
