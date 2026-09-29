export const PROJECT_SLUGS = ["forge", "nexus", "engineering-automation"] as const;

export type ProjectSlug = (typeof PROJECT_SLUGS)[number];

export function isProjectSlug(value: string): value is ProjectSlug {
  return (PROJECT_SLUGS as readonly string[]).includes(value);
}
