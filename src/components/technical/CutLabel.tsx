import { cn } from "@/lib/utils/cn";

export function formatCutMark(letter: string): string {
  const mark = letter.trim().charAt(0).toUpperCase();
  if (!mark) {
    throw new Error("formatCutMark: letter is required");
  }
  return `${mark}\u2013${mark}`;
}

export interface CutLabelProps {
  code: string;
  label?: string;
  className?: string;
}

export function CutLabel({ code, label, className }: CutLabelProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-sm border border-cut/60 bg-canvas px-2.5 py-1",
        "font-mono text-label whitespace-nowrap text-cut uppercase",
        className,
      )}
    >
      <span className="tabular-nums">{code}</span>
      {label && (
        <>
          <span aria-hidden="true">·</span>
          <span>{label}</span>
        </>
      )}
    </span>
  );
}
