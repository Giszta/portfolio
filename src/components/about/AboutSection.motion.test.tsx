import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import en from "../../../messages/en.json";
import { renderWithIntl } from "@/test-utils/renderWithIntl";
import { AboutSection } from "./AboutSection";

/** Nagłówek, akapity i dolny blok — trzy obserwatory zamiast jednego na akapit. */
const REVEAL_GROUPS = 3;

describe("AboutSection motion", () => {
  it("reveals its text in groups that all start hidden", () => {
    renderWithIntl(<AboutSection />);
    const groups = [...document.querySelectorAll("[data-reveal]")];
    expect(groups).toHaveLength(REVEAL_GROUPS);
    for (const group of groups) {
      expect(group).toHaveAttribute("data-reveal", "hidden");
    }
  });

  it("keeps the whole text in the DOM before it is revealed (SEO, no-JS)", () => {
    renderWithIntl(<AboutSection />);
    expect(screen.getByRole("heading", { level: 2, name: en.about.title })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: en.about.contactCta })).toBeInTheDocument();
  });
});
