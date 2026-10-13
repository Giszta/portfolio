import type { ProjectSlug } from "./slugs";
import type { ProjectCopy } from "./types";

export const projectsEn: Readonly<Record<ProjectSlug, ProjectCopy>> = {
  nexus: {
    description:
      "A support workspace where AI analyses each ticket and drafts a reply from the knowledge base, and a human approves it.",
  },
  "support-tickets": {
    description:
      "A helpdesk with three roles, a change history for every ticket, filters stored in the URL and E2E tests. The predecessor of NEXUS.",
  },
  "twoj-doradca": {
    description:
      "A landing page for a renewable energy advisory business, with a multi-step form that asks different questions for each of 6 products.",
  },
  fotoroman: {
    description:
      "A website with my dad's photography. The first version in plain JS, the current one in Next.js with a Cloudinary gallery.",
  },
  postly: {
    description: "A Vue 3 and Vuex forum, built to compare the Vue ecosystem with React.",
  },
  "sliding-puzzle": {
    description: "A 15-puzzle game in React that guarantees every board can be solved.",
  },
  "portfolio-v1": {
    description: "My first portfolio. Its limitations became the requirements for this site.",
  },
};