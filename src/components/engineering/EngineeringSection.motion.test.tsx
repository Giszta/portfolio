import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import en from "../../../messages/en.json";
import { renderWithIntl } from "@/test-utils/renderWithIntl";
import { EngineeringSection } from "./EngineeringSection";

/** Nagłówek z linią, lead z chipami i cztery kompetencje — po jednym obserwatorze na grupę. */
const REVEAL_GROUPS = 6;

describe("EngineeringSection motion", () => {
  it("reveals its content in groups that all start hidden", () => {
    renderWithIntl(<EngineeringSection />);
    const groups = [...document.querySelectorAll("[data-reveal]")];
    expect(groups).toHaveLength(REVEAL_GROUPS);
    for (const group of groups) {
      expect(group).toHaveAttribute("data-reveal", "hidden");
    }
  });

  it("keeps the whole text in the DOM before it is revealed (SEO, no-JS)", () => {
    renderWithIntl(<EngineeringSection />);
    expect(screen.getByText(en.engineering.lead)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: en.engineering.capabilities.client.title }),
    ).toBeInTheDocument();
  });
});
