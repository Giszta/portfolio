import { expect, test, type Page } from "@playwright/test";
import en from "../../messages/en.json";
import pl from "../../messages/pl.json";
import { siteConfig } from "../../src/content/site";

const form = en.contact.form;

const section = (page: Page) => page.locator("#contact");
const formOf = (page: Page) => section(page).getByRole("form", { name: form.title });

async function openContact(page: Page, locale: "en" | "pl" = "en") {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`/${locale}#contact`);
  // Formularz reaguje dopiero po hydratacji; wcześniejszy submit byłby zwykłym przeładowaniem.
  await page.waitForLoadState("networkidle");
  await section(page).scrollIntoViewIfNeeded();
}

/** Żadna wysyłka nie dochodzi do serwera: akcja kończy się błędem sieci, czyli „nie udało się". */
async function blockSubmissions(page: Page) {
  await page.route("**/*", (route) =>
    route.request().method() === "POST" ? route.abort() : route.continue(),
  );
}

test.describe("contact", () => {
  test("is the contact section, named by its whole heading in both languages", async ({ page }) => {
    for (const [locale, messages] of [
      ["en", en.contact],
      ["pl", pl.contact],
    ] as const) {
      await openContact(page, locale);
      const heading = section(page).getByRole("heading", { level: 2 });
      await expect(heading).toHaveText(`${messages.titleOutline} ${messages.titleSolid}`);
    }
  });

  test("lists the email, profiles and CV", async ({ page }) => {
    await openContact(page);
    const email = siteConfig.links.email ?? "";
    await expect(section(page).getByRole("link", { name: email })).toHaveAttribute(
      "href",
      `mailto:${email}`,
    );
    const links = section(page).getByRole("list", { name: en.contact.linksLabel });
    await expect(links.getByRole("link")).toHaveCount(3);
  });

  test("shows every error, marks the fields and focuses the first one on an empty submit", async ({
    page,
  }) => {
    await openContact(page);
    await formOf(page).getByRole("button", { name: form.submit }).click();

    await expect(formOf(page).getByText(form.errors.nameRequired)).toBeVisible();
    await expect(formOf(page).getByText(form.errors.emailRequired)).toBeVisible();
    await expect(formOf(page).getByText(form.errors.messageRequired)).toBeVisible();

    const name = formOf(page).getByLabel(form.name.label);
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(name).toBeFocused();
  });

  test("explains an invalid email and keeps what was typed", async ({ page }) => {
    await openContact(page);
    await formOf(page).getByLabel(form.name.label).fill("Anna");
    await formOf(page).getByLabel(form.email.label).fill("anna@");
    await formOf(page).getByLabel(form.message.label).fill("Cześć");
    await formOf(page).getByRole("button", { name: form.submit }).click();

    await expect(formOf(page).getByText(form.errors.emailInvalid)).toBeVisible();
    await expect(formOf(page).getByLabel(form.email.label)).toBeFocused();
    await expect(formOf(page).getByLabel(form.name.label)).toHaveValue("Anna");
    await expect(formOf(page).getByLabel(form.message.label)).toHaveValue("Cześć");
  });

  test("keeps the message and offers the email when sending fails", async ({ page }) => {
    await blockSubmissions(page);
    await openContact(page);
    await formOf(page).getByLabel(form.name.label).fill("Anna");
    await formOf(page).getByLabel(form.email.label).fill("anna@firma.pl");
    await formOf(page).getByLabel(form.message.label).fill("Szukamy inżyniera.");
    await formOf(page).getByRole("button", { name: form.submit }).click();

    await expect(formOf(page).getByRole("alert")).toContainText(siteConfig.links.email ?? "");
    await expect(formOf(page).getByLabel(form.message.label)).toHaveValue("Szukamy inżyniera.");
    await expect(formOf(page).getByRole("button", { name: form.submit })).toBeEnabled();
  });

  test("is reachable by keyboard and skips the honeypot", async ({ page }) => {
    await openContact(page);
    await formOf(page).getByLabel(form.name.label).focus();

    await page.keyboard.press("Tab");
    await expect(formOf(page).getByLabel(form.email.label)).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(formOf(page).getByLabel(form.message.label)).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(formOf(page).getByRole("button", { name: form.submit })).toBeFocused();
  });

  test("does not overflow horizontally", async ({ page }) => {
    await openContact(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
