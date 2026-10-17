import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import en from "../../../messages/en.json";
import pl from "../../../messages/pl.json";
import { renderWithIntl } from "@/test-utils/renderWithIntl";
import { EngineeringSection } from "./EngineeringSection";

const catalogs = { en, pl } as const;
const CHIPS = ["solidworks", "modelling", "documentation", "custom", "enclosures"] as const;
const CAPABILITIES = ["design", "documentation", "production", "client"] as const;

function fullTitle(locale: keyof typeof catalogs): string {
  const { titleOutline, titleSolid } = catalogs[locale].engineering;
  return `${titleOutline} ${titleSolid}`;
}

describe("EngineeringSection", () => {
  it.each(["en", "pl"] as const)(
    "is the engineering region, named by its whole heading (%s)",
    (locale) => {
      renderWithIntl(<EngineeringSection />, { locale });
      expect(screen.getByRole("region", { name: fullTitle(locale) })).toHaveAttribute(
        "id",
        "engineering",
      );
      expect(
        screen.getByRole("heading", { level: 2, name: fullTitle(locale) }),
      ).toBeInTheDocument();
    },
  );

  it.each(["en", "pl"] as const)("renders the lead paragraph (%s)", (locale) => {
    renderWithIntl(<EngineeringSection />, { locale });
    expect(screen.getByText(catalogs[locale].engineering.lead)).toBeInTheDocument();
  });

  it.each(["en", "pl"] as const)("lists every tool and area as a chip (%s)", (locale) => {
    renderWithIntl(<EngineeringSection />, { locale });
    const messages = catalogs[locale].engineering;
    const list = screen.getByRole("list", { name: messages.chipsLabel });
    const items = within(list).getAllByRole("listitem");

    expect(items.map((item) => item.textContent)).toEqual(CHIPS.map((key) => messages.chips[key]));
  });

  it.each(["en", "pl"] as const)(
    "describes each capability under its own heading (%s)",
    (locale) => {
      renderWithIntl(<EngineeringSection />, { locale });
      const messages = catalogs[locale].engineering;
      const list = screen.getByRole("list", { name: messages.capabilitiesLabel });

      expect(within(list).getAllByRole("listitem")).toHaveLength(CAPABILITIES.length);
      for (const key of CAPABILITIES) {
        const { title, text } = messages.capabilities[key];
        expect(within(list).getByRole("heading", { level: 3, name: title })).toBeInTheDocument();
        expect(within(list).getByText(text)).toBeInTheDocument();
      }
    },
  );

  it("keeps the decoration out of the accessibility tree", () => {
    const { container } = renderWithIntl(<EngineeringSection />);
    const hidden = [...container.querySelectorAll('[aria-hidden="true"]')].map(
      (element) => element.textContent,
    );

    expect(hidden).toContain("01");
    expect(hidden).toContain("04");
    expect(hidden.some((text) => text?.includes(en.engineering.measure.end))).toBe(true);
  });

  it("has no section-cut label (the section is not a cut)", () => {
    const { container } = renderWithIntl(<EngineeringSection />);
    expect(container.querySelector("[data-cut-label]")).toBeNull();
    expect(screen.queryByText(/[A-Z]–[A-Z]/)).not.toBeInTheDocument();
  });
});
