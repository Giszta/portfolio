import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { siteConfig } from "@/content/site";
import { renderWithIntl } from "@/test-utils/renderWithIntl";
import { CvLink } from "./CvLink";

describe("CvLink", () => {
  it.each(["en", "pl"] as const)("links to the CV in the page language (%s)", (locale) => {
    renderWithIntl(<CvLink>CV</CvLink>, { locale });
    const link = screen.getByRole("link", { name: "CV" });

    expect(link).toHaveAttribute("href", siteConfig.cv[locale]);
    expect(link).toHaveAttribute("hreflang", locale);
    expect(link).toHaveAttribute("type", "application/pdf");
    expect(link).toHaveAttribute("download", `Adam-Giszter-CV-${locale.toUpperCase()}.pdf`);
  });

  it("passes className and other attributes through to the anchor", () => {
    renderWithIntl(
      <CvLink className="custom" data-testid="cv">
        CV
      </CvLink>,
    );
    expect(screen.getByTestId("cv")).toHaveClass("custom");
  });
});
