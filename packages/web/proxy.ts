import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// proxy.ts — runs on every incoming request (Next.js 16 convention)
// Logs requests to the terminal like Next.js does

export default function proxy(request: NextRequest) {
  const start = Date.now();
  const { method, nextUrl } = request;
  const pathname = nextUrl.pathname;

  // Skip static assets and internal vite requests
  if (
    pathname.startsWith("/@") ||
    pathname.startsWith("/__") ||
    pathname.startsWith("/node_modules") ||
    pathname.match(/\.(js|css|ico|png|jpg|svg|woff2?|map)$/)
  ) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  const duration = Date.now() - start;
  const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });

  console.log(
    `  \x1b[90m${timestamp}\x1b[0m \x1b[1m${method}\x1b[0m ${pathname} \x1b[90m${duration}ms\x1b[0m`
  );

  return response;
}

export const config = {
  matcher: [
    // Match all routes except static files and vite internals
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
