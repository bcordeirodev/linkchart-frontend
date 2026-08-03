import { expect, test } from "@playwright/test";

/**
 * `/sign-in` was unified (2026-07-14, `ed4a9ee3`) into a single door: on load
 * it shows only the "Continuar com Google" and "Continuar com e-mail" CTAs —
 * no credentials form in the app's own DOM. "Continuar com e-mail" is a real
 * link to `/auth/login?returnTo=/sign-in`, which the `@auth0/nextjs-auth0`
 * middleware turns into a redirect to Auth0's hosted Universal Login
 * (`{AUTH0_DOMAIN}/u/login`) — that external page is where the actual
 * email/password form and its validation errors live.
 */
test.describe("Authentication", () => {
  test("login page renders the unified door and reveals the auth form", async ({
    page,
  }) => {
    await page.goto("/sign-in");

    // Unified door: Google CTA + email CTA, no credentials form yet.
    await expect(
      page.getByRole("heading", { name: "Entre ou crie sua conta" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Continuar com Google" }),
    ).toBeVisible();
    const emailDoor = page.getByRole("link", { name: "Continuar com e-mail" });
    await expect(emailDoor).toBeVisible();
    await expect(page.locator('input[type="password"]')).toHaveCount(0);

    // Crossing the door hands off to Auth0's Universal Login, which owns
    // the actual credentials form.
    await emailDoor.click();
    await expect(page).toHaveURL(/\.auth0\.com\/u\/login/);
    await expect(page.getByLabel(/email/i)).toBeVisible();
    // `getByLabel(/password/i)` also matches the "Show password" toggle
    // button on Auth0's Universal Login, so target the textbox role.
    await expect(page.getByRole("textbox", { name: "Password" })).toBeVisible();
  });

  test("shows error for invalid credentials", async ({ page }) => {
    await page.goto("/sign-in");

    await page.getByRole("link", { name: "Continuar com e-mail" }).click();
    await expect(page).toHaveURL(/\.auth0\.com\/u\/login/);

    await page.getByLabel(/email/i).fill("invalid@test.com");
    await page.getByRole("textbox", { name: "Password" }).fill("wrongpassword");
    await page.getByRole("button", { name: "Continue", exact: true }).click();

    // Auth0's Universal Login re-renders the same form with an inline error.
    await expect(page.getByText(/wrong email or password/i)).toBeVisible({
      timeout: 8000,
    });
  });
});
