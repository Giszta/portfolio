import { cn } from "@/lib/utils/cn";

export interface TechnicalDividerProps {
  code?: string;
  className?: string;
}

export function TechnicalDivider({ code, className }: TechnicalDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex w-full items-center gap-3 text-line-strong", className)}
    >
      <span className="h-2 w-px bg-current" />
      <span className="h-px flex-1 bg-line" />
      {code && <span className="font-mono text-label text-fg-muted uppercase">{code}</span>}
      <span className="h-px flex-1 bg-line" />
      <span className="h-2 w-px bg-current" />
    </div>
  );
}
