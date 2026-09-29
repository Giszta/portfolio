import { cn } from "@/lib/utils/cn";

export type MeasurementOrientation = "horizontal" | "vertical";

export interface MeasurementLineProps {
  value?: string;
  unit?: string;
  orientation?: MeasurementOrientation;
  className?: string;
}

export function MeasurementLine({
  value,
  unit,
  orientation = "horizontal",
  className,
}: MeasurementLineProps) {
  const isHorizontal = orientation === "horizontal";
  const tick = isHorizontal ? "h-3 w-px" : "h-px w-3";
  const line = isHorizontal ? "h-px flex-1" : "w-px flex-1";

  return (
    <div
      aria-hidden="true"
      data-orientation={orientation}
      className={cn(
        "flex items-center gap-2 text-amber/70",
        isHorizontal ? "w-full flex-row" : "h-full flex-col",
        className,
      )}
    >
      <span className={cn("shrink-0 bg-current", tick)} />
      <span className={cn("bg-current opacity-50", line)} />
      {value && (
        <span
          className={cn(
            "shrink-0 font-mono text-label text-amber tabular-nums",
            !isHorizontal && "rotate-180 [writing-mode:vertical-rl]",
          )}
        >
          {value}
          {unit && <span className="ml-1 text-fg-muted">{unit}</span>}
        </span>
      )}
      <span className={cn("bg-current opacity-50", line)} />
      <span className={cn("shrink-0 bg-current", tick)} />
    </div>
  );
}
