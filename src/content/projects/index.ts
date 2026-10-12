import type { Locale } from "next-intl";
import { projectsEn } from "./en";
import { projectsPl } from "./pl";
import { PROJECTS } from "./projects";
import type { ProjectSlug } from "./slugs";
import type { Project, ProjectCopy, ProjectTier } from "./types";

export { PROJECTS } from "./projects";
export { PROJECT_SLUGS } from "./slugs";
export type { ProjectSlug } from "./slugs";
export type { Project, ProjectCopy, ProjectLinks, ProjectTier, YearRange } from "./types";

export const PROJECT_COPY: Readonly<Record<Locale, Readonly<Record<ProjectSlug, ProjectCopy>>>> = {
  pl: projectsPl,
  en: projectsEn,
};

export function projectsByTier(tier: ProjectTier): Project[] {
  return PROJECTS.filter((project) => project.tier === tier);
}

export function getProjectCopy(slug: ProjectSlug, locale: Locale): ProjectCopy {
  return PROJECT_COPY[locale][slug];
}