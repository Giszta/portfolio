import { expect, test, type Page } from "@playwright/test";

const grid = (page: Page) => page.locator('body > [data-variant="blueprint"]');

const background = (page: Page, selector: string) =>
  page.locator(selector).evaluate((element) => getComputedStyle(element).backgroundColor);

test.describe("page background grid", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en");
  });

  test("is a single decorative layer that never blocks the page", async ({ page }) => {
    await expect(grid(page)).toHaveCount(1);
    await expect(grid(page)).toHaveAttribute("aria-hidden", "true");
    await expect(grid(page)).toHaveCSS("pointer-events", "none");
  });

  test("fills the body, in height and in width", async ({ page }) => {
    const gridBox = await grid(page).boundingBox();
    const bodyBox = await page.locator("body").boundingBox();
    expect(gridBox?.height).toBeGreaterThan(0);
    expect(Math.abs((gridBox?.height ?? 0) - (bodyBox?.height ?? -1))).toBeLessThanOrEqual(1);
    // Okno nie jest tu punktem odniesienia: scrollbar-gutter: stable rezerwuje pas na pasek
    // przewijania, więc html i body są od okna węższe. Siatka ma wypełniać body także wszerz.
    expect(Math.abs((gridBox?.width ?? 0) - (bodyBox?.width ?? -1))).toBeLessThanOrEqual(1);
  });

  test("is not hidden by the sections: canvas is transparent, surface only half covers", async ({
    page,
  }) => {
    const transparent = "rgba(0, 0, 0, 0)";
    const solidSurface = await page.evaluate(() => {
      const probe = document.createElement("div");
      probe.className = "bg-surface";
      document.body.append(probe);
      const color = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return color;
    });

    expect(await background(page, "#about")).toBe(transparent);
    const projects = await background(page, "#projects");
    expect(projects).not.toBe(transparent);
    expect(projects).not.toBe(solidSurface);
  });

  test("does not overflow horizontally", async ({ page }) => {
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe("portrait on the grid", () => {
  test("hides the grid behind the face and blends the image, not its container", async ({
    page,
  }) => {
    await page.goto("/en");
    const image = page.locator("#about figure img");
    const container = image.locator("xpath=..");

    expect(await container.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(
      await page.locator("body").evaluate((el) => getComputedStyle(el).backgroundColor),
    );
    await expect(image).toHaveCSS("mix-blend-mode", "lighten");
    await expect(container).toHaveCSS("mix-blend-mode", "normal");
  });
});
