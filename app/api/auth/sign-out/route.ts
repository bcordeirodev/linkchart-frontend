import { type NextRequest, NextResponse } from "next/server";

/**
 * GET /api/auth/sign-out
 *
 * Clears the Auth0 session cookie and any lingering transaction cookies,
 * then redirects to the home page.
 *
 * This avoids the Auth0 OIDC logout endpoint (which requires
 * `post_logout_redirect_uri` to be in the "Allowed Logout URLs" allowlist).
 * The App Router auth guard picks up the missing session on the next render
 * and treats the user as a guest.
 */
export async function GET(request: NextRequest) {
  const home = new URL("/", request.url);
  const response = NextResponse.redirect(home);

  // Delete the Auth0 encrypted session cookie.
  response.cookies.set("__session", "", {
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  // Delete any lingering Auth0 transaction cookies (__txn_*).
  // These accumulate when login flows are abandoned mid-way and are the
  // main cause of "Request Header Or Cookie Too Large" 400 errors from Nginx.
  const cookieHeader = request.headers.get("cookie") ?? "";
  const txnNames = cookieHeader
    .split(";")
    .map((c) => c.trim().split("=")[0])
    .filter((name) => name.startsWith("__txn_"));

  for (const name of txnNames) {
    response.cookies.set(name, "", { maxAge: 0, path: "/" });
  }

  return response;
}
