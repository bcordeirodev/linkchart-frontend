import { Auth0Client } from "@auth0/nextjs-auth0/server";

/**
 * Singleton Auth0 server-side client.
 *
 * Reads AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_SECRET,
 * and APP_BASE_URL from environment variables. Used by middleware.ts to
 * handle /auth/* routes and by server components to read the session.
 *
 * `appBaseUrl` uses APP_BASE_URL (server-only, Edge-safe) with
 * NEXT_PUBLIC_APP_URL as the fallback. NEXT_PUBLIC_ variables are inlined
 * at build time and work in all runtimes including the Edge Runtime where
 * the middleware executes — preventing the SDK from inferring the base URL
 * from the request Host header, which can be `0.0.0.0` when Next.js dev
 * server binds on all interfaces.
 *
 * `authorizationParameters.scope` is set explicitly. Without it the SDK
 * relies on the Auth0 tenant default, which may omit the `email` scope from
 * the access token for social connections (Facebook, Google). Auth0's
 * `/userinfo` endpoint only returns claims that correspond to the scopes
 * present in the access token, so a missing `email` scope means the backend
 * exchange gets no email even though Auth0 received it from Facebook.
 *
 * `beforeSessionSaved` strips the raw ID token from the encrypted session
 * cookie. User claims are already extracted into `session.user` by the SDK,
 * so discarding the raw JWT shrinks __session from ~3.5 KB to ~1 KB — well
 * under Nginx's proxy_buffer_size limit that was causing 502s on callback.
 */
export const auth0 = new Auth0Client({
  appBaseUrl: process.env.APP_BASE_URL ?? process.env.NEXT_PUBLIC_APP_URL,
  authorizationParameters: {
    scope: "openid profile email",
  },
  // Return 204 (not 401) from /auth/profile when no session exists,
  // so useUser() sees null instead of throwing "Unauthorized".
  noContentProfileResponseWhenUnauthenticated: true,
  async beforeSessionSaved(session) {
    const { idToken: _idToken, ...tokenSet } = session.tokenSet;
    return { ...session, tokenSet };
  },
});
