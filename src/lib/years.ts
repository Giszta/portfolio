import type { YearRange } from "@/content/projects";

export function formatYearRange({ start, end }: YearRange): string {
  return end === undefined ? String(start) : `${start}\u2013${end}`;
}