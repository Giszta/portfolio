export const colorTokens = {
  background: ["canvas", "surface", "card", "surface-raised", "line", "line-strong"],
  text: ["fg", "fg-secondary", "fg-muted"],
  accent: ["accent", "accent-hover", "cyan", "amber"],
  status: ["success", "warning", "error", "info"],
  view: ["view-engineering", "view-software", "cut"],
} as const;

export type ColorGroup = keyof typeof colorTokens;

export const designPreview = {
  title: "Design System",
  intro:
    "Tokens, primitives and technical elements. Development preview — not rendered in production.",
  sections: {
    colors: "Color tokens",
    typography: "Typography",
    buttons: "Buttons",
    badges: "Badges, tags & status",
    cards: "Cards",
    technical: "Technical elements",
    motion: "Motion",
    sectionCut: "Section Cut",
  },
  typography: {
    display: "Engineer who codes.",
    body: "From engineering problems to software solutions. Building better tools for technical workflows.",
    mono: "DWG-0142 · REV 07 · TOL ±0.05 mm",
    polish: "Zażółć gęślą jaźń — polskie znaki diakrytyczne.",
  },
  buttons: {
    primary: "View projects",
    secondary: "Download CV",
    ghost: "Contact",
    disabled: "Disabled",
    icon: "Open menu",
  },
  badges: ["Shipped", "Prototype", "Concept", "Planned"],
  tags: ["TypeScript", "Next.js", "SolidWorks", "Python", "RAG"],
  status: {
    success: "Available",
    warning: "In progress",
    error: "Blocked",
    info: "Planned",
    neutral: "Archived",
  },
  card: {
    title: "FORGE",
    subtitle: "AI Design & Engineering Workspace",
    body: "Example card with corner marks and interactive state.",
  },
  technical: {
    badge: { code: "REV", value: "07" },
    measurement: { value: "1280", unit: "px" },
    coordinates: { x: 120, y: 48.5, z: -12 },
    sectionLabel: "Projects",
    divider: "A—A",
    dataPoints: [
      { value: "7+", label: "Years of engineering" },
      { value: "5", label: "Software projects" },
      { value: "2", label: "Languages", unit: "PL/EN" },
    ],
  },
  motion: {
    reveal: "Revealed on scroll (disabled with prefers-reduced-motion).",
  },
  sectionCut: {
    outline: "Engineer",
    solid: "who codes.",
    views: { engineering: "Engineering view", software: "Software view" },
    cuts: [
      { letter: "B", label: "FORGE" },
      { letter: "C", label: "NEXUS" },
    ],
    numbered: { code: "01", label: "Two views" },
    engineeringTags: ["SolidWorks", "Manufacturing"],
    softwareTags: ["TypeScript", "Next.js"],
  },
} as const;
