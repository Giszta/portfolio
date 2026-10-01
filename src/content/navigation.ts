export const NAV_SECTIONS = [
  "home",
  "about",
  "projects",
  "engineering",
  "technology",
  "contact",
] as const;

export type NavSection = (typeof NAV_SECTIONS)[number];
