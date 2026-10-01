import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NAV_SECTIONS } from "@/content/navigation";
import { renderWithIntl } from "@/test-utils/renderWithIntl";
import HomePage from "./page";

describe("HomePage", () => {
  it.each([
    ["en", "Engineer who codes."],
    ["pl", "Inżynier, który koduje."],
  ] as const)("renders the %s heading from translations", (locale, heading) => {
    renderWithIntl(<HomePage />, { locale });
    expect(screen.getByRole("heading", { level: 1, name: heading })).toBeInTheDocument();
  });

  it("renders one named section per navigation item, in menu order", () => {
    renderWithIntl(<HomePage />);
    const ids = screen.getAllByRole("region").map((section) => section.id);
    expect(ids).toEqual([...NAV_SECTIONS]);
  });
});
