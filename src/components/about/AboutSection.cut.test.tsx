import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import en from "../../../messages/en.json";
import pl from "../../../messages/pl.json";
import { formatCutMark } from "@/components/technical";
import { renderWithIntl } from "@/test-utils/renderWithIntl";
import { AboutSection } from "./AboutSection";

const CUT = formatCutMark("B");

describe("AboutSection cut mark", () => {
  it.each(["en", "pl"] as const)("labels the section as cut B–B (%s)", (locale) => {
    renderWithIntl(<AboutSection />, { locale });
    const label = (locale === "en" ? en : pl).about.cutLabel;
    expect(screen.getByText(CUT)).toBeInTheDocument();
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("hides the drawing label from assistive technology", () => {
    renderWithIntl(<AboutSection />);
    expect(screen.getByText(CUT).closest("[aria-hidden='true']")).not.toBeNull();
  });

  it("draws the cut line vertically on desktop and horizontally on mobile, both decorative", () => {
    renderWithIntl(<AboutSection />);
    const lines = [...document.querySelectorAll("[data-orientation]")];
    expect(lines.map((line) => line.getAttribute("data-orientation")).sort()).toEqual([
      "horizontal",
      "vertical",
    ]);
    for (const line of lines) {
      expect(line).toHaveAttribute("aria-hidden", "true");
    }
  });
});
