import type { ReactNode } from "react";
import { Container, Section, type SectionTone } from "@/components/ui";
import type { NavSection } from "@/content/navigation";
import { cn } from "@/lib/utils/cn";

interface SectionShellProps {
  id: NavSection;
  title: string;
  tone?: SectionTone;
  className?: string;
  children?: ReactNode;
}

export function SectionShell({ id, title, tone, className, children }: SectionShellProps) {
  const headingId = `${id}-title`;

  return (
    <Section
      id={id}
      aria-labelledby={headingId}
      tone={tone}
      className={cn("min-h-[60dvh]", className)}
    >
      <Container>
        <h2 id={headingId} className="font-display text-display-md text-fg">
          {title}
        </h2>
        {children}
      </Container>
    </Section>
  );
}
