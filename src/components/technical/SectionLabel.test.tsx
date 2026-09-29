import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionLabel, formatSectionIndex } from "./SectionLabel";

describe("formatSectionIndex", () => {
  it.each([
    [1, "01"],
    [9, "09"],
    [12, "12"],
  ] as const)("formats %s as %s", (index, expected) => {
    expect(formatSectionIndex(index)).toBe(expected);
  });
});

describe("SectionLabel", () => {
  it("renders padded index and label", () => {
    render(<SectionLabel index={2} label="Projects" />);
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
  });
});
