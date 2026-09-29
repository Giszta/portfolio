export type View = "engineering" | "software";

export const VIEWS = ["engineering", "software"] as const satisfies readonly View[];
