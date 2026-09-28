import { expect, test } from "@playwright/test";

test("home page responds with a valid document", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBe(true);
  await expect(page.locator("html")).toHaveAttribute("lang", /.+/);
  await expect(page.locator("main")).toBeAttached();
});
