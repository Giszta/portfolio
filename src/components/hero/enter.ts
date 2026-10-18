import type { CSSProperties } from "react";

/**
 * "fade" — pojawia się z przezroczystości (animacja w globals.css).
 * "rise" — tylko ruch, bez przezroczystości: dla elementu LCP, żeby wejście nie opóźniało LCP.
 */
export type HeroEnterVariant = "fade" | "rise";

interface HeroEnterProps {
  "data-hero-enter": HeroEnterVariant;
  style: CSSProperties;
}

/** Atrybuty wejścia elementu Hero; `index` ustala kolejność (opóźnienie = index × 90 ms w CSS). */
export function heroEnter(index: number, variant: HeroEnterVariant = "fade"): HeroEnterProps {
  return { "data-hero-enter": variant, style: { "--i": index } as CSSProperties };
}
