import { cn } from "@/lib/utils/cn";

const corners = [
  "left-0 top-0 border-l border-t",
  "right-0 top-0 border-r border-t",
  "bottom-0 left-0 border-b border-l",
  "bottom-0 right-0 border-b border-r",
] as const;

export interface CornerMarksProps {
  className?: string;
}

export function CornerMarks({ className }: CornerMarksProps) {
  return (
    <span
      data-corner-marks=""
      aria-hidden="true"
      className="pointer-events-none absolute -inset-px"
    >
      {corners.map((position) => (
        <span
          key={position}
          className={cn("absolute size-2.5 border-accent/70", position, className)}
        />
      ))}
    </span>
  );
}
