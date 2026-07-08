import { defineConfig, devices } from "@playwright/test";

/**
 * Smoke-test configuration. Tests run against an ALREADY-RUNNING dev server
 * (Docker on :3000 by default) — never boot next dev/build from the host,
 * the shared .next cache corrupts the container (see project CLAUDE.md).
 */
export default defineConfig({
  testDir: "./e2e",
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
    },
    {
      name: "mobile",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 375, height: 812 },
        isMobile: true,
        hasTouch: true,
      },
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
    },
  ],
});
