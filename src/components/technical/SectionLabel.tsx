import { cn } from "@/lib/utils/cn";

export function formatSectionIndex(index: number): string {
  return String(index).padStart(2, "0");
}

export interface SectionLabelProps {
  index: number;
  label: string;
  className?: string;
}

export function SectionLabel({ index, label, className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 font-mono text-label text-fg-muted uppercase",
        className,
      )}
    >
      <span className="text-accent tabular-nums">{formatSectionIndex(index)}</span>
      <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
      <span>{label}</span>
    </p>
  );
}
