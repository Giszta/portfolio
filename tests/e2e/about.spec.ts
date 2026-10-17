import { expect, test, type Page } from "@playwright/test";
import en from "../../messages/en.json";
import pl from "../../messages/pl.json";

/** Zdjęcie, nagłówek, akapity i dolny blok — tyle grup wchodzi przez <Reveal>. */
const REVEAL_GROUPS = 4;
/** top-20 = 5 rem: tyle zdjęcie zostaje pod górną krawędzią ekranu, gdy tekst się przewija. */
const PINNED_TOP = 80;
const PIN_TOLERANCE = 3;

const section = (page: Page) => page.locator("#about");

test.describe("about", () => {
  test("is the about section, named by its heading in both languages", async ({ page }) => {
    for (const [locale, messages] of [
      ["en", en],
      ["pl", pl],
    ] as const) {
      await page.goto(`/${locale}`);
      await section(page).scrollIntoViewIfNeeded();
      await expect(
        section(page).getByRole("heading", { level: 2, name: messages.about.title }),
      ).toBeVisible();
    }
  });

  test("loads the portrait with its translated alt text", async ({ page }) => {
    await page.goto("/en");
    const portrait = section(page).getByRole("img", { name: en.about.photoAlt });
    await portrait.scrollIntoViewIfNeeded();

    await expect
      .poll(() => portrait.evaluate((image) => (image as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0);
  });

  test("CV link serves a PDF in the page language", async ({ page }) => {
    for (const [locale, messages] of [
      ["en", en],
      ["pl", pl],
    ] as const) {
      await page.goto(`/${locale}`);
      const link = section(page).getByRole("link", {
        name: new RegExp(messages.common.downloadCv),
      });
      const href = await link.getAttribute("href");
      expect(href, `no CV link in the about section on /${locale}`).toBeTruthy();

      const response = await page.request.get(href ?? "");
      expect(response.status(), `CV for ${locale}`).toBe(200);
      expect(response.headers()["content-type"]).toContain("application/pdf");
    }
  });

  test("the contact button scrolls to the contact section", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    await section(page).getByRole("link", { name: en.about.contactCta }).click();

    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator("#contact")).toBeInViewport();
  });

  test("does not overflow horizontally", async ({ page }) => {
    await page.goto("/en");
    await section(page).scrollIntoViewIfNeeded();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe("about motion", () => {
  test("shows everything at once when motion is reduced", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    await section(page).scrollIntoViewIfNeeded();

    const groups = section(page).locator("[data-reveal]");
    await expect(groups).toHaveCount(REVEAL_GROUPS);
    for (const group of await groups.all()) {
      await expect(group).toHaveCSS("opacity", "1");
    }
    for (const paragraph of await section(page)
      .locator("[data-reveal-variant='stagger'] > p")
      .all()) {
      await expect(paragraph).toHaveCSS("opacity", "1");
    }
  });

  test("reveals the portrait and the paragraphs once the section is in view", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/en");
    await section(page).scrollIntoViewIfNeeded();

    const groups = section(page).locator("[data-reveal]");
    await expect(groups).toHaveCount(REVEAL_GROUPS);
    // Sekcja jest wyższa niż ekran, więc przewinięcie do niej centruje jej środek,
    // a zdjęcie u góry zostaje poza kadrem. Czytelnik przewija od góry — robimy to samo.
    for (const group of await groups.all()) {
      await group.scrollIntoViewIfNeeded();
      await expect(group).toHaveAttribute("data-reveal", "visible");
      await expect(group).toHaveCSS("opacity", "1");
    }

    const paragraphs = section(page).locator("[data-reveal-variant='stagger'] > p");
    await expect(paragraphs.first()).toHaveCSS("opacity", "1");
    await expect(paragraphs.last()).toHaveCSS("opacity", "1");
  });

  test("keeps the portrait pinned under the header while the text scrolls", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "the portrait is sticky only from the lg breakpoint");

    await page.goto("/en");
    const pinned = section(page).locator("figure > div").first();

    await page.evaluate(() => {
      const el = document.querySelector("#about");
      if (!(el instanceof HTMLElement)) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + 300, behavior: "instant" });
    });

    const pinnedTop = async () => Math.round((await pinned.boundingBox())?.y ?? Number.NaN);
    await expect.poll(pinnedTop).toBeGreaterThan(PINNED_TOP - PIN_TOLERANCE);
    await expect.poll(pinnedTop).toBeLessThan(PINNED_TOP + PIN_TOLERANCE);
  });
});
