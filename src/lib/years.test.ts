import { describe, expect, it } from "vitest";
import { formatYearRange } from "./years";

describe("formatYearRange", () => {
  it("prints a single year", () => {
    expect(formatYearRange({ start: 2026 })).toBe("2026");
  });

  it("joins a range with an en dash", () => {
    expect(formatYearRange({ start: 2023, end: 2025 })).toBe("2023\u20132025");
  });
});