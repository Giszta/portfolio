import { cn } from "@/lib/utils/cn";

export type DividerOrientation = "horizontal" | "vertical";

export interface DividerProps {
  orientation?: DividerOrientation;
  /** true → czysto wizualny (ukryty przed czytnikami). false → semantyczny separator. */
  decorative?: boolean;
  className?: string;
}

export function Divider({
  orientation = "horizontal",
  decorative = false,
  className,
}: DividerProps) {
  const isHorizontal = orientation === "horizontal";
  const classes = cn(
    "shrink-0 border-0 bg-line",
    isHorizontal ? "h-px w-full" : "w-px self-stretch",
    className,
  );

  if (decorative) {
    return <div aria-hidden="true" className={classes} />;
  }

  if (isHorizontal) {
    return <hr className={classes} />;
  }

  return <div role="separator" aria-orientation="vertical" className={classes} />;
}
