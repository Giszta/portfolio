import { cn } from "@/lib/utils/cn";

export interface DataPointProps {
  value: string;
  label: string;
  unit?: string;
  className?: string;
}

export function DataPoint({ value, label, unit, className }: DataPointProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <dt className="order-2 font-mono text-label text-fg-muted uppercase">{label}</dt>
      <dd className="order-1 font-display text-display-md font-semibold text-fg tabular-nums">
        {value}
        {unit && <span className="ml-1 font-sans text-base font-normal text-fg-muted">{unit}</span>}
      </dd>
    </div>
  );
}
