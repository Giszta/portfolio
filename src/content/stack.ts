import type { View } from "@/types/view";
import type { TechId } from "./tech";

/** Pojęcia, których nazwa zależy od języka — etykiety w messages: technology.terms.<id>. */
export type StackTermId =
  "modelling-3d" | "technical-documentation" | "solidworks-macros" | "excel-vba";

/** Element grupy: marka z `TECH` (ta sama nazwa w każdym języku) albo tłumaczone pojęcie. */
export type StackItem =
  | { readonly kind: "tech"; readonly id: TechId }
  | { readonly kind: "term"; readonly id: StackTermId };

export type StackGroupId = "interface" | "backend" | "automation" | "quality" | "engineering";

export interface StackGroup {
  readonly id: StackGroupId;
  /** Który świat reprezentuje grupa — steruje stylem chipów. */
  readonly view: View;
  readonly items: readonly StackItem[];
}

const tech = (id: TechId): StackItem => ({ kind: "tech", id });
const term = (id: StackTermId): StackItem => ({ kind: "term", id });

export const STACK = [
  {
    id: "interface",
    view: "software",
    items: [
      tech("typescript"),
      tech("react"),
      tech("nextjs"),
      tech("tailwind-css"),
      tech("motion"),
    ],
  },
  {
    id: "backend",
    view: "software",
    items: [tech("nodejs"), tech("rest-api"), tech("postgresql"), tech("prisma"), tech("pgvector")],
  },
  {
    id: "automation",
    view: "software",
    items: [
      tech("claude-api"),
      tech("rag"),
      term("solidworks-macros"),
      term("excel-vba"),
    ],
  },
  {
    id: "quality",
    view: "software",
    items: [
      tech("vitest"),
      tech("playwright"),
      tech("git"),
    ],
  },
  {
    id: "engineering",
    view: "engineering",
    items: [tech("solidworks"), tech("solidedge"), tech("inventor"), tech("creo"), tech("autocad"), tech("draftsight"), tech("kicad"), ],
  },
] as const satisfies readonly StackGroup[];
