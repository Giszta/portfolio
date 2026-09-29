import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import type { View } from "@/types/view";

export type TagElement = "span" | "li";

const views: Record<View, string> = {
  engineering: "border-dashed border-view-engineering/45 bg-transparent text-view-engineering",
  software: "",
};

export interface TagProps extends HTMLAttributes<HTMLElement> {
  as?: TagElement;
  view?: View;
}

export function Tag({ as: Component = "span", view, className, ...props }: TagProps) {
  return (
    <Component
      data-view={view}
      className={cn(
        "inline-flex w-fit items-center rounded-xs border border-line bg-surface px-2 py-1 font-mono text-xs text-fg-secondary",
        view && views[view],
        className,
      )}
      {...props}
    />
  );
}
