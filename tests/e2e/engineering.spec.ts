import { expect, test, type Page } from "@playwright/test";
import en from "../../messages/en.json";
import pl from "../../messages/pl.json";

/** Nagłówek z linią, lead z chipami i cztery kompetencje — tyle grup wchodzi przez <Reveal>. */
const REVEAL_GROUPS = 6;
const CHIPS = 5;
const CAPABILITIES = 4;

const section = (page: Page) => page.locator("#engineering");

const fullTitle = (messages: typeof en.engineering | typeof pl.engineering) =>
  `${messages.titleOutline} ${messages.titleSolid}`;

test.describe("engineering", () => {
  test("is the engineering section, named by its whole heading in both languages", async ({
    page,
  }) => {
    for (const [locale, messages] of [
      ["en", en.engineering],
      ["pl", pl.engineering],
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
    await page.goto("/en#engineering");

    await expect(section(page)).toBeInViewport();
    await expect(section(page).getByRole("heading", { level: 2 })).toBeInViewport();
  });

  test("lists the tools and the four areas of work", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    await section(page).scrollIntoViewIfNeeded();

    const chips = section(page).getByRole("list", { name: en.engineering.chipsLabel });
    await expect(chips.getByRole("listitem")).toHaveCount(CHIPS);

    const capabilities = section(page).getByRole("list", {
      name: en.engineering.capabilitiesLabel,
    });
    await expect(capabilities.getByRole("listitem")).toHaveCount(CAPABILITIES);
    await expect(capabilities.getByRole("heading", { level: 3 })).toHaveCount(CAPABILITIES);
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

  test("keeps the outlined 7+ inside the viewport", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    const outline = section(page).getByText(en.engineering.titleOutline, { exact: true });
    await outline.scrollIntoViewIfNeeded();

    const box = await outline.boundingBox();
    const viewport = page.viewportSize();
    expect(box).not.toBeNull();
    expect(viewport).not.toBeNull();
    expect(box?.x ?? -1).toBeGreaterThanOrEqual(0);
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(viewport?.width ?? 0);
  });
});

test.describe("engineering motion", () => {
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
    // Na telefonie sekcja jest wyższa niż ekran, więc każdą grupę przewijamy osobno.
    for (const group of await groups.all()) {
      await group.scrollIntoViewIfNeeded();
      await expect(group).toHaveAttribute("data-reveal", "visible");
      await expect(group).toHaveCSS("opacity", "1");
    }
  });
});
