import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CutLabel, formatCutMark } from "./CutLabel";

describe("formatCutMark", () => {
  it.each([
    ["B", "B–B"],
    [" c ", "C–C"],
  ] as const)("formats %j as %s", (letter, expected) => {
    expect(formatCutMark(letter)).toBe(expected);
  });

  it("uses an en dash, not a hyphen", () => {
    expect(formatCutMark("a")).toContain("\u2013");
    expect(formatCutMark("a")).not.toContain("-");
  });

  it("throws on empty input", () => {
    expect(() => formatCutMark("  ")).toThrow(/required/);
  });
});

describe("CutLabel", () => {
  it("renders code and label with a hidden separator", () => {
    render(<CutLabel code="B–B" label="FORGE" />);
    expect(screen.getByText("B–B")).toBeInTheDocument();
    expect(screen.getByText("FORGE")).toBeInTheDocument();
    expect(screen.getByText("·")).toHaveAttribute("aria-hidden", "true");
  });

  it("renders the code alone when no label is given", () => {
    render(<CutLabel code="C–C" />);
    expect(screen.getByText("C–C")).toBeInTheDocument();
    expect(screen.queryByText("·")).not.toBeInTheDocument();
  });
});
