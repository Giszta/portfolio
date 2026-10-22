import { expect, test } from "@playwright/test";

const LOCALES = ["en", "pl"] as const;

for (const locale of LOCALES) {
  test.describe(`SEO head (${locale})`, () => {
    test("has canonical, hreflang and Open Graph tags", async ({ page }) => {
      await page.goto(`/${locale}`);

      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        new RegExp(`/${locale}$`),
      );
      await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(3);
      await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
      await expect(page.locator('meta[name="twitter:image"]')).toHaveCount(1);
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
        "content",
        locale === "pl" ? "pl_PL" : "en_US",
      );
    });

    test("serves the Open Graph image as PNG", async ({ page, request }) => {
      await page.goto(`/${locale}`);
      const src = await page.locator('meta[property="og:image"]').getAttribute("content");
      expect(src).not.toBeNull();

      const { pathname, search } = new URL(src ?? "");
      const response = await request.get(`${pathname}${search}`);
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("image/png");
    });

    test("embeds valid Person JSON-LD", async ({ page }) => {
      await page.goto(`/${locale}`);
      const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
      const data = JSON.parse(raw ?? "{}") as {
        "@type"?: string;
        name?: string;
        sameAs?: string[];
      };

      expect(data["@type"]).toBe("Person");
      expect(data.name).toBe("Adam Giszter");
      expect(data.sameAs?.length).toBeGreaterThan(0);
    });
  });
}

test("sitemap lists both language versions", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const xml = await response.text();
  expect(xml).toMatch(/<loc>[^<]+\/pl<\/loc>/);
  expect(xml).toMatch(/<loc>[^<]+\/en<\/loc>/);
});

test("robots.txt points to the sitemap", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);
  expect(await response.text()).toMatch(/Sitemap: .+\/sitemap\.xml/);
});

test("design system page is not indexable", async ({ page }) => {
  await page.goto("/en/design-system");
  const robots = await page
    .locator('meta[name="robots"]')
    .evaluateAll((tags) => tags.map((tag) => tag.getAttribute("content") ?? ""));
  expect(robots.length).toBeGreaterThan(0);
  for (const content of robots) {
    expect(content).toContain("noindex");
  }
});
