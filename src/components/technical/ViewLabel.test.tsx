import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VIEWS } from "@/types/view";
import { ViewLabel } from "./ViewLabel";

describe("ViewLabel", () => {
  it.each(VIEWS)("renders the %s view with its color", (view) => {
    render(<ViewLabel view={view} label="View" />);
    const label = screen.getByText("View").parentElement;
    expect(label).toHaveAttribute("data-view", view);
    expect(label).toHaveClass(`text-view-${view}`);
  });

  it("puts the arrow on the side of the cut and hides it from screen readers", () => {
    const { container } = render(<ViewLabel view="engineering" label="Engineering" />);
    const [first] = Array.from(container.firstElementChild?.children ?? []);
    expect(first).toHaveAttribute("aria-hidden", "true");
    expect(first).toHaveTextContent("◁");
  });

  it("places the arrow after the label for the software view", () => {
    const { container } = render(<ViewLabel view="software" label="Software" />);
    const children = Array.from(container.firstElementChild?.children ?? []);
    expect(children.at(-1)).toHaveTextContent("▷");
  });
});
