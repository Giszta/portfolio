import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import en from "../../../messages/en.json";
import pl from "../../../messages/pl.json";
import { STACK, type StackItem } from "@/content/stack";
import { TECH } from "@/content/tech";
import { renderWithIntl } from "@/test-utils/renderWithIntl";
import { TechnologySection } from "./TechnologySection";

const catalogs = { en, pl } as const;
type Locale = keyof typeof catalogs;

function fullTitle(locale: Locale): string {
  const { titleSolid, titleOutline } = catalogs[locale].technology;
  return `${titleSolid} ${titleOutline}`;
}

function itemLabel(item: StackItem, locale: Locale): string {
  return item.kind === "tech" ? TECH[item.id].label : catalogs[locale].technology.terms[item.id];
}

describe("TechnologySection", () => {
  it.each(["en", "pl"] as const)(
    "is the technology region, named by its whole heading (%s)",
    (locale) => {
      renderWithIntl(<TechnologySection />, { locale });
      expect(screen.getByRole("region", { name: fullTitle(locale) })).toHaveAttribute(
        "id",
        "technology",
      );
      expect(
        screen.getByRole("heading", { level: 2, name: fullTitle(locale) }),
      ).toBeInTheDocument();
    },
  );

  it.each(["en", "pl"] as const)("renders the lead paragraph (%s)", (locale) => {
    renderWithIntl(<TechnologySection />, { locale });
    expect(screen.getByText(catalogs[locale].technology.lead)).toBeInTheDocument();
  });

  it.each(["en", "pl"] as const)("shows every layer under its heading, in order (%s)", (locale) => {
    renderWithIntl(<TechnologySection />, { locale });
    const layers = screen.getByRole("list", { name: catalogs[locale].technology.groupsLabel });
    const headings = within(layers).getAllByRole("heading", { level: 3 });

    expect(headings.map((heading) => heading.textContent)).toEqual(
      STACK.map((group) => catalogs[locale].technology.groups[group.id].title),
    );
  });

  it.each(["en", "pl"] as const)("lists the items of each layer as chips (%s)", (locale) => {
    renderWithIntl(<TechnologySection />, { locale });

    for (const group of STACK) {
      const title = catalogs[locale].technology.groups[group.id].title;
      const list = screen.getByRole("list", { name: title });
      const labels = within(list)
        .getAllByRole("listitem")
        .map((item) => item.textContent);

      expect(labels, group.id).toEqual(group.items.map((item) => itemLabel(item, locale)));
    }
  });

  it("styles chips by view: engineering in its own style, the rest as software", () => {
    renderWithIntl(<TechnologySection />);

    for (const group of STACK) {
      const title = en.technology.groups[group.id].title;
      const list = screen.getByRole("list", { name: title });
      for (const chip of within(list).getAllByRole("listitem")) {
        expect(chip, `${group.id}`).toHaveAttribute("data-view", group.view);
      }
    }
  });

  it("keeps numbers, markers and the legend out of the accessibility tree", () => {
    const { container } = renderWithIntl(<TechnologySection />);
    const hidden = [...container.querySelectorAll('[aria-hidden="true"]')].map(
      (element) => element.textContent?.trim() ?? "",
    );

    for (const number of ["01", "02", "03", "04", "05"]) {
      expect(hidden).toContain(number);
    }
    expect(hidden.some((text) => text.includes(en.technology.software))).toBe(true);
    expect(hidden.some((text) => text.includes(en.technology.engineering))).toBe(true);
  });

  it("has no section-cut label (the section is not a cut)", () => {
    renderWithIntl(<TechnologySection />);
    expect(screen.queryByText(/[A-Z]–[A-Z]/)).not.toBeInTheDocument();
  });
});
