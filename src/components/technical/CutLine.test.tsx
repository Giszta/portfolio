import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CutLine, dashDotGradient } from "./CutLine";

describe("dashDotGradient", () => {
  it.each([
    ["vertical", "to bottom"],
    ["horizontal", "to right"],
  ] as const)("%s line runs %s", (orientation, direction) => {
    expect(dashDotGradient(orientation)).toContain(direction);
  });
});

describe("CutLine", () => {
  it("is decorative", () => {
    const { container } = render(<CutLine orientation="vertical" />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("renders the mark at both ends", () => {
    const { container } = render(<CutLine orientation="vertical" mark="A" />);
    const markers = container.querySelectorAll("[data-cut-marker]");
    expect(markers).toHaveLength(2);
    markers.forEach((marker) => expect(marker).toHaveTextContent("A"));
  });

  it("points the arrow in the viewing direction", () => {
    const { container, rerender } = render(<CutLine orientation="horizontal" mark="A" />);
    expect(container.querySelector("[data-cut-marker]")).toHaveTextContent("▲");
    rerender(<CutLine orientation="vertical" mark="A" look="right" />);
    expect(container.querySelector("[data-cut-marker]")).toHaveTextContent("▶");
  });

  it("renders only the line when no mark is given", () => {
    const { container } = render(<CutLine orientation="horizontal" />);
    expect(container.querySelector("[data-cut-marker]")).not.toBeInTheDocument();
  });

  it("rejects impossible orientation/look combinations at the type level", () => {
    // @ts-expect-error — a vertical cut can only look left or right
    const { container } = render(<CutLine orientation="vertical" look="up" />);
    expect(container.firstElementChild).toBeInTheDocument();
  });
});
