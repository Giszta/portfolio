import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type SectionSpacing = "none" | "compact" | "default";
export type SectionTone = "canvas" | "surface";

const spacings: Record<SectionSpacing, string> = {
  none: "",
  compact: "py-12 sm:py-16",
  default: "py-20 sm:py-28",
};

/**
 * Tła sekcji są przezroczyste (canvas) albo półprzezroczyste (surface), żeby przez nie
 * przebijała siatka z layoutu. Krycie wraca tylko tam, gdzie treść ma własne tło.
 */
const tones: Record<SectionTone, string> = {
  canvas: "bg-transparent",
  surface: "bg-surface/60",
};

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  spacing?: SectionSpacing;
  tone?: SectionTone;
}

export function Section({
  spacing = "default",
  tone = "canvas",
  className,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn("relative isolate scroll-mt-20", spacings[spacing], tones[tone], className)}
      {...props}
    />
  );
}
