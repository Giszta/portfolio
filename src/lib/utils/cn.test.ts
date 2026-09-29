import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("joins conditional classes", () => {
    const isActive = false;
    expect(cn("px-4", isActive && "text-accent", undefined, "py-2")).toBe("px-4 py-2");
  });

  it("lets later classes override conflicting earlier ones", () => {
    expect(cn("px-4 text-fg", "px-6")).toBe("text-fg px-6");
    expect(cn("bg-card", "bg-surface")).toBe("bg-surface");
  });

  it("treats custom font sizes and text colors as separate groups", () => {
    expect(cn("text-label", "text-fg-muted")).toBe("text-label text-fg-muted");
    expect(cn("text-display-xl", "text-display-md")).toBe("text-display-md");
  });

  it("knows custom shadow tokens", () => {
    expect(cn("shadow-glow", "shadow-none")).toBe("shadow-none");
  });
});
