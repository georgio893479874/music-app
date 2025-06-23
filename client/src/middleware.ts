import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (/\.[^/]+$/.test(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("authToken")?.value;
  const publicPaths = ["/", "/login", "/signup", "/oauth/success"];

  if (!token && !publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
