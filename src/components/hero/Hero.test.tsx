import { screen } from "@testing-library/react";
import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";
import en from "../../../messages/en.json";
import pl from "../../../messages/pl.json";
import { siteConfig } from "@/content/site";
import { renderWithIntl } from "@/test-utils/renderWithIntl";
import { Hero } from "./Hero";

const t = createTranslator({ locale: "en", messages: en, namespace: "hero" });

describe("Hero", () => {
  it("is the home section, named by its whole heading", () => {
    renderWithIntl(<Hero />);
    const title = `${en.hero.titleOutline} ${en.hero.titleSolid}`;
    expect(screen.getByRole("region", { name: title })).toHaveAttribute("id", "home");
  });

  it("shows the availability status with the city", () => {
    renderWithIntl(<Hero />);
    const city = siteConfig.availability?.city ?? "";
    expect(screen.getByText(t("availability", { city }))).toBeInTheDocument();
  });

  it("leads to the projects section", () => {
    renderWithIntl(<Hero />);
    expect(screen.getByRole("link", { name: en.hero.ctaPrimary })).toHaveAttribute(
      "href",
      "#projects",
    );
  });

  it.each(["en", "pl"] as const)("offers the CV in the page language (%s)", (locale) => {
    renderWithIntl(<Hero />, { locale });
    const label = (locale === "en" ? en : pl).common.downloadCv;
    const link = screen.getByRole("link", { name: new RegExp(label) });
    expect(link).toHaveAttribute("href", siteConfig.cv[locale]);
    expect(link).toHaveAttribute("download");
    expect(link).toHaveAttribute("hreflang", locale);
  });
});
