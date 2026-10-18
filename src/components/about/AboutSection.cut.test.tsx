import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { formatCutMark } from "@/components/technical";
import { renderWithIntl } from "@/test-utils/renderWithIntl";
import { AboutSection } from "./AboutSection";

describe("AboutSection cut line", () => {
  it.each(["en", "pl"] as const)("has no drawing label, only the line (%s)", (locale) => {
    renderWithIntl(<AboutSection />, { locale });
    expect(screen.queryByText(formatCutMark("B"))).toBeNull();
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
