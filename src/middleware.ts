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

  const isAuthPage = pathname === "/login"
  const isRegister = pathname === "/register"
  const isDashboard = pathname.startsWith("/dashboard")

  if (isLoggedIn && (isAuthPage || isRegister)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (!isLoggedIn && isDashboard) {
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url),
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|public|api).*)"],
}
