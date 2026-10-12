import type { ProjectSlug } from "./slugs";

export type ProjectTier = "featured" | "archive";

export interface YearRange {
  start: number;
  end?: number;
}

export interface ProjectLinks {
  repo: string;
  demo: string | null;
}

export interface Project {
  slug: ProjectSlug;
  name: string;
  tier: ProjectTier;
  period: YearRange;
  stack: readonly string[];
  links: ProjectLinks;
}

export interface ProjectCopy {
  description: string;
}