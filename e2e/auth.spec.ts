import { expect, test } from "@playwright/test";

/**
 * `/sign-in` was unified (2026-07-14, `ed4a9ee3`) into a single door: on load
 * it shows only the "Continuar com Google" and "Continuar com e-mail" CTAs —
 * no credentials form in the app's own DOM. "Continuar com e-mail" is a real
 * link to `/auth/login?returnTo=/sign-in`, which the `@auth0/nextjs-auth0`
 * middleware turns into a redirect to Auth0's hosted Universal Login
 * (`{AUTH0_DOMAIN}/u/login`) — that external, Auth0-owned page is where the
 * actual email/password form and its validation errors live.
 *
 * This app's responsibility ends at the redirect, so these specs stop at the
 * boundary: they never fill credentials on, or assert copy from, Auth0's
 * hosted UI. Driving that external page (fill + submit + wait for its error
 * text) was tried and flaked under parallel load in the full e2e suite — the
 * dependency itself was the bug, not the wait strategy.
 */
test.describe("Authentication", () => {
  test("login page renders the unified door", async ({ page }) => {
    await page.goto("/sign-in");

    // Unified door: Google CTA + email CTA, no credentials form yet. Fully
    // same-origin — no navigation, no dependency on Auth0.
    await expect(
      page.getByRole("heading", { name: "Entre ou crie sua conta" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Continuar com Google" }),
    ).toBeVisible();
    const emailDoor = page.getByRole("link", { name: "Continuar com e-mail" });
    await expect(emailDoor).toBeVisible();
    await expect(emailDoor).toHaveAttribute(
      "href",
      /^\/auth\/login\?returnTo=/,
    );
    await expect(page.locator('input[type="password"]')).toHaveCount(0);
  });

  test("email door hands off to the identity provider", async ({ page }) => {
    await page.goto("/sign-in");

    // Boundary test only: crossing the door must land on Auth0's hosted
    // Universal Login origin. Deliberately does NOT fill credentials or wait
    // on anything Auth0 renders beyond the URL — that UI belongs to Auth0.
    await page.getByRole("link", { name: "Continuar com e-mail" }).click();
    await expect(page).toHaveURL(/\.auth0\.com\/u\/login/);
  });
});
