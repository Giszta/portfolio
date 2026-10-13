import { contrastRatio } from "./contrast";

export const NON_TEXT_CONTRAST = 3;


export function brandColorOrNull(
  brandHex: string,
  backgroundHex: string,
  minRatio: number = NON_TEXT_CONTRAST,
): string | null {
  const color = `#${brandHex.replace(/^#/, "").toUpperCase()}`;
  return contrastRatio(color, backgroundHex) >= minRatio ? color : null;
}