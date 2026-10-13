import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type ProjectLinkVariant = "primary" | "secondary";

const variants: Record<ProjectLinkVariant, string> = {
  primary: "border-accent/60 bg-accent/10 text-fg hover:bg-accent/20",
  secondary: "border-line text-fg-secondary hover:border-line-strong hover:text-fg",
};

interface ProjectLinkProps {
  href: string;
  label: string;
  variant?: ProjectLinkVariant;
  children: ReactNode;
}

export function ProjectLink({ href, label, variant = "secondary", children }: ProjectLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-xs border px-4 font-mono text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        variants[variant],
      )}
    >
      {children}
    </a>
  );
}