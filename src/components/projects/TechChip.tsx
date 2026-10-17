import type { TagProps } from "@/components/ui";
import { Tag } from "@/components/ui";
import { getTech, type TechId } from "@/content/tech";
import { brandColorOrNull } from "@/lib/a11y/brandColor";
import type { View } from "@/types/view";

export const TECH_CHIP_BACKGROUND = "#0b0f14";

interface TechChipProps {
  id: TechId;
  as?: TagProps["as"];
  view?: View;
}

export function TechChip({ id, as = "span", view }: TechChipProps) {
  const { label, icon } = getTech(id);
  const color = icon ? (brandColorOrNull(icon.hex, TECH_CHIP_BACKGROUND) ?? "currentColor") : null;

  return (
    <Tag as={as} view={view} data-tech={id} className="gap-1.5">
      {icon && color && (
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 24 24"
          fill={color}
          className="size-3.5 shrink-0"
        >
          <path d={icon.path} />
        </svg>
      )}
      {label}
    </Tag>
  );
}
