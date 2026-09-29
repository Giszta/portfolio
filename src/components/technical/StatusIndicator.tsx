import { cn } from "@/lib/utils/cn";

export type Status = "success" | "warning" | "error" | "info" | "neutral";

const dots: Record<Status, string> = {
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
  info: "bg-info",
  neutral: "bg-fg-muted",
};

export interface StatusIndicatorProps {
  status: Status;
  label: string;
  pulse?: boolean;
  className?: string;
}

export function StatusIndicator({ status, label, pulse = false, className }: StatusIndicatorProps) {
  return (
    <span
      data-status={status}
      className={cn(
        "inline-flex items-center gap-2 font-mono text-label text-fg-secondary uppercase",
        className,
      )}
    >
      <span aria-hidden="true" className="relative inline-flex size-2">
        {pulse && (
          <span
            data-pulse=""
            className={cn(
              "absolute inset-0 rounded-full motion-safe:animate-pulse-soft",
              dots[status],
            )}
          />
        )}
        <span className={cn("relative size-2 rounded-full", dots[status])} />
      </span>
      <span>{label}</span>
    </span>
  );
}
