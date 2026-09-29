import { cn } from "@/lib/utils/cn";

export type CutOrientation = "vertical" | "horizontal";
type Look = "left" | "right" | "up" | "down";

interface CutLineBase {
  mark?: string;
  subtle?: boolean;
  className?: string;
}

export type CutLineProps =
  | (CutLineBase & { orientation: "vertical"; look?: "left" | "right" })
  | (CutLineBase & { orientation: "horizontal"; look?: "up" | "down" });

const arrows: Record<Look, string> = { left: "◀", right: "▶", up: "▲", down: "▼" };

export function dashDotGradient(orientation: CutOrientation): string {
  const direction = orientation === "vertical" ? "to bottom" : "to right";
  return `repeating-linear-gradient(${direction}, currentColor 0 24px, transparent 24px 30px, currentColor 30px 34px, transparent 34px 40px)`;
}

export function CutLine(props: CutLineProps) {
  const { orientation, mark, subtle = false, className } = props;
  const isVertical = orientation === "vertical";
  const look: Look = props.look ?? (isVertical ? "left" : "up");

  const marker = mark ? (
    <span data-cut-marker="" className="flex shrink-0 items-center gap-1 font-mono text-label">
      <span>{arrows[look]}</span>
      <span>{mark}</span>
    </span>
  ) : null;

  return (
    <div
      aria-hidden="true"
      data-orientation={orientation}
      className={cn(
        "flex items-center gap-2 text-cut",
        isVertical ? "h-full flex-col" : "w-full flex-row",
        subtle && "opacity-30",
        className,
      )}
    >
      {marker}
      <span
        className={cn("flex-1", isVertical ? "w-[1.5px]" : "h-[1.5px]")}
        style={{ backgroundImage: dashDotGradient(orientation) }}
      />
      {marker}
    </div>
  );
}
