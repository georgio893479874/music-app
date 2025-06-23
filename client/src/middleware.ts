import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const publicPaths = ["/", "/login", "/signup", "/oauth/success"];
  
  if (!token && !publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next|static|.*\\.(png|jpg|jpeg|gif|svg|ico|webp|avif|bmp|tiff)).*)",
  ],
};
