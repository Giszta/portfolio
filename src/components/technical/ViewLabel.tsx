import { cn } from "@/lib/utils/cn";
import type { View } from "@/types/view";

const config: Record<View, { className: string; arrow: string; arrowFirst: boolean }> = {
  engineering: { className: "text-view-engineering", arrow: "◁", arrowFirst: true },
  software: { className: "text-view-software", arrow: "▷", arrowFirst: false },
};

export interface ViewLabelProps {
  view: View;
  label: string;
  className?: string;
}

export function ViewLabel({ view, label, className }: ViewLabelProps) {
  const { className: viewClass, arrow, arrowFirst } = config[view];
  const arrowEl = <span aria-hidden="true">{arrow}</span>;

  return (
    <span
      data-view={view}
      className={cn(
        "inline-flex items-center gap-2 font-mono text-label uppercase",
        viewClass,
        className,
      )}
    >
      {arrowFirst && arrowEl}
      <span>{label}</span>
      {!arrowFirst && arrowEl}
    </span>
  );
}
