import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { CornerMarks } from "@/components/technical/CornerMarks";

export type CardElement = "div" | "article" | "li" | "section";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: CardElement;
  interactive?: boolean;
  corners?: boolean;
}

export function Card({
  as: Component = "div",
  interactive = false,
  corners = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <Component
      className={cn(
        "relative rounded-md border border-line bg-card p-6",
        interactive &&
          "transition-[border-color,box-shadow,translate] duration-300 ease-standard " +
            "focus-within:border-accent/50 hover:border-accent/50 hover:shadow-glow-soft " +
            "motion-safe:hover:-translate-y-0.5",
        className,
      )}
      {...props}
    >
      {corners && <CornerMarks />}
      {children}
    </Component>
  );
}
