import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test-utils/renderWithIntl";
import { GeoLabel } from "./GeoLabel";

describe("GeoLabel", () => {
  it("shows the technical coordinate, hidden from assistive tech", () => {
    const { container } = renderWithIntl(<GeoLabel />);
    const visual = container.querySelector('[aria-hidden="true"]');
    expect(visual).toHaveTextContent("PL // 52°N 16°E");
  });

  it("gives screen readers a sentence in English", () => {
    renderWithIntl(<GeoLabel />, { locale: "en" });
    expect(screen.getByText("Location: Poland")).toHaveClass("sr-only");
  });

  it("gives screen readers a sentence in Polish", () => {
    renderWithIntl(<GeoLabel />, { locale: "pl" });
    expect(screen.getByText("Lokalizacja: Polska")).toHaveClass("sr-only");
  });
});
