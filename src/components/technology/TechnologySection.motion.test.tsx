import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import en from "../../../messages/en.json";
import { renderWithIntl } from "@/test-utils/renderWithIntl";
import { TechnologySection } from "./TechnologySection";

/** Nagłówek z leadem i legendą oraz pięć warstw — po jednym obserwatorze na grupę. */
const REVEAL_GROUPS = 6;

describe("TechnologySection motion", () => {
  it("reveals its content in groups that all start hidden", () => {
    renderWithIntl(<TechnologySection />);
    const groups = [...document.querySelectorAll("[data-reveal]")];
    expect(groups).toHaveLength(REVEAL_GROUPS);
    for (const group of groups) {
      expect(group).toHaveAttribute("data-reveal", "hidden");
    }
  });

  it("keeps the whole text in the DOM before it is revealed (SEO, no-JS)", () => {
    renderWithIntl(<TechnologySection />);
    expect(screen.getByText(en.technology.lead)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: en.technology.groups.engineering.title }),
    ).toBeInTheDocument();
  });
});
