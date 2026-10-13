import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TECH, type TechId } from "@/content/tech";
import { contrastRatio } from "@/lib/a11y/contrast";
import { NON_TEXT_CONTRAST } from "@/lib/a11y/brandColor";
import { readPrimitive } from "@/test-utils/designTokens";
import { TECH_CHIP_BACKGROUND, TechChip } from "./TechChip";

const IDS_WITH_ICON = (Object.keys(TECH) as TechId[]).filter((id) => TECH[id].icon !== null);

function iconOf(id: TechId) {
  const { container } = render(<TechChip id={id} />);
  return container.querySelector("svg");
}

describe("TechChip", () => {
  it("shows the technology name", () => {
    render(<TechChip id="typescript" />);
    expect(screen.getByText(TECH.typescript.label)).toBeInTheDocument();
  });

  it("draws a legible brand colour in that colour", () => {
    expect(iconOf("typescript")).toHaveAttribute("fill", "#3178C6");
  });

  it("falls back to the text colour when the brand colour would disappear", () => {
    expect(iconOf("nextjs")).toHaveAttribute("fill", "currentColor");
  });

  it("renders the name alone when the brand has no icon", () => {
    expect(iconOf("pgvector")).toBeNull();
  });

  it("hides the icon from assistive tech", () => {
    expect(iconOf("react")).toHaveAttribute("aria-hidden", "true");
  });

  it("uses the real chip background from the design tokens", () => {
    expect(TECH_CHIP_BACKGROUND.toLowerCase()).toBe(readPrimitive("graphite-900").toLowerCase());
  });

  it.each(IDS_WITH_ICON)("%s icon is either legible or drawn in the text colour", (id) => {
    const fill = iconOf(id)?.getAttribute("fill");
    if (fill !== "currentColor") {
      expect(contrastRatio(fill ?? "", TECH_CHIP_BACKGROUND)).toBeGreaterThanOrEqual(
        NON_TEXT_CONTRAST,
      );
    }
  });
});