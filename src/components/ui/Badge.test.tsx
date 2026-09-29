import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders content with neutral tone by default", () => {
    render(<Badge>Draft</Badge>);
    expect(screen.getByText("Draft")).toHaveAttribute("data-tone", "neutral");
  });

  it("applies the requested tone", () => {
    render(<Badge tone="warning">Draft</Badge>);
    const badge = screen.getByText("Draft");
    expect(badge).toHaveAttribute("data-tone", "warning");
    expect(badge).toHaveClass("text-warning");
  });
});
