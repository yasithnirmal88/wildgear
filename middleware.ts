import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY;
  const providedKey = request.nextUrl.searchParams.get("key");

  if (!adminSecret || providedKey !== adminSecret) {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};