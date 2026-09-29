/**
 * WCAG 2.x contrast ratio.
 * https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio
 * AA: ≥ 4.5 zwykły tekst, ≥ 3 duży tekst i elementy UI.
 */

const HEX_PATTERN = /^#?([0-9a-f]{6})$/i;

/** sRGB (0–255) → wartość liniowa, zgodnie ze wzorem WCAG. */
function channelToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** Jasność względna koloru: 0 = czarny, 1 = biały. */
export function relativeLuminance(hex: string): number {
  const match = HEX_PATTERN.exec(hex.trim());
  const value = match?.[1];
  if (!value) {
    throw new Error(`Invalid hex color: "${hex}"`);
  }
  const r = channelToLinear(parseInt(value.slice(0, 2), 16));
  const g = channelToLinear(parseInt(value.slice(2, 4), 16));
  const b = channelToLinear(parseInt(value.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground: string, background: string): number {
  const l1 = relativeLuminance(foreground);
  const l2 = relativeLuminance(background);
  const [lighter, darker] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (lighter + 0.05) / (darker + 0.05);
}
