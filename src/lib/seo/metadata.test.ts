import { describe, expect, it } from "vitest";
import { buildAlternates, buildPageMetadata, ogLocale } from "./metadata";

describe("buildAlternates", () => {
  it("builds canonical and hreflang links for a project page", () => {
    expect(buildAlternates("pl", "/projects/forge")).toEqual({
      canonical: "/pl/projects/forge",
      languages: {
        pl: "/pl/projects/forge",
        en: "/en/projects/forge",
        "x-default": "/en/projects/forge",
      },
    });
  });

  it("prefixes the home page with the locale", () => {
    expect(buildAlternates("en", "/").canonical).toBe("/en");
  });
});

describe("buildPageMetadata", () => {
  const input = {
    href: "/projects/forge",
    title: "FORGE",
    description: "Case study",
    siteName: "Adam",
  } as const;

  it.each(["pl", "en"] as const)("sets OpenGraph locale for %s", (locale) => {
    const metadata = buildPageMetadata({ ...input, locale });
    expect(metadata.openGraph).toMatchObject({
      locale: ogLocale[locale],
      url: `/${locale}/projects/forge`,
      siteName: "Adam",
    });
  });

  it("lists the other language as alternate locale", () => {
    const metadata = buildPageMetadata({ ...input, locale: "pl" });
    expect(metadata.openGraph).toMatchObject({ alternateLocale: ["en_US"] });
  });

  it("uses the plain title for OpenGraph when the page title is absolute", () => {
    const metadata = buildPageMetadata({ ...input, locale: "en", title: { absolute: "Home" } });
    expect(metadata.title).toEqual({ absolute: "Home" });
    expect(metadata.openGraph).toMatchObject({ title: "Home" });
    expect(metadata.twitter).toMatchObject({ title: "Home", card: "summary_large_image" });
  });
});
