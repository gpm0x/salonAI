import { betterAuth } from "better-auth"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
})

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET,
  // Só fixa baseURL se BETTER_AUTH_URL estiver definida; senão o Better Auth
  // infere a partir do request (evita mismatch quando a porta muda em dev).
  baseURL: process.env.BETTER_AUTH_URL,
  advanced: {
    disableCSRFCheck: process.env.NODE_ENV !== "production",
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
})
