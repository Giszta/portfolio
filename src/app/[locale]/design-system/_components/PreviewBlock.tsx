import type { ReactNode } from "react";
import { SectionLabel } from "@/components/technical";
import { Divider } from "@/components/ui";

interface PreviewBlockProps {
  index: number;
  title: string;
  children: ReactNode;
}

export function PreviewBlock({ index, title, children }: PreviewBlockProps) {
  return (
    <section className="flex flex-col gap-6">
      <SectionLabel index={index} label={title} />
      <Divider decorative />
      {children}
    </section>
  );
}
