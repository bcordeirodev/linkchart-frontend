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
  // connect-src must list every XHR/beacon origin, or each one fires a
  // report. Faro RUM beacons to the Grafana collector; GA4 posts to regional
  // endpoints; AdSense/Ads open connections to the syndication/doubleclick/
  // adtrafficquality hosts already trusted in script-src/frame-src.
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://faro-collector-prod-sa-east-1.grafana.net https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google",
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
const PROTECTED_PREFIXES = [
  "/links",
  "/profile",
  "/analytics",
  "/reports",
  "/subdomains",
];

/**
 * Whether the pathname belongs to a protected `(app)` route.
 */
function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Matches the public bio "pretty URL" — a single path segment `/@{handle}`
 * (e.g. `/@creator`, never `/@creator/anything`). `@` can't be a real route
 * segment in the App Router (it's reserved for parallel-route slots), so the
 * actual page lives at `/b/{handle}` and this pattern is only used to rewrite
 * the pretty URL to it. Handle format itself is validated again, more
 * strictly, by the `/b/[handle]` route — this only needs to recognize the
 * shape well enough to rewrite.
 */
const BIO_PRETTY_URL_PATTERN = /^\/@([^/]+)$/;

/**
 * Label format accepted as a bio-page subdomain: lowercase alphanumerics
 * with internal hyphens, 3–30 characters total. Mirrors `HANDLE_PATTERN` in
 * `/b/[handle]/page.tsx` and the backend's subdomain claim validation — a
 * subdomain and a bio handle are independent identifiers, but both are
 * validated against the same shape.
 */
const BIO_SUBDOMAIN_PATTERN = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;

/**
 * Root domain the app is served from, derived from `NEXT_PUBLIC_APP_URL`'s
 * hostname (production: `linkcharts.com.br`). Falls back to the production
 * apex when the env var is missing or unparsable — mirrors the same
 * fallback used by `src/features/bio/utils/publicBioUrl.ts` for the same
 * variable.
 */
function resolveRootDomain(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL || "https://linkcharts.com.br";
  try {
    return new URL(raw).hostname;
  } catch {
    return "linkcharts.com.br";
  }
}

/**
 * Extracts a bio-page subdomain label from a request's hostname, or `null`
 * when the host isn't one.
 *
 * Two root domains are accepted: {@link resolveRootDomain} (production:
 * `linkcharts.com.br`) and, unconditionally, `localhost` — so
 * `{sub}.localhost` works in dev even on a checkout where
 * `NEXT_PUBLIC_APP_URL` isn't pointed at localhost for some reason. (In the
 * common case `NEXT_PUBLIC_APP_URL=http://localhost:3000`, both candidates
 * are the same value and this is a no-op duplicate.) The `www` label is
 * excluded — it is not a creator's bio subdomain — and the remaining label
 * must satisfy {@link BIO_SUBDOMAIN_PATTERN}.
 *
 * @param hostname - the request's hostname, already port-stripped (see
 *   {@link getRequestHostname}).
 */
function extractBioSubdomain(hostname: string): string | null {
  const host = hostname.toLowerCase();
  const roots = new Set([resolveRootDomain(), "localhost"]);

  for (const root of roots) {
    if (!root || host === root || !host.endsWith(`.${root}`)) continue;
    const label = host.slice(0, -(root.length + 1));
    if (label !== "www" && BIO_SUBDOMAIN_PATTERN.test(label)) {
      return label;
    }
  }
  return null;
}

/**
 * Reads the request's hostname (no port) straight from the `Host` header,
 * rather than `request.nextUrl.hostname`. In this project's dockerized dev
 * server (bound to `0.0.0.0` so it's reachable from the host machine),
 * `nextUrl.hostname` resolves to the bind address `0.0.0.0` instead of the
 * `Host` header the browser actually sent — reading the header directly
 * sidesteps that and is also what a reverse proxy in front of production
 * would forward faithfully either way.
 */
function getRequestHostname(request: NextRequest): string {
  const hostHeader = request.headers.get("host") ?? "";
  return hostHeader.split(":")[0] ?? "";
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
 * applied to every non-redirect response so they reach all app pages. Host
 * detection for subdomain-hosted bio pages runs first, ahead of every
 * path-based rule below, because it keys off the request's Host header
 * rather than its pathname.
 *
 * On /auth/login, stale __txn_* cookies from abandoned flows are deleted
 * before a new one is issued. Without this cleanup they accumulate and grow
 * the Cookie header past Nginx's large_client_header_buffers limit (~8 KB),
 * causing the callback request to be dropped (HTTP 000 / 502) or the Cookie
 * header to be truncated, which results in "The state parameter is invalid."
 */
export async function middleware(request: NextRequest) {
  const response = await auth0.middleware(request);

  // The user's own subdomain IS their bio page: a visitor opening
  // `{sub}.linkcharts.com.br` (dev: `{sub}.localhost:3000`) should see the
  // bio page rendered AT that host, address bar intact — never a redirect
  // to `/@{sub}` on the main domain. Only the bare root path qualifies: any
  // other path on a subdomain host is left untouched (in production Nginx
  // doesn't even route it here; in dev the app resolves it normally).
  if (request.nextUrl.pathname === "/") {
    const subdomain = extractBioSubdomain(getRequestHostname(request));
    if (subdomain) {
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname = `/s/${subdomain}`;
      const rewritten = NextResponse.rewrite(rewriteUrl);
      response.cookies.getAll().forEach((cookie) => {
        rewritten.cookies.set(cookie);
      });
      Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
        rewritten.headers.set(key, value);
      });
      return rewritten;
    }
  }

  // Public bio pages are shared as `/@{handle}` (the pretty URL creators put
  // on Instagram/WhatsApp) but rendered by the real route `/b/{handle}` — `@`
  // can't be a literal route segment in the App Router. Rewrite here so the
  // address bar keeps showing `/@{handle}` while Next.js serves `/b/{handle}`
  // internally. Cookies set upstream by `auth0.middleware` (session refresh)
  // and the security headers below are carried over onto the rewritten
  // response so nothing about auth/session handling changes for this route.
  const bioMatch = BIO_PRETTY_URL_PATTERN.exec(request.nextUrl.pathname);
  if (bioMatch) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/b/${bioMatch[1]}`;
    const rewritten = NextResponse.rewrite(rewriteUrl);
    response.cookies.getAll().forEach((cookie) => {
      rewritten.cookies.set(cookie);
    });
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
      rewritten.headers.set(key, value);
    });
    return rewritten;
  }

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
    // Match all routes except static files and public assets used in OG
    // metadata. This already covers both `/` (subdomain host rewrite) and
    // `/@{handle}` (pretty URL rewrite) — the negative lookahead only
    // excludes the four static paths above, so nothing extra is needed for
    // either rewrite to see its requests. No host-based filtering here:
    // Next.js matchers only test the pathname, and `extractBioSubdomain`
    // itself decides whether a given request's Host qualifies.
    "/((?!_next/static|_next/image|favicon\\.ico|og-default\\.png).*)",
  ],
};
