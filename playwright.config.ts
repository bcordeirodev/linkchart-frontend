import { defineConfig, devices } from "@playwright/test";

/**
 * Smoke-test configuration. Tests run against an ALREADY-RUNNING dev server
 * (Docker on :3000 by default) — never boot next dev/build from the host,
 * the shared .next cache corrupts the container (see project CLAUDE.md).
 */
export default defineConfig({
  testDir: "./e2e",
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
  ],
});
