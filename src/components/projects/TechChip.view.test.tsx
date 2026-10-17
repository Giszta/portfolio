import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TechChip } from "./TechChip";

describe("TechChip view", () => {
  it("passes the view to the tag, so engineering chips get their own style", () => {
    render(
      <ul>
        <TechChip id="solidworks" as="li" view="engineering" />
      </ul>,
    );
    const chip = screen.getByRole("listitem");
    expect(chip).toHaveAttribute("data-view", "engineering");
    expect(chip).toHaveAttribute("data-tech", "solidworks");
  });

  it("renders without a view by default", () => {
    render(
      <ul>
        <TechChip id="react" as="li" />
      </ul>,
    );
    expect(screen.getByRole("listitem")).not.toHaveAttribute("data-view");
  });
});
