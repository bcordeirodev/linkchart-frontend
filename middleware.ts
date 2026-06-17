import { auth0 } from "@/lib/auth0";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Content-Security-Policy delivered in Report-Only mode.
 *
 * It does NOT block anything yet — it surfaces violations (inline scripts from
 * GA/AdSense/JSON-LD, unexpected origins) so the policy can be tightened and
 * then switched to the enforcing `Content-Security-Policy` header. `style-src`
 * keeps `'unsafe-inline'` because MUI/Emotion inject inline styles at runtime.
 */
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "connect-src 'self' https://www.google-analytics.com",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://www.googlesyndication.com https://googleads.g.doubleclick.net",
  "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://ep2.adtrafficquality.google https://www.google.com",
].join("; ");

const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-DNS-Prefetch-Control": "on",
  "Content-Security-Policy-Report-Only": CSP_REPORT_ONLY,
};

/**
 * URL prefixes that require an authenticated Auth0 session. These map to the
 * App Router `(app)` route group (route groups don't appear in the URL).
 */
const PROTECTED_PREFIXES = ["/links", "/profile", "/analytics"];

/**
 * Whether the pathname belongs to a protected `(app)` route.
 */
function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Extracts all __txn_* cookie names from the Cookie header.
 * These are Auth0 transaction cookies created per login attempt.
 */
function getStaleTransactionCookies(cookieHeader: string): string[] {
  return cookieHeader
    .split(";")
    .map((c) => c.trim().split("=")[0] ?? "")
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

  // Server-side gate for protected (app) routes: redirect guests to /sign-in
  // BEFORE any page HTML is produced, instead of leaking a 200 shell and
  // relying solely on the client-side AuthGuardRedirect. Fails open on errors
  // so a session-read hiccup can't lock out legitimate users (the client guard
  // remains as defense-in-depth).
  const { pathname } = request.nextUrl;
  if (isProtectedPath(pathname)) {
    try {
      const session = await auth0.getSession(request);
      if (!session) {
        const signIn = new URL("/sign-in", request.url);
        return NextResponse.redirect(signIn);
      }
    } catch {
      // Ignore — allow through and let the client guard handle it.
    }
  }

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
