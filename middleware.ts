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
 * Merged middleware: Auth0 handles /auth/* routes; security headers are
 * applied to every non-redirect response so they reach all app pages.
 */
export async function middleware(request: NextRequest) {
  const response = await auth0.middleware(request);

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
