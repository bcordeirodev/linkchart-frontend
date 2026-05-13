import { type NextRequest, NextResponse } from "next/server";

/**
 * Returns true for safe same-origin paths: starts with `/`, no `//` (protocol-relative),
 * no `:` (prevents `javascript:` and similar schemes).
 */
function isSafePath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//") && !path.includes(":");
}

/**
 * GET /api/auth/sign-out
 *
 * Clears the Auth0 session cookie (including chunked variants) and any
 * lingering transaction cookies, then redirects to `?to=<path>` (default `/`).
 *
 * This avoids the Auth0 OIDC logout endpoint (which requires
 * `post_logout_redirect_uri` to be in the "Allowed Logout URLs" allowlist).
 * The App Router auth guard picks up the missing session on the next render
 * and treats the user as a guest.
 *
 * The @auth0/nextjs-auth0 v4 SDK may split the session across chunked cookies
 * when the payload exceeds 3500 bytes (e.g. `__session__0`, `__session__1`).
 * The legacy v3 format used `appSession` (and `appSession__0`, etc.).
 * All variants are cleared here to avoid the SDK reconstructing a stale session
 * from leftover chunks and silently re-authenticating the user after logout.
 */
export async function GET(request: NextRequest) {
  // Use the configured app base URL so the redirect always lands on the
  // correct host, even if the user somehow ended up on 0.0.0.0.
  const base =
    process.env.APP_BASE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? request.url;

  const toParam = request.nextUrl.searchParams.get("to");
  const destination = toParam && isSafePath(toParam) ? toParam : "/";
  const home = new URL(destination, base);
  const response = NextResponse.redirect(home);

  const cookieHeader = request.headers.get("cookie") ?? "";
  const allCookieNames = cookieHeader
    .split(";")
    .map((c) => c.trim().split("=")[0].trim())
    .filter(Boolean);

  // Delete __session, __session__0, __session__1 … (v4 SDK chunks)
  // and appSession, appSession__0 … (legacy v3 cookies).
  const sessionPattern = /^(__session|appSession)(__\d+)?$/;
  for (const name of allCookieNames) {
    if (sessionPattern.test(name)) {
      response.cookies.set(name, "", { maxAge: 0, path: "/" });
    }
  }

  // Delete any lingering Auth0 transaction cookies (__txn_*).
  // These accumulate when login flows are abandoned mid-way and are the
  // main cause of "Request Header Or Cookie Too Large" 400 errors from Nginx.
  for (const name of allCookieNames) {
    if (name.startsWith("__txn_")) {
      response.cookies.set(name, "", { maxAge: 0, path: "/" });
    }
  }

  return response;
}
