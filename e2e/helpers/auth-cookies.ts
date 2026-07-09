import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Helpers for the authenticated Playwright net.
 *
 * Protected `(app)` routes are gated twice: a server-side middleware
 * (`middleware.ts`) that rejects any request without a valid encrypted Auth0
 * `__session` cookie, and a client-side `AuthContext` that validates the
 * backend session via the `auth_token` cookie. To exercise these routes
 * headlessly — without driving Auth0 Universal Login, which we neither can nor
 * should automate — the setup forges both cookies with dev-only secrets:
 *
 * - `__session`: minted with the SAME `hkdf`/`jose` encryption the Auth0 SDK
 *   uses server-side, keyed by the dev `AUTH0_SECRET`. It decrypts cleanly in
 *   `auth0.getSession()`, so the middleware gate opens and `/auth/profile`
 *   returns the forged user (satisfying `useUser()`).
 * - `auth_token`: a real backend JWT obtained by logging in through the API,
 *   so cookie-authenticated calls (`/api/me`, `/api/links`, …) return data.
 *
 * This only works locally, where the dev `AUTH0_SECRET` and a seeded test user
 * exist. It is a regression tool, not a production auth path.
 */

/**
 * Storage-state file the authenticated projects load. Gitignored — it holds
 * live (dev) session cookies and is re-minted on every run.
 */
export const AUTH_STATE = "e2e/.auth/state.json";

/** The forged Auth0 session user. `sub`/`email` are arbitrary dev values. */
const SESSION_USER = {
  sub: "auth0|e2e-net",
  email: "mobileqa@test.local",
  name: "E2E Net",
  email_verified: true,
  picture: "",
} as const;

/**
 * Reads a KEY from `process.env`, falling back to a dotenv-style file in the
 * project root. Used so the net finds `AUTH0_SECRET` (dev, in `.env.local`) and
 * the test creds (`.env.e2e.local`) without requiring them to be exported.
 *
 * @param key - Environment variable name to resolve.
 * @param files - Candidate dotenv files (relative to cwd), checked in order.
 * @returns The resolved value, or `undefined` if absent everywhere.
 */
export function readEnvValue(
  key: string,
  files: string[] = [".env.e2e.local", ".env.local"],
): string | undefined {
  if (process.env[key]) return process.env[key];
  for (const file of files) {
    const path = join(process.cwd(), file);
    if (!existsSync(path)) continue;
    const line = readFileSync(path, "utf8")
      .split("\n")
      .find((l) => l.startsWith(`${key}=`));
    if (line) return line.slice(key.length + 1).trim();
  }
  return undefined;
}

/**
 * Mints an encrypted Auth0 `__session` cookie value for the forged test user.
 *
 * Imports the SDK's own `encrypt()` by absolute path (its `dist/server`
 * subpath is not exported, so a bare specifier is blocked) and runs it in a
 * throwaway Node process — keeping the SDK's `hkdf` key derivation and JWE
 * format authoritative instead of reimplementing them here.
 *
 * @param secret - The dev `AUTH0_SECRET` the SDK is configured with.
 * @returns The compact JWE string to store as the `__session` cookie.
 */
export function mintSessionCookie(secret: string): string {
  const cookiesModule = join(
    process.cwd(),
    "node_modules/@auth0/nextjs-auth0/dist/server/cookies.js",
  );
  const script = `
    import { encrypt } from ${JSON.stringify(`file://${cookiesModule}`)};
    const now = Math.floor(Date.now() / 1000);
    const exp = now + 60 * 60 * 24;
    const session = {
      user: ${JSON.stringify(SESSION_USER)},
      tokenSet: { accessToken: "forged", scope: "openid profile email", expiresAt: exp },
      internal: { sid: "e2e-net-sid", createdAt: now },
    };
    process.stdout.write(await encrypt(session, process.env.__E2E_SECRET, exp));
  `;
  return execFileSync("node", ["--input-type=module", "-e", script], {
    env: { ...process.env, __E2E_SECRET: secret },
    encoding: "utf8",
  });
}

/**
 * Resolves the id of a link owned by the test user, synchronously, so the
 * authed spec can add the per-link routes (`/links/analytics/[id]`, …) at
 * collection time. Playwright collects tests before the `setup` project runs,
 * so an async/fixture-file handshake would miss on a clean run — a blocking
 * API login here keeps route generation deterministic. Returns `null` (per-link
 * routes skipped) when creds are missing or the user owns no links.
 *
 * @param baseUrl - Dev server origin to log in against.
 * @returns The first link id as a string, or `null`.
 */
export function resolveSeededLinkId(
  baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
): string | null {
  const email = readEnvValue("E2E_USER_EMAIL");
  const password = readEnvValue("E2E_USER_PASSWORD");
  if (!email || !password) return null;
  const script = `
    const base = process.env.__E2E_BASE;
    const login = await fetch(base + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: process.env.__E2E_EMAIL, password: process.env.__E2E_PASS }),
    }).then((r) => r.json());
    const token = login?.data?.token;
    if (!token) { process.stdout.write(""); process.exit(0); }
    const links = await fetch(base + "/api/links", {
      headers: { Authorization: "Bearer " + token },
    }).then((r) => r.json());
    const first = (links?.data ?? links)?.[0];
    process.stdout.write(first?.id != null ? String(first.id) : "");
  `;
  try {
    const out = execFileSync("node", ["--input-type=module", "-e", script], {
      env: {
        ...process.env,
        __E2E_BASE: baseUrl,
        __E2E_EMAIL: email,
        __E2E_PASS: password,
      },
      encoding: "utf8",
      timeout: 15_000,
    }).trim();
    return out || null;
  } catch {
    return null;
  }
}
