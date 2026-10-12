import { describe, expect, it } from "vitest";
import { brandColorOrNull } from "./brandColor";

const DARK = "#0b0f14";

describe("brandColorOrNull", () => {
  it("keeps a brand colour that stands out on the background", () => {
    expect(brandColorOrNull("06B6D4", DARK)).toBe("#06B6D4");
  });

  it("drops a brand colour that disappears on the background", () => {
    expect(brandColorOrNull("000000", DARK)).toBeNull();
  });

  it("accepts hex with or without a leading #", () => {
    expect(brandColorOrNull("#06b6d4", DARK)).toBe("#06B6D4");
  });

  it("respects a custom threshold", () => {
    expect(brandColorOrNull("06B6D4", DARK, 21)).toBeNull();
  });
});