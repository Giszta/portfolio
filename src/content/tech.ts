import {
  siClaude,
  siCloudinary,
  siGit,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPrisma,
  siPython,
  siReact,
  siResend,
  siTailwindcss,
  siTestinglibrary,
  siTypescript,
  siVite,
  siVitest,
  siVuedotjs,
  type SimpleIcon,
} from "simple-icons";

export interface TechDefinition {
  label: string;
  icon: SimpleIcon | null;
}

export const TECH = {
  nextjs: { label: "Next.js", icon: siNextdotjs },
  react: { label: "React", icon: siReact },
  typescript: { label: "TypeScript", icon: siTypescript },
  "tailwind-css": { label: "Tailwind CSS", icon: siTailwindcss },
  motion: { label: "Motion", icon: null },
  "framer-motion": { label: "Framer Motion", icon: null },
  nodejs: { label: "Node.js", icon: siNodedotjs },
  "rest-api": { label: "REST API", icon: null },
  postgresql: { label: "PostgreSQL", icon: siPostgresql },
  pgvector: { label: "pgvector", icon: null },
  prisma: { label: "Prisma", icon: siPrisma },
  authjs: { label: "Auth.js", icon: null },
  "claude-api": { label: "Claude API", icon: siClaude },
  rag: { label: "RAG", icon: null },
  python: { label: "Python", icon: siPython },
  resend: { label: "Resend", icon: siResend },
  cloudinary: { label: "Cloudinary", icon: siCloudinary },
  vitest: { label: "Vitest", icon: siVitest },
  "testing-library": { label: "Testing Library", icon: siTestinglibrary },
  playwright: { label: "Playwright", icon: null },
  git: { label: "Git", icon: siGit },
  "ci-cd": { label: "CI/CD", icon: null },
  solidworks: { label: "SolidWorks", icon: null },
  vue: { label: "Vue 3", icon: siVuedotjs },
  vuex: { label: "Vuex", icon: null },
  vite: { label: "Vite", icon: siVite },
  solidedge: { label: "Solid Edge", icon: null },
  inventor: { label: "Inventor", icon: null },
  creo: { label: "Creo", icon: null },
  draftsight: { label: "DraftSight", icon: null },
  kicad: { label: "KiCad", icon: null },
  autocad: { label: "AutoCAD", icon: null },
} as const satisfies Record<string, TechDefinition>;

export type TechId = keyof typeof TECH;

export function getTech(id: TechId): TechDefinition {
  return TECH[id];
}
