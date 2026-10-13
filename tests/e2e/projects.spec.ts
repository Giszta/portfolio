import { expect, test, type Page } from "@playwright/test";
import en from "../../messages/en.json";

const label = (template: string, project: string) => template.replace("{project}", project);

function section(page: Page) {
  return page.locator("#projects");
}

function tabs(page: Page) {
  return section(page)
    .getByRole("tablist", { name: en.projects.folder.tablist })
    .getByRole("tab");
}

function sheetHeading(page: Page, name: string) {
  return section(page).getByRole("heading", { level: 3, name, exact: true });
}

test.describe("projects folder", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    await section(page).scrollIntoViewIfNeeded();
  });

  test("shows the first sheet and switches sheets with the tabs", async ({ page }) => {
    await expect(tabs(page)).toHaveCount(4);
    await expect(tabs(page).first()).toHaveAttribute("aria-selected", "true");
    await expect(sheetHeading(page, "NEXUS")).toBeVisible();

    await tabs(page).nth(1).click();

    await expect(tabs(page).nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(sheetHeading(page, "Support Tickets Dashboard")).toBeVisible();
    await expect(sheetHeading(page, "NEXUS")).toBeHidden();
  });

  test("supports the WAI-ARIA tabs keyboard pattern", async ({ page }) => {
    await tabs(page).first().focus();

    await page.keyboard.press("ArrowDown");
    await expect(tabs(page).nth(1)).toBeFocused();
    await expect(tabs(page).nth(1)).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("End");
    await expect(tabs(page).last()).toBeFocused();

    await page.keyboard.press("Home");
    await expect(tabs(page).first()).toBeFocused();
    await expect(sheetHeading(page, "NEXUS")).toBeVisible();
  });

  test("previous and next buttons wrap around", async ({ page }) => {
    await section(page).getByRole("button", { name: en.projects.folder.previous }).click();
    await expect(sheetHeading(page, "Fotoroman")).toBeVisible();

    await section(page).getByRole("button", { name: en.projects.folder.next }).click();
    await expect(sheetHeading(page, "NEXUS")).toBeVisible();
  });

  test("opens the demo and the repo in a new tab", async ({ page }) => {
    const demo = section(page).getByRole("link", { name: label(en.projects.links.demoLabel, "NEXUS") });
    const repo = section(page).getByRole("link", { name: label(en.projects.links.repoLabel, "NEXUS") });

    await expect(demo).toHaveAttribute("href", /^https:\/\//);
    await expect(demo).toHaveAttribute("target", "_blank");
    await expect(repo).toHaveAttribute("href", /^https:\/\/github\.com\//);
    await expect(repo).toHaveAttribute("target", "_blank");
  });

  test("loads the screenshot of the active sheet", async ({ page }) => {
    const image = section(page).getByRole("tabpanel").getByRole("img");
    await expect(image).toBeVisible();
    await expect
      .poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0);
  });

  test("the learning-projects archive expands and collapses", async ({ page }) => {
    const summary = section(page).getByText(
      new RegExp(en.projects.archive.title.replace("({count})", "\\(\\d+\\)")),
    );
    const firstArchived = section(page).getByRole("heading", { level: 3, name: "Postly", exact: true });

    await expect(firstArchived).toBeHidden();
    await summary.click();
    await expect(firstArchived).toBeVisible();

    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(firstArchived).toBeHidden();
  });
});

test.describe("section-cut transition", () => {
  test("never causes horizontal scrolling, even mid-animation", async ({ page }) => {
    await page.goto("/en");
    await section(page).scrollIntoViewIfNeeded();

    await section(page).getByRole("button", { name: en.projects.folder.next }).click();

    await page.waitForTimeout(350);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);

    await expect(sheetHeading(page, "Support Tickets Dashboard")).toBeVisible();
    await expect(sheetHeading(page, "NEXUS")).toBeHidden();
  });
});