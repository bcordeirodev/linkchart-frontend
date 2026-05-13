import { auth0 } from "@/lib/auth0";
import type { NextRequest } from "next/server";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-DNS-Prefetch-Control": "on",
};

/**
 * Extracts all __txn_* cookie names from the Cookie header.
 * These are Auth0 transaction cookies created per login attempt.
 */
function getStaleTransactionCookies(cookieHeader: string): string[] {
  return cookieHeader
    .split(";")
    .map((c) => c.trim().split("=")[0])
    .filter((name) => name.startsWith("__txn_"));
}

/**
 * Merged middleware: Auth0 handles /auth/* routes; security headers are
 * applied to every non-redirect response so they reach all app pages.
 *
 * On /auth/login, stale __txn_* cookies from abandoned flows are deleted
 * before a new one is issued. Without this cleanup they accumulate and grow
 * the Cookie header past Nginx's large_client_header_buffers limit (~8 KB),
 * causing the callback request to be dropped (HTTP 000 / 502) or the Cookie
 * header to be truncated, which results in "The state parameter is invalid."
 */
export async function middleware(request: NextRequest) {
  const response = await auth0.middleware(request);

  if (request.nextUrl.pathname === "/auth/login") {
    const cookieHeader = request.headers.get("cookie") ?? "";
    const stale = getStaleTransactionCookies(cookieHeader);
    for (const name of stale) {
      response.cookies.set(name, "", { maxAge: 0, path: "/" });
    }
  }

  // Skip header injection on redirects (Auth0 login/logout redirects).
  const isRedirect = response.status >= 300 && response.status < 400;
  if (!isRedirect) {
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

  return response;
}

export const config = {
  matcher: [
    // Match all routes except static files and public assets used in OG metadata
    "/((?!_next/static|_next/image|favicon\\.ico|og-default\\.png).*)",
  ],
};
