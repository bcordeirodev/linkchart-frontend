import { defineConfig, devices } from "@playwright/test";

import { AUTH_STATE } from "./e2e/helpers/auth-cookies";

/**
 * Smoke-test configuration. Tests run against an ALREADY-RUNNING dev server
 * (Docker on :3000 by default) — never boot next dev/build from the host,
 * the shared .next cache corrupts the container (see project CLAUDE.md).
 *
 * Projects split into two nets:
 * - public (`chromium`/`mobile`/`mobile-small`): smoke + public overflow net.
 * - authenticated (`setup` → `authed-*`): protected-route overflow net that
 *   loads a forged session storage state (see `e2e/auth.setup.ts`). The setup
 *   self-skips when the dev secret/creds are absent, so a bare checkout still
 *   runs the public net.
 */

/** Regex of specs that belong to the authenticated net (excluded elsewhere). */
const AUTHED_SPECS = /auth\.setup\.ts|authed-responsive\.spec\.ts/;

/** Phone/desktop viewports the authenticated net sweeps. */
const AUTHED_VIEWPORTS = [
  { name: "authed-mobile", viewport: { width: 375, height: 812 }, phone: true },
  {
    name: "authed-mobile-small",
    viewport: { width: 320, height: 568 },
    phone: true,
  },
  {
    name: "authed-desktop",
    viewport: { width: 1280, height: 900 },
    phone: false,
  },
] as const;

export default defineConfig({
  testDir: "./e2e",
  // Resolves E2E_LINK_ID once before discovery so per-link route generation is
  // identical across the main process and every worker.
  globalSetup: "./e2e/global-setup.ts",
  // auth.spec.ts targets the old local login form (sign-in now delegates to
  // Auth0) and fails permanently — quarantined until rewritten or deleted.
  testIgnore: ["**/auth.spec.ts"],
  timeout: 30_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: AUTHED_SPECS,
    },
    {
      name: "mobile",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 375, height: 812 },
        isMobile: true,
        hasTouch: true,
      },
      testIgnore: AUTHED_SPECS,
    },
    {
      // Narrowest common phone (iPhone SE / small Android). If the layout
      // survives 320px it survives everything above it.
      name: "mobile-small",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 320, height: 568 },
        isMobile: true,
        hasTouch: true,
      },
      testIgnore: AUTHED_SPECS,
    },
    {
      // Mints the forged session storage state consumed by the authed-* nets.
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    ...AUTHED_VIEWPORTS.map(({ name, viewport, phone }) => ({
      name,
      testMatch: /authed-responsive\.spec\.ts/,
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        viewport,
        isMobile: phone,
        hasTouch: phone,
        storageState: AUTH_STATE,
      },
    })),
  ],
});
