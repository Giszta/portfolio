// @vitest-environment node
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "@/lib/a11y/contrast";

const css = readFileSync(fileURLToPath(new URL("./tokens.css", import.meta.url)), "utf8");

/** Wyciąga wartość hex tokena --ds-<name> z tokens.css. */
function primitive(name: string): string {
  const match = new RegExp(`--ds-${name}:\\s*(#[0-9a-fA-F]{6})`).exec(css);
  const value = match?.[1];
  if (!value) {
    throw new Error(`Primitive token --ds-${name} not found in tokens.css`);
  }
  return value;
}

const backgrounds = {
  canvas: primitive("black-950"),
  surface: primitive("graphite-900"),
  card: primitive("graphite-850"),
  "surface-raised": primitive("graphite-800"),
} as const;

const textColors = {
  fg: primitive("steel-100"),
  "fg-secondary": primitive("steel-300"),
  "fg-muted": primitive("steel-400"),
  accent: primitive("blue-500"),
  cyan: primitive("cyan-400"),
  amber: primitive("amber-400"),
  success: primitive("green-400"),
  error: primitive("red-400"),
  info: primitive("sky-400"),
} as const;

const WCAG_AA_TEXT = 4.5;

describe("design tokens — contrast (WCAG AA)", () => {
  for (const [textName, text] of Object.entries(textColors)) {
    for (const [bgName, bg] of Object.entries(backgrounds)) {
      it(`${textName} on ${bgName} ≥ ${WCAG_AA_TEXT}:1`, () => {
        expect(contrastRatio(text, bg)).toBeGreaterThanOrEqual(WCAG_AA_TEXT);
      });
    }
  }

  it("accent-contrast text on accent backgrounds ≥ 4.5:1", () => {
    const dark = primitive("black-950");
    expect(contrastRatio(dark, primitive("blue-500"))).toBeGreaterThanOrEqual(WCAG_AA_TEXT);
    expect(contrastRatio(dark, primitive("blue-400"))).toBeGreaterThanOrEqual(WCAG_AA_TEXT);
  });
});
