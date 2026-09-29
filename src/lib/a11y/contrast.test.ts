import { describe, expect, it } from "vitest";
import { contrastRatio, relativeLuminance } from "./contrast";

describe("contrastRatio", () => {
  it("returns 21 for black on white", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
  });

  it("returns 1 for identical colors", () => {
    expect(contrastRatio("#4c8dff", "#4c8dff")).toBe(1);
  });

  it("is symmetric", () => {
    expect(contrastRatio("#e8edf2", "#07090c")).toBe(contrastRatio("#07090c", "#e8edf2"));
  });

  it("rejects invalid colors", () => {
    expect(() => relativeLuminance("blue")).toThrow(/Invalid hex/);
  });
});
