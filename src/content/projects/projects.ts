import type { Project } from "./types";

export const PROJECTS: readonly Project[] = [
  {
    slug: "nexus",
    name: "NEXUS",
    tier: "featured",
    period: { start: 2026 },
    stack: ["Next.js", "TypeScript", "PostgreSQL", "pgvector", "Claude API"],
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
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Auth.js", "Playwright"],
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
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Motion", "Resend"],
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
    stack: ["Next.js", "TypeScript", "Cloudinary", "Tailwind CSS"],
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
    stack: ["Vue 3", "TypeScript", "Vuex", "Vite"],
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
    stack: ["React", "TypeScript", "Vite"],
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
    stack: ["Next.js", "TypeScript", "Framer Motion", "Resend"],
    links: {
      repo: "https://github.com/Giszta/portfolio-website",
      demo: null,
    },
  },
];