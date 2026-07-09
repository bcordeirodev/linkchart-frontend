import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import { test as setup, expect } from "@playwright/test";

import {
  AUTH_STATE,
  mintSessionCookie,
  readEnvValue,
} from "./helpers/auth-cookies";

/**
 * Authenticates the net by forging both gate cookies and persisting them as a
 * Playwright storage state. Skips (rather than fails) when the dev secret or
 * test creds are absent, so the public projects still run on a bare checkout.
 *
 * @see ./helpers/auth-cookies.ts for why forging is the right call here.
 */
setup("authenticate", async ({ request, baseURL }) => {
  const secret = readEnvValue("AUTH0_SECRET");
  const email = readEnvValue("E2E_USER_EMAIL");
  const password = readEnvValue("E2E_USER_PASSWORD");

  if (!secret || !email || !password) {
    setup.skip(
      true,
      "authed net needs AUTH0_SECRET (.env.local) + E2E creds (.env.e2e.local)",
    );
    return;
  }

  // Real backend JWT via API login → satisfies the client-side session check
  // and authorizes data calls behind the protected routes.
  const login = await request.post("/api/auth/login", {
    data: { email, password },
  });
  expect(
    login.ok(),
    `login failed (${login.status()}) — is the test user seeded?`,
  ).toBeTruthy();
  const token = (await login.json())?.data?.token as string | undefined;
  expect(token, "login response missing token").toBeTruthy();

  const host = new URL(baseURL ?? "http://localhost:3000").hostname;
  const cookie = (name: string, value: string) => ({
    name,
    value,
    domain: host,
    path: "/",
    httpOnly: false,
    secure: false,
    sameSite: "Lax" as const,
    expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  });

  const state = {
    cookies: [
      cookie("__session", mintSessionCookie(secret)),
      cookie("auth_token", token!),
    ],
    origins: [],
  };

  mkdirSync(dirname(AUTH_STATE), { recursive: true });
  writeFileSync(AUTH_STATE, JSON.stringify(state, null, 2));
});
