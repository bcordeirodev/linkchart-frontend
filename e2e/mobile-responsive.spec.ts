import { test, expect } from "@playwright/test";

/**
 * Mobile regression net (375px). Fails when a public route overflows
 * horizontally — the single most common "mobile is broken" symptom.
 * Routes needing auth or a real slug are covered later by sub-projects.
 */

const PUBLIC_ROUTES = [
  "/",
  "/shorter",
  "/sign-in",
  "/privacy",
  "/terms",
  "/support",
];

for (const route of PUBLIC_ROUTES) {
  test(`no horizontal overflow at 375px: ${route}`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.ok()).toBeTruthy();
    // Wait for the load event (not networkidle — GA/AdSense hold connections
    // open and would flake the test) so layout has settled before measuring.
    await page.waitForLoadState("load");

    // Allow a 1px rounding tolerance; anything wider is a real overflow.
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
