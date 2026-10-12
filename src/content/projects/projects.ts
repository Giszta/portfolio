import type { Project } from "./types";

export const PROJECTS: readonly Project[] = [
  {
    slug: "nexus",
    name: "NEXUS",
    tier: "featured",
    period: { start: 2026 },
    stack: ["nextjs", "typescript", "postgresql", "pgvector", "claude-api"],
    links: {
      repo: "https://github.com/Giszta/Nexus",
      demo: "https://nexus-nine-psi-67.vercel.app",
    },
  },
  {
    slug: "support-tickets",
    name: "Support Tickets Dashboard",
    tier: "featured",
    period: { start: 2026 },
    stack: ["nextjs", "typescript", "postgresql", "prisma", "authjs", "playwright"],
    links: {
      repo: "https://github.com/Giszta/ticket-dashboard",
      demo: "https://ticket-dashboard-black.vercel.app",
    },
  },
  {
    slug: "twoj-doradca",
    name: "Twój Doradca",
    tier: "featured",
    period: { start: 2025 },
    stack: ["nextjs", "typescript", "tailwind-css", "motion", "resend"],
    links: {
      repo: "https://github.com/Giszta/twoj-doradca",
      demo: "https://twojdoradca.pl",
    },
  },
  {
    slug: "fotoroman",
    name: "Fotoroman",
    tier: "featured",
    period: { start: 2023, end: 2025 },
    stack: ["nextjs", "typescript", "cloudinary", "tailwind-css"],
    links: {
      repo: "https://github.com/Giszta/photography-portfolio",
      demo: "https://www.fotoroman.pl",
    },
  },
  {
    slug: "postly",
    name: "Postly",
    tier: "archive",
    period: { start: 2025 },
    stack: ["vue", "typescript", "vuex", "vite"],
    links: {
      repo: "https://github.com/Giszta/Postly",
      demo: "https://postly-seven.vercel.app",
    },
  },
  {
    slug: "sliding-puzzle",
    name: "Sliding Puzzle",
    tier: "archive",
    period: { start: 2023 },
    stack: ["react", "typescript", "vite"],
    links: {
      repo: "https://github.com/Giszta/sliding-game---react-practice",
      demo: "https://sliding-game-65029.web.app",
    },
  },
  {
    slug: "portfolio-v1",
    name: "Portfolio v1",
    tier: "archive",
    period: { start: 2025 },
    stack: ["nextjs", "typescript", "framer-motion", "resend"],
    links: {
      repo: "https://github.com/Giszta/portfolio-website",
      demo: null,
    },
  },
];