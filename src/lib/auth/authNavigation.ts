"use client";

/**
 * Navigation helpers for the Auth0 SDK route handlers (`/auth/login`, ...).
 *
 * These endpoints are ROUTE HANDLERS, not pages: they answer with a 302 to the
 * Auth0 Universal Login. Navigating to them through the App Router
 * (`router.push`) makes Next first fetch the URL as an RSC payload and then
 * fall back to a full navigation — two `GET /auth/login` per click (the
 * duplicated pairs seen in the jul/2026 access-log analysis), each one minting
 * an Auth0 transaction and burning dev-tenant rate limit for nothing. A full
 * document navigation is the correct transport for these URLs.
 */

/** Route-handler prefix owned by the Auth0 SDK middleware. */
const AUTH0_ROUTE_PREFIX = "/auth/";

/**
 * Tells whether an href points at an Auth0 SDK route handler (vs. a real
 * app page that should keep client-side navigation).
 *
 * @param href - The target href.
 * @returns True for `/auth/*` handler URLs.
 */
export function isAuth0HandlerRoute(href: string): boolean {
  return href.startsWith(AUTH0_ROUTE_PREFIX);
}

/**
 * Starts the Auth0 Universal Login with a full document navigation.
 *
 * Safe no-op on the server.
 *
 * @param screenHint - Pass `"signup"` to open the sign-up tab directly.
 */
export function redirectToAuth0Login(screenHint?: "signup"): void {
  if (typeof window === "undefined") return;

  window.location.assign(
    screenHint ? `/auth/login?screen_hint=${screenHint}` : "/auth/login",
  );
}
