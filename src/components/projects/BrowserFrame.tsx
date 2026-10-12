import type { ReactNode } from "react";
import { displayHost } from "@/lib/url";
import { cn } from "@/lib/utils/cn";

interface BrowserFrameProps {
  url: string;
  children: ReactNode;
  className?: string;
}

export function BrowserFrame({ url, children, className }: BrowserFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-line bg-card shadow-[0_24px_50px_-24px_rgb(0_0_0/0.8)]",
        className,
      )}
    >
      <div
        aria-hidden="true"
        data-testid="browser-chrome"
        className="flex h-7 items-center gap-1.5 border-b border-line bg-surface-raised px-2.5"
      >
        <span className="size-2 rounded-full bg-line-strong" />
        <span className="size-2 rounded-full bg-line-strong" />
        <span className="size-2 rounded-full bg-line-strong" />
        <span className="ml-2.5 max-w-[60%] min-w-0 truncate rounded-sm border border-line bg-canvas px-2 py-0.5 font-mono text-[0.65rem] text-fg-muted">
          {displayHost(url)}
        </span>
      </div>
      <div className="relative aspect-[16/10] bg-canvas">{children}</div>
    </div>
  );
}