import { betterAuth } from "better-auth"

export const auth = betterAuth({
  database: {
    type: "pg",
    url: process.env.DATABASE_URL!,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
})
