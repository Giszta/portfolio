import { expect, test, type Page } from "@playwright/test";
import en from "../../messages/en.json";
import pl from "../../messages/pl.json";

const cvLink = (page: Page, label: string) => page.getByRole("link", { name: new RegExp(label) });

test.describe("hero", () => {
  test("primary call to action scrolls to the projects", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("link", { name: en.hero.ctaPrimary }).click();

    await expect(page).toHaveURL(/#projects$/);
    await expect(page.locator("#projects")).toBeInViewport();
  });

  test("CV link serves a PDF in the page language", async ({ page }) => {
    for (const [locale, messages] of [
      ["en", en],
      ["pl", pl],
    ] as const) {
      await page.goto(`/${locale}`);
      const href = await cvLink(page, messages.common.downloadCv).getAttribute("href");
      expect(href, `no CV link on /${locale}`).toBeTruthy();

      const response = await page.request.get(href ?? "");
      expect(response.status(), `CV for ${locale}`).toBe(200);
      expect(response.headers()["content-type"]).toContain("application/pdf");
    }
  });
});

test.describe("hero on desktop", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop layout only");

  const slider = (page: Page) => page.getByRole("slider", { name: en.hero.cut.label });
  const sliderValue = async (page: Page) =>
    Number(await slider(page).getAttribute("aria-valuenow"));

  test("moves the section line with the keyboard", async ({ page }) => {
    await page.goto("/en");
    await slider(page).focus();

    await page.keyboard.press("ArrowRight");
    await expect(slider(page)).toHaveAttribute("aria-valuenow", "55");

    await page.keyboard.press("End");
    await expect(slider(page)).toHaveAttribute("aria-valuenow", "100");
  });

  test("follows the pointer when the line is dragged", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");

    const figure = page.getByRole("img", { name: en.hero.cut.figure });
    await figure.scrollIntoViewIfNeeded();
    const box = await figure.boundingBox();
    if (!box) throw new Error("shaft figure not rendered");
    const y = box.y + box.height / 2;

    await page.mouse.move(box.x + box.width / 2, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.25, y, { steps: 10 });
    await page.mouse.up();

    await expect.poll(() => sliderValue(page)).toBeGreaterThan(20);
    await expect.poll(() => sliderValue(page)).toBeLessThan(30);
  });
});

test.describe("hero on mobile", () => {
  test.skip(({ isMobile }) => !isMobile, "Mobile layout only");

  test("keeps the heading and both calls to action on the first screen", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
    await expect(page.getByRole("link", { name: en.hero.ctaPrimary })).toBeInViewport();
    await expect(cvLink(page, en.common.downloadCv)).toBeInViewport();
  });

  test("switches the shaft view with the toggle instead of a slider", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByRole("slider")).toBeHidden();

    const group = page.getByRole("group", { name: en.hero.cut.viewsLabel });
    const code = group.getByRole("button", { name: en.hero.cut.views.code });
    await code.click();

    await expect(code).toHaveAttribute("aria-pressed", "true");
    await expect(group.getByRole("button", { name: en.hero.cut.views.section })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});
