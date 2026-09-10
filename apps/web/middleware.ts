import { NextRequest, NextResponse } from "next/server"

const PUBLIC_PATHS = ["/login", "/cadastro", "/esqueci-senha", "/api/auth"]

export function middleware(request: NextRequest) {
  // Defense-in-depth against CVE-2025-29927: reject any external request
  // carrying the Next.js-internal subrequest header. Legitimate subrequests
  // are only ever set by the Next.js runtime itself and should never arrive
  // from the network. The upstream patch (next >=15.5.23) already prevents
  // the bypass, but this layer ensures it is blocked before routing even begins.
  if (request.headers.get("x-middleware-subrequest")) {
    return new NextResponse(null, { status: 403 })
  }

  const { pathname } = request.nextUrl

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))
  if (isPublic) return NextResponse.next()

  // Shallow cookie presence check — fast path only.
  // Authoritative session validation happens in (dashboard)/layout.tsx
  // via getSession(), which verifies the token against the database.
  const sessionCookie = request.cookies.get("better-auth.session_token")
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\..*).*)"],
}
