import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware base do Next.js.
// Todo arquivo `middleware.ts` PRECISA exportar uma função `middleware`
// (ou default) — por isso o erro quando o arquivo estava vazio.
//
// Por enquanto apenas repassa a requisição. Quando a auth via Supabase
// estiver implementada em `lib/auth/session.ts`, proteja aqui as rotas
// do grupo (dashboard): leia o token/sessão e redirecione para /login
// quando não autenticado.
export function proxy(_request: NextRequest) {
    return NextResponse.next();
}

// Aplica o middleware a todas as rotas, exceto assets estáticos e internos.
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
