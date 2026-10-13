import { expect, test, type Page } from "@playwright/test";
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
    await page.goto("/cokolwiek");
    await expect(page).toHaveURL(/\/en\/cokolwiek$/);
  });

  test("returns a localized 404 for unknown paths", async ({ page }) => {
    const response = await page.goto("/pl/cokolwiek");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(pl.common.notFound.title);
  });

  test("has no project detail pages — projects live on the home page", async ({ page }) => {
    const response = await page.goto("/en/projects/nexus");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(en.common.notFound.title);
  });
});

test.describe("language switcher in the header", () => {
  test.skip(({ isMobile }) => isMobile, "Header switcher is visible on desktop only");

  const headerSwitcher = (page: Page, label: string) =>
    page.getByRole("banner").getByRole("navigation", { name: label, exact: true });

  test("switches language", async ({ page }) => {
    await page.goto("/en");
    await headerSwitcher(page, en.navigation.languageSwitcher.label)
      .getByRole("link", { name: en.navigation.languages.pl })
      .click();

    await expect(page).toHaveURL(/\/pl$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "pl");
    await expect(
      headerSwitcher(page, pl.navigation.languageSwitcher.label).getByRole("link", {
        name: pl.navigation.languages.pl,
      }),
    ).toHaveAttribute("aria-current", "true");
  });

  test("works with the keyboard", async ({ page }) => {
    await page.goto("/pl");
    await headerSwitcher(page, pl.navigation.languageSwitcher.label)
      .getByRole("link", { name: pl.navigation.languages.en })
      .focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/en$/);
  });

  test("does not shift the layout", async ({ page }) => {
    await page.goto("/en");
    const before = await headerSwitcher(page, en.navigation.languageSwitcher.label).boundingBox();

    await headerSwitcher(page, en.navigation.languageSwitcher.label)
      .getByRole("link", { name: en.navigation.languages.pl })
      .click();
    await expect(page).toHaveURL(/\/pl$/);
    const after = await headerSwitcher(page, pl.navigation.languageSwitcher.label).boundingBox();

    expect(after).toEqual(before);
  });
});

test("footer switcher changes language on every device", async ({ page }) => {
  await page.goto("/en");
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: en.navigation.languages.pl })
    .click();

  await expect(page).toHaveURL(/\/pl$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "pl");
});

test.describe("SEO", () => {
  test("home page exposes canonical, hreflang alternates and localized OpenGraph", async ({
    page,
  }) => {
    await page.goto("/pl");

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/pl$/);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      "href",
      /\/en$/,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      "href",
      /\/en$/,
    );
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "pl_PL");
  });
});