import { Auth0Client } from "@auth0/nextjs-auth0/server";

/**
 * Singleton Auth0 server-side client.
 *
 * Reads AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_SECRET,
 * and APP_BASE_URL from environment variables. Used by middleware.ts to
 * handle /auth/* routes and by server components to read the session.
 */
export const auth0 = new Auth0Client();
