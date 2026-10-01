import { expect, test, type Page } from "@playwright/test";
import en from "../../messages/en.json";
import { NAV_SECTIONS } from "../../src/content/navigation";
import { siteConfig } from "../../src/content/site";

const mainNav = (page: Page) =>
  page.getByRole("navigation", { name: en.navigation.label, exact: true });

/** Fokus jest w elemencie strony POZA otwartym menu (body/brak fokusu się nie liczy). */
function focusEscapedMenu(page: Page) {
  return page.evaluate(() => {
    const active = document.activeElement;
    const dialog = document.querySelector("dialog");
    return active !== null && active !== document.body && !dialog?.contains(active);
  });
}

function focusIsInsideMenu(page: Page) {
  return page.evaluate(() =>
    Boolean(document.querySelector("dialog")?.contains(document.activeElement)),
  );
}

test.describe("app shell", () => {
  test("skip link is the first tab stop and jumps to the main content", async ({ page }) => {
    await page.goto("/en");
    await page.keyboard.press("Tab");

    const skipLink = page.getByRole("link", { name: en.common.skipToContent });
    await expect(skipLink).toBeFocused();
    const box = await skipLink.boundingBox();
    expect(box?.width).toBeGreaterThan(1); // sr-only → widoczny przy fokusie

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main-content$/);

    // Następny Tab startuje z treści, a nie wraca do nagłówka.
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: siteConfig.shortName })).not.toBeFocused();
  });

  test("keyboard focus is clearly visible", async ({ page }) => {
    await page.goto("/en");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    const wordmark = page.getByRole("link", { name: siteConfig.shortName });
    await expect(wordmark).toBeFocused();
    await expect(wordmark).not.toHaveCSS("outline-style", "none");
  });

  test("header stays on screen and gains its background after scrolling", async ({ page }) => {
    await page.goto("/en");
    const header = page.getByRole("banner");
    await expect(header).not.toHaveAttribute("data-scrolled");

    await page.evaluate(() => window.scrollTo(0, 800));
    await expect(header).toHaveAttribute("data-scrolled", "true");
    await expect(header).toBeInViewport();
  });

  test("not-found page keeps the header and the footer", async ({ page }) => {
    const response = await page.goto("/en/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  test("footer language switcher changes the language", async ({ page }) => {
    await page.goto("/en");
    const switcher = page.getByRole("navigation", { name: en.footer.languageLabel, exact: true });
    await switcher.getByRole("link", { name: en.navigation.languages.pl }).click();

    await expect(page).toHaveURL(/\/pl$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "pl");
  });

  test("smooth scrolling respects the reduced-motion preference", async ({ page }) => {
    await page.goto("/en");
    const html = page.locator("html");

    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(html).toHaveCSS("scroll-behavior", "smooth");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(html).toHaveCSS("scroll-behavior", "auto");
  });
});

test.describe("desktop navigation", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop layout only");

  test("shows inline navigation instead of the menu button", async ({ page }) => {
    await page.goto("/en");
    await expect(mainNav(page)).toBeVisible();
    await expect(page.getByRole("button", { name: en.common.openMenu })).toBeHidden();
  });

  test("tabs through the sections in page order", async ({ page }) => {
    await page.goto("/en");
    await page.keyboard.press("Tab"); // skip link
    await page.keyboard.press("Tab"); // wordmark

    for (const section of NAV_SECTIONS) {
      await page.keyboard.press("Tab");
      await expect(
        mainNav(page).getByRole("link", { name: en.navigation[section], exact: true }),
      ).toBeFocused();
    }
  });

  test("clicking a link scrolls to its section and marks it active", async ({ page }) => {
    await page.goto("/en");
    const link = mainNav(page).getByRole("link", { name: en.navigation.technology, exact: true });
    await link.click();

    await expect(page).toHaveURL(/#technology$/);
    await expect(page.locator("#technology")).toBeInViewport();
    await expect(link).toHaveAttribute("aria-current", "location");
  });

  test("the active indicator follows scrolling down to the last section", async ({ page }) => {
    await page.goto("/en");
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));

    const contact = mainNav(page).getByRole("link", { name: en.navigation.contact, exact: true });
    await expect(contact).toHaveAttribute("aria-current", "location");
    await expect(mainNav(page).locator('[aria-current="location"]')).toHaveCount(1);
  });
});

test.describe("mobile navigation", () => {
  test.skip(({ isMobile }) => !isMobile, "Mobile layout only");

  const menuButton = (page: Page) =>
    page.getByRole("button", { name: en.common.openMenu, includeHidden: true });
  const menu = (page: Page) => page.getByRole("dialog", { name: en.navigation.menu });

  test("opens a full-screen menu and moves focus into it", async ({ page }) => {
    await page.goto("/en");
    await expect(mainNav(page)).toBeHidden();

    await menuButton(page).click();
    await expect(menu(page)).toBeVisible();
    await expect(menuButton(page)).toHaveAttribute("aria-expanded", "true");
    expect(await focusIsInsideMenu(page)).toBe(true);

    const box = await menu(page).boundingBox();
    expect(box?.width).toBe(page.viewportSize()?.width);
  });

  test("keeps keyboard focus out of the page behind the menu", async ({ page }) => {
    await page.goto("/en");
    await menuButton(page).click();
    await expect(menu(page)).toBeVisible();

    for (let i = 0; i < 15; i++) {
      await page.keyboard.press("Tab");
      expect(await focusEscapedMenu(page)).toBe(false);
    }
  });

  test("closes with Escape and returns focus to the menu button", async ({ page }) => {
    await page.goto("/en");
    await menuButton(page).click();
    await expect(menu(page)).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(menu(page)).toBeHidden();
    await expect(menuButton(page)).toBeFocused();
    await expect(menuButton(page)).toHaveAttribute("aria-expanded", "false");
  });

  test("choosing a section closes the menu and scrolls to it", async ({ page }) => {
    await page.goto("/en");
    await menuButton(page).click();
    await menu(page).getByRole("link", { name: en.navigation.contact, exact: true }).click();

    await expect(menu(page)).toBeHidden();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator("#contact")).toBeInViewport();
  });

  test("locks page scrolling while the menu is open", async ({ page }) => {
    await page.goto("/en");
    const html = page.locator("html");

    await menuButton(page).click();
    await expect(html).toHaveCSS("overflow", "hidden");

    await page.keyboard.press("Escape");
    await expect(html).not.toHaveCSS("overflow", "hidden");
  });

  test("switches language from inside the menu", async ({ page }) => {
    await page.goto("/en");
    await menuButton(page).click();
    await menu(page).getByRole("link", { name: en.navigation.languages.pl }).click();

    await expect(page).toHaveURL(/\/pl$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "pl");
  });
});
