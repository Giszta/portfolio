import { cn } from "@/lib/utils/cn";

export type GridPatternVariant = "technical" | "blueprint";

const variants: Record<GridPatternVariant, string> = {
  technical: "pattern-technical",
  blueprint: "pattern-blueprint",
};

export interface GridPatternProps {
  variant?: GridPatternVariant;
  fade?: boolean;
  className?: string;
}

export function GridPattern({ variant = "blueprint", fade = true, className }: GridPatternProps) {
  return (
    <div
      aria-hidden="true"
      data-variant={variant}
      className={cn(
        "pointer-events-none absolute inset-0 -z-10",
        variants[variant],
        fade && "pattern-fade",
        className,
      )}
    />
  );
}
