import { useTranslations } from "next-intl";
import { Tag } from "@/components/ui";
import { TechChip } from "@/components/projects/TechChip";
import type { StackItem } from "@/content/stack";
import type { View } from "@/types/view";

interface StackChipProps {
  item: StackItem;
  view: View;
}

/** Marka z `TECH` (z ikoną, jeśli jest) albo tłumaczone pojęcie z messages. */
export function StackChip({ item, view }: StackChipProps) {
  const t = useTranslations("technology.terms");

  if (item.kind === "tech") {
    return <TechChip id={item.id} as="li" view={view} />;
  }

  return (
    <Tag as="li" view={view}>
      {t(item.id)}
    </Tag>
  );
}
