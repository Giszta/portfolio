import { describe, expect, it } from "vitest";
import { formatGeo } from "./geo";

describe("formatGeo", () => {
  it.each([
    [52, 16, "52°N 16°E"],
    [-33.9, 18.4, "33.9°S 18.4°E"],
    [40.7, -74, "40.7°N 74°W"],
    [0, 0, "0°N 0°E"],
  ] as const)("formats %s, %s as %s", (lat, lon, expected) => {
    expect(formatGeo(lat, lon)).toBe(expected);
  });
});
