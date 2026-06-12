import { test, expect } from "@playwright/test";

/**
 * Render-level smoke tests for the public surface. Selectors are role-based
 * and language-agnostic (the UI is i18n'd in en + pt-BR), so assertions avoid
 * hardcoded copy.
 */

test("health endpoint responds ok", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
});

test("home page renders without errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  const response = await page.goto("/");
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator("body")).toBeVisible();
  expect(errors).toEqual([]);
});

test("public shortener page renders the URL form", async ({ page }) => {
  await page.goto("/shorter");
  // MUI renders a named input for the URL field — use the name attribute for stability
  await expect(page.locator('input[name="originalUrl"]')).toBeVisible();
  await expect(page.getByRole("button").first()).toBeVisible();
});

test("sign-in page renders", async ({ page }) => {
  const response = await page.goto("/sign-in");
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator("body")).toBeVisible();
});
