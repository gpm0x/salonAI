"use client"

import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"
import type { auth } from "./auth"

// Sem baseURL: o client usa a origin atual da página. As rotas de auth são
// servidas pelo próprio Next (app/api/auth/[...all]), então fixar a URL só
// quebra quando o dev server sobe numa porta diferente de 3000 (CORS).
export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
})
