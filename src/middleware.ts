import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ADMIN_COOKIE_NAME } from "@/lib/constants";

/**
 * Task 4: Route Protection Middleware
 * Guards /admin/* (except /admin/login) and /api/admin/* (except /api/admin/login)
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow login endpoints through without authentication
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  // 2. Extract JWT token from cookie or Authorization header
  let token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
      token = authHeader.substring(7).trim();
    }
  }

  // 3. Verify token with jose (Edge-compatible)
  let isAuthenticated = false;
  if (token) {
    try {
      const secretKey = new TextEncoder().encode(
        process.env.JWT_SECRET || "super-secret-jwt-key-min-32-characters-long"
      );
      const { payload } = await jwtVerify(token, secretKey);
      if (payload.sub === "admin") {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // 4. Handle unauthenticated access
  if (!isAuthenticated) {
    // API routes return 401 JSON
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json(
        {
          error: {
            code: "UNAUTHORIZED",
            message: "Admin authorization required. Please log in.",
          },
        },
        { status: 401 }
      );
    }

    // Page routes redirect to /admin/login
    if (pathname.startsWith("/admin")) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
