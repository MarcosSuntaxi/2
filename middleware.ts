import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const userRole = request.cookies.get("userRole")?.value

  const isAuthPage = request.nextUrl.pathname === "/"
  const isAdminPage = request.nextUrl.pathname.startsWith("/admin-dashboard")
  const isUserPage = request.nextUrl.pathname.startsWith("/user-dashboard")

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/user-dashboard", request.url))
  }

  if (isAdminPage && userRole !== "administrator") {
    return NextResponse.redirect(new URL("/user-dashboard", request.url))
  }

  if (isUserPage && userRole !== "user") {
    return NextResponse.redirect(new URL("/admin-dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/admin-dashboard/:path*", "/user-dashboard/:path*"],
}

