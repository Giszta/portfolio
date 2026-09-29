import { cn } from "@/lib/utils/cn";

export interface Coordinates {
  x: number;
  y: number;
  z?: number;
}

const AXES = ["x", "y", "z"] as const;

export function formatCoordinate(value: number, precision = 2): string {
  const sign = value < 0 ? "-" : "+";
  const [integer = "0", decimal] = Math.abs(value).toFixed(precision).split(".");
  return `${sign}${integer.padStart(3, "0")}${decimal ? `.${decimal}` : ""}`;
}

export interface CoordinateLabelProps {
  coordinates: Coordinates;
  precision?: number;
  className?: string;
}

export function CoordinateLabel({ coordinates, precision = 2, className }: CoordinateLabelProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex gap-3 font-mono text-label text-fg-muted uppercase tabular-nums",
        className,
      )}
    >
      {AXES.map((axis) => {
        const value = coordinates[axis];
        if (value === undefined) return null;
        return (
          <span key={axis}>
            <span className="text-cyan">{axis}</span> {formatCoordinate(value, precision)}
          </span>
        );
      })}
    </span>
  );
}
