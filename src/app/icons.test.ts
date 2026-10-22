import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const read = (file: string): Buffer => readFileSync(join(process.cwd(), "src/app", file));

describe("site icons", () => {
  it("ships an SVG icon with a viewBox", () => {
    const svg = read("icon.svg").toString("utf8");
    expect(svg).toContain("<svg");
    expect(svg).toContain('viewBox="0 0 64 64"');
  });

  it("ships a favicon.ico with 16, 32 and 48 px images", () => {
    const ico = read("favicon.ico");
    expect(ico.readUInt16LE(0)).toBe(0); // reserved
    expect(ico.readUInt16LE(2)).toBe(1); // type: icon
    const count = ico.readUInt16LE(4);
    const sizes = Array.from({ length: count }, (_, i) => ico.readUInt8(6 + i * 16));
    expect(sizes).toEqual([16, 32, 48]);
  });

  it("ships a 180x180 apple touch icon", () => {
    const png = read("apple-icon.png");
    expect(png.subarray(1, 4).toString("ascii")).toBe("PNG");
    expect(png.readUInt32BE(16)).toBe(180); // IHDR width
    expect(png.readUInt32BE(20)).toBe(180); // IHDR height
  });
});
