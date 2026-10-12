import {
  siClaude,
  siCloudinary,
  siNextdotjs,
  siPostgresql,
  siPrisma,
  siReact,
  siResend,
  siTailwindcss,
  siTypescript,
  siVite,
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
  postgresql: { label: "PostgreSQL", icon: siPostgresql },
  pgvector: { label: "pgvector", icon: null },
  prisma: { label: "Prisma", icon: siPrisma },
  authjs: { label: "Auth.js", icon: null },
  "claude-api": { label: "Claude API", icon: siClaude },
  resend: { label: "Resend", icon: siResend },
  cloudinary: { label: "Cloudinary", icon: siCloudinary },
  playwright: { label: "Playwright", icon: null },
  vue: { label: "Vue 3", icon: siVuedotjs },
  vuex: { label: "Vuex", icon: null },
  vite: { label: "Vite", icon: siVite },
} as const satisfies Record<string, TechDefinition>;

export type TechId = keyof typeof TECH;

export function getTech(id: TechId): TechDefinition {
  return TECH[id];
}