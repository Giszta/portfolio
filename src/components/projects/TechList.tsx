import type { TechId } from "@/content/tech";
import { cn } from "@/lib/utils/cn";
import { TechChip } from "./TechChip";

interface TechListProps {
  stack: readonly TechId[];
  label: string;
  className?: string;
}

export function TechList({ stack, label, className }: TechListProps) {
  return (
    <ul aria-label={label} className={cn("flex flex-wrap gap-1.5", className)}>
      {stack.map((id) => (
        <TechChip key={id} id={id} as="li" />
      ))}
    </ul>
  );
}