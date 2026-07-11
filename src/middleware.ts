import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// NextAuth v5 cookie names
const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Secure-authjs.session-token"
    : "authjs.session-token"

export default function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)
  const isLoggedIn = !!sessionCookie?.value
  const pathname = request.nextUrl.pathname

  const isAuthPage = pathname === "/login" || pathname === "/register"
  const isApiRoute = pathname.startsWith("/api")
  const isProtectedPage = !isAuthPage && !isApiRoute

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (!isLoggedIn && isProtectedPage) {
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url),
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|public|api).*)"],
}
