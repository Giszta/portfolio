import { expect, test, type Page } from "@playwright/test";
import en from "../../messages/en.json";
import pl from "../../messages/pl.json";

/** Nagłówek z leadem i legendą oraz pięć warstw — tyle grup wchodzi przez <Reveal>. */
const REVEAL_GROUPS = 6;
const LAYERS = 5;
const ENGINEERING_CHIPS = 3;

const section = (page: Page) => page.locator("#technology");
const layers = (page: Page) => section(page).locator("ol > li");
const cards = (page: Page) => section(page).locator("ol > li > [data-reveal]");

const fullTitle = (messages: typeof en.technology | typeof pl.technology) =>
  `${messages.titleSolid} ${messages.titleOutline}`;

test.describe("technology", () => {
  test("is the technology section, named by its whole heading in both languages", async ({
    page,
  }) => {
    for (const [locale, messages] of [
      ["en", en.technology],
      ["pl", pl.technology],
    ] as const) {
      await page.goto(`/${locale}`);
      await section(page).scrollIntoViewIfNeeded();

      const heading = section(page).getByRole("heading", { level: 2 });
      await expect(heading).toBeVisible();
      await expect(heading).toHaveText(fullTitle(messages));
    }
  });

  test("opens at the section when linked by its hash", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en#technology");

    await expect(section(page)).toBeInViewport();
    await expect(section(page).getByRole("heading", { level: 2 })).toBeInViewport();
  });

  test("lists five layers, each with its own heading and chips", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    await section(page).scrollIntoViewIfNeeded();

    await expect(layers(page)).toHaveCount(LAYERS);
    await expect(section(page).getByRole("heading", { level: 3 })).toHaveCount(LAYERS);

    const engineering = section(page).getByRole("list", {
      name: en.technology.groups.engineering.title,
    });
    const chips = engineering.getByRole("listitem");
    await expect(chips).toHaveCount(ENGINEERING_CHIPS);
    for (const chip of await chips.all()) {
      await expect(chip).toHaveAttribute("data-view", "engineering");
    }
  });

  test("is not a section cut: no cut label", async ({ page }) => {
    await page.goto("/en");
    await section(page).scrollIntoViewIfNeeded();

    await expect(section(page).getByText(/\b[A-Z]–[A-Z]\b/)).toHaveCount(0);
  });

  test("does not overflow horizontally", async ({ page }) => {
    await page.goto("/en");
    await section(page).scrollIntoViewIfNeeded();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("steps the layers to the right on desktop", async ({ page, isMobile }) => {
    test.skip(isMobile, "the stepped layout starts at the lg breakpoint");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    await section(page).scrollIntoViewIfNeeded();

    const lefts: number[] = [];
    for (const card of await cards(page).all()) {
      const box = await card.boundingBox();
      expect(box).not.toBeNull();
      lefts.push(Math.round(box?.x ?? Number.NaN));
    }

    expect(lefts).toHaveLength(LAYERS);
    for (let index = 1; index < lefts.length; index += 1) {
      expect(lefts[index] ?? 0, `layer ${index + 1}`).toBeGreaterThan(lefts[index - 1] ?? 0);
    }
  });

  test("stacks the layers in one column on a phone", async ({ page, isMobile }) => {
    test.skip(!isMobile, "the single column is the below-lg layout");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    await section(page).scrollIntoViewIfNeeded();

    const lefts = new Set<number>();
    for (const card of await cards(page).all()) {
      const box = await card.boundingBox();
      lefts.add(Math.round(box?.x ?? Number.NaN));
    }
    expect(lefts.size).toBe(1);
  });
});

test.describe("technology motion", () => {
  test("shows everything at once when motion is reduced", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    await section(page).scrollIntoViewIfNeeded();

    const groups = section(page).locator("[data-reveal]");
    await expect(groups).toHaveCount(REVEAL_GROUPS);
    for (const group of await groups.all()) {
      await expect(group).toHaveCSS("opacity", "1");
    }
  });

  test("reveals each group once it is scrolled into view", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/en");
    await section(page).scrollIntoViewIfNeeded();

    const groups = section(page).locator("[data-reveal]");
    await expect(groups).toHaveCount(REVEAL_GROUPS);
    for (const group of await groups.all()) {
      await group.scrollIntoViewIfNeeded();
      await expect(group).toHaveAttribute("data-reveal", "visible");
      await expect(group).toHaveCSS("opacity", "1");
    }
  });
});
