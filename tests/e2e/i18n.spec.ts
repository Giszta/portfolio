import { expect, test } from "@playwright/test";
import en from "../../messages/en.json";
import pl from "../../messages/pl.json";

test.describe("locale detection on /", () => {
  test.describe("Polish browser", () => {
    test.use({ locale: "pl-PL" });

    test("redirects to /pl", async ({ page }) => {
      await page.goto("/");
      await expect(page).toHaveURL(/\/pl$/);
      await expect(page.locator("html")).toHaveAttribute("lang", "pl");
    });
  });

  test.describe("English browser", () => {
    test.use({ locale: "en-US" });

    test("redirects to /en", async ({ page }) => {
      await page.goto("/");
      await expect(page).toHaveURL(/\/en$/);
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
    });
  });

  test.describe("unsupported language", () => {
    test.use({ locale: "de-DE" });

    test("falls back to the default locale", async ({ page }) => {
      await page.goto("/");
      await expect(page).toHaveURL(/\/en$/);
    });
  });
});

test.describe("routing", () => {
  test("adds the locale prefix to paths without one", async ({ page }) => {
    await page.goto("/projects/nexus");
    await expect(page).toHaveURL(/\/en\/projects\/nexus$/);
  });

  test("serves the project page in Polish", async ({ page }) => {
    await page.goto("/pl/projects/forge");
    await expect(page.locator("html")).toHaveAttribute("lang", "pl");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(pl.caseStudies.forge.title);
    await expect(page.getByText(pl.caseStudies.forge.subtitle)).toBeVisible();
  });

  test("returns a localized 404 for unknown paths", async ({ page }) => {
    const response = await page.goto("/pl/cokolwiek");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(pl.common.notFound.title);
  });

  test("returns a localized 404 for unknown projects", async ({ page }) => {
    const response = await page.goto("/en/projects/unknown");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(en.common.notFound.title);
  });
});

test.describe("language switcher", () => {
  test("switches language and keeps the project slug", async ({ page }) => {
    await page.goto("/en/projects/forge");
    await page.getByRole("link", { name: "Polski" }).click();

    await expect(page).toHaveURL(/\/pl\/projects\/forge$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "pl");
    await expect(page.getByRole("link", { name: "Polski" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  test("works with the keyboard", async ({ page }) => {
    await page.goto("/pl");
    await page.getByRole("link", { name: "English" }).focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/en$/);
  });

  test("does not shift the layout", async ({ page }) => {
    await page.goto("/en/projects/forge");
    const before = await page.getByRole("navigation", { name: "Language" }).boundingBox();

    await page.getByRole("link", { name: "Polski" }).click();
    await expect(page).toHaveURL(/\/pl\/projects\/forge$/);
    const after = await page.getByRole("navigation", { name: "Język" }).boundingBox();

    expect(after).toEqual(before);
  });
});

test.describe("SEO", () => {
  test("exposes hreflang alternates and localized OpenGraph", async ({ page }) => {
    await page.goto("/pl/projects/forge");

    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      "href",
      /\/en\/projects\/forge$/,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      "href",
      /\/en\/projects\/forge$/,
    );
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "pl_PL");
    await expect(page).toHaveTitle(/^FORGE · /);
  });
});
