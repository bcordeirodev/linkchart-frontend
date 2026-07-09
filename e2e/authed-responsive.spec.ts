import { test, expect } from "@playwright/test";

/**
 * Authenticated regression net. Mirrors the public `mobile-responsive` net but
 * for protected `(app)` routes, reachable only via the forged session storage
 * state (see `auth.setup.ts`). Runs on the `authed-*` projects — two phone
 * widths (the ad audience is mostly mobile) plus one desktop width, so the
 * mobile-first work is guarded against desktop regressions too.
 */

/** Routes with no per-link dependency — always exercised. */
const STATIC_ROUTES = ["/links", "/links/create", "/profile"];

/**
 * Per-link routes, appended only when the test user owns a link. The id is
 * resolved once in `global-setup.ts` and read from the env so the generated
 * route list is identical in the main process and every worker.
 */
function perLinkRoutes(): string[] {
  const linkId = process.env.E2E_LINK_ID;
  if (!linkId) return [];
  return [
    `/links/analytics/${linkId}`,
    `/links/edit/${linkId}`,
    `/links/qr/${linkId}`,
  ];
}

for (const route of [...STATIC_ROUTES, ...perLinkRoutes()]) {
  test(`no horizontal overflow (authed): ${route}`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.ok()).toBeTruthy();
    // A protected route that fell through to /sign-in means the session cookie
    // was rejected — fail loudly instead of "passing" on the sign-in layout.
    expect(new URL(page.url()).pathname, "redirected to sign-in").not.toBe(
      "/sign-in",
    );
    await page.waitForLoadState("load");

    const overflow = await page.evaluate(() => {
      const el = document.documentElement;
      return el.scrollWidth - el.clientWidth;
    });
    expect(
      overflow,
      `document overflows horizontally by ${overflow}px`,
    ).toBeLessThanOrEqual(1);
  });
}
