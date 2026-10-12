export const PROJECT_SLUGS = [
  "nexus",
  "support-tickets",
  "twoj-doradca",
  "fotoroman",
  "postly",
  "sliding-puzzle",
  "portfolio-v1",
] as const;

export type ProjectSlug = (typeof PROJECT_SLUGS)[number];