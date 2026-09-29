import { cn } from "@/lib/utils/cn";

export interface TechnicalBadgeProps {
  code: string;
  value: string;
  className?: string;
}

export function TechnicalBadge({ code, value, className }: TechnicalBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-stretch overflow-hidden rounded-xs border border-line-strong font-mono text-label uppercase",
        className,
      )}
    >
      <span className="bg-surface-raised px-1.5 py-0.5 text-fg-muted">{code}</span>
      <span className="px-1.5 py-0.5 text-fg-secondary tabular-nums">{value}</span>
    </span>
  );
}
