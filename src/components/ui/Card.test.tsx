import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  it("renders a div by default", () => {
    render(<Card data-testid="card">Content</Card>);
    expect(screen.getByTestId("card").tagName).toBe("DIV");
  });

  it("renders semantic element via `as`", () => {
    render(<Card as="article">Content</Card>);
    expect(screen.getByRole("article")).toHaveTextContent("Content");
  });

  it("adds interactive styles only when requested", () => {
    const { rerender } = render(<Card data-testid="card">Content</Card>);
    expect(screen.getByTestId("card")).not.toHaveClass("hover:border-accent/50");
    rerender(
      <Card data-testid="card" interactive>
        Content
      </Card>,
    );
    expect(screen.getByTestId("card")).toHaveClass("hover:border-accent/50");
  });

  it("renders decorative corner marks when requested", () => {
    render(
      <Card data-testid="card" corners>
        Content
      </Card>,
    );
    expect(screen.getByTestId("card").querySelector("[data-corner-marks]")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
