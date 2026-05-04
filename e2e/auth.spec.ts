import { expect, test } from "@playwright/test";

test.describe("Authentication", () => {
  test("login page renders and shows form", async ({ page }) => {
    await page.goto("/sign-in");

    await expect(page.locator("form")).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("shows error for invalid credentials", async ({ page }) => {
    await page.goto("/sign-in");

    await page.locator('input[type="email"]').fill("invalid@test.com");
    await page.locator('input[type="password"]').fill("wrongpassword");
    await page.locator('button[type="submit"]').click();

    // Wait for error feedback (alert, text, or aria-invalid state)
    await expect(
      page
        .locator('[role="alert"], [aria-live="polite"]')
        .or(page.locator('input[aria-invalid="true"]')),
    ).toBeVisible({ timeout: 8000 });
  });
});
