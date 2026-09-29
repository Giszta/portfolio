import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CoordinateLabel, formatCoordinate } from "./CoordinateLabel";

describe("formatCoordinate", () => {
  it.each([
    [48.5, 2, "+048.50"],
    [-12, 2, "-012.00"],
    [1280, 1, "+1280.0"],
    [0, 0, "+000"],
    [7.456, 2, "+007.46"],
  ] as const)("formats %s with precision %s as %s", (value, precision, expected) => {
    expect(formatCoordinate(value, precision)).toBe(expected);
  });
});

describe("CoordinateLabel", () => {
  it("renders only provided axes", () => {
    render(<CoordinateLabel coordinates={{ x: 120, y: 48.5 }} />);
    expect(screen.getByText("x")).toBeInTheDocument();
    expect(screen.getByText("y")).toBeInTheDocument();
    expect(screen.queryByText("z")).not.toBeInTheDocument();
  });
});
