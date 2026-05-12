import { Auth0Client } from "@auth0/nextjs-auth0/server";

/**
 * Singleton Auth0 server-side client.
 *
 * Reads AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_SECRET,
 * and APP_BASE_URL from environment variables. Used by middleware.ts to
 * handle /auth/* routes and by server components to read the session.
 */
export const auth0 = new Auth0Client({
  // Explicitly set the base URL so the post-login redirect always points to the
  // correct host even when the dev server binds on 0.0.0.0.
  appBaseUrl: process.env.APP_BASE_URL,
  // Return 204 (not 401) from /auth/profile when no session exists,
  // so useUser() sees null instead of throwing "Unauthorized".
  noContentProfileResponseWhenUnauthenticated: true,
});
