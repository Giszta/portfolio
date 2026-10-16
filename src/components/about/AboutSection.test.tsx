import { screen } from "@testing-library/react";
import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";
import en from "../../../messages/en.json";
import pl from "../../../messages/pl.json";
import { siteConfig } from "@/content/site";
import { renderWithIntl } from "@/test-utils/renderWithIntl";
import { AboutSection } from "./AboutSection";

const catalogs = { en, pl } as const;
const PARAGRAPHS = ["lead", "software", "tools", "ai", "next"] as const;

function translator(locale: keyof typeof catalogs) {
  return createTranslator({ locale, messages: catalogs[locale], namespace: "about" });
}

function emphasised(message: string): string[] {
  return [...message.matchAll(/<strong>(.*?)<\/strong>/g)].map((match) => match[1] ?? "");
}

describe("AboutSection", () => {
  it("is the about region, named by its heading", () => {
    renderWithIntl(<AboutSection />);
    expect(screen.getByRole("region", { name: en.about.title })).toHaveAttribute("id", "about");
  });

  it.each(["en", "pl"] as const)("renders the heading and every paragraph (%s)", (locale) => {
    renderWithIntl(<AboutSection />, { locale });
    const t = translator(locale);

    expect(screen.getByRole("heading", { level: 2, name: t("title") })).toBeInTheDocument();
    for (const key of PARAGRAPHS) {
      const text = t.markup(key, { strong: (chunks) => chunks });
      expect(
        screen.getByText((_, element) => element?.tagName === "P" && element.textContent === text),
      ).toBeInTheDocument();
    }
  });

  it.each(["en", "pl"] as const)("emphasises the key phrases (%s)", (locale) => {
    renderWithIntl(<AboutSection />, { locale });

    for (const key of PARAGRAPHS) {
      for (const phrase of emphasised(catalogs[locale].about[key])) {
        expect(screen.getByText(phrase, { selector: "strong" })).toBeInTheDocument();
      }
    }
  });

  it("describes the portrait with the translated alt text", () => {
    renderWithIntl(<AboutSection />);
    expect(screen.getByRole("img", { name: en.about.photoAlt })).toBeInTheDocument();
  });

  it("shows the availability status with the city", () => {
    renderWithIntl(<AboutSection />);
    const hero = createTranslator({ locale: "en", messages: en, namespace: "hero" });
    const city = siteConfig.availability?.city ?? "";
    expect(screen.getByText(hero("availability", { city }))).toBeInTheDocument();
  });

  it.each(["en", "pl"] as const)("offers the CV in the page language (%s)", (locale) => {
    renderWithIntl(<AboutSection />, { locale });
    const link = screen.getByRole("link", { name: new RegExp(catalogs[locale].common.downloadCv) });
    expect(link).toHaveAttribute("href", siteConfig.cv[locale]);
    expect(link).toHaveAttribute("download");
    expect(link).toHaveAttribute("hreflang", locale);
  });

  it("leads to the contact section", () => {
    renderWithIntl(<AboutSection />);
    expect(screen.getByRole("link", { name: en.about.contactCta })).toHaveAttribute(
      "href",
      "#contact",
    );
  });
});
