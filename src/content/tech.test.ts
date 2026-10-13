import { describe, expect, it } from "vitest";
import { PROJECTS } from "./projects";
import { TECH, type TechId } from "./tech";

const IDS = Object.keys(TECH) as TechId[];

describe("TECH", () => {
  it.each(IDS)("%s has a kebab-case id and a non-empty label", (id) => {
    expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    expect(TECH[id].label.trim()).not.toBe("");
  });

  it("has unique labels", () => {
    const labels = IDS.map((id) => TECH[id].label);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it("uses valid Simple Icons data", () => {
    for (const id of IDS) {
      const { icon } = TECH[id];
      if (icon === null) continue;
      expect(icon.hex, id).toMatch(/^[0-9A-F]{6}$/i);
      expect(icon.path.length, id).toBeGreaterThan(0);
    }
  });

  it("every project stack refers only to registered technologies", () => {
    for (const project of PROJECTS) {
      for (const id of project.stack) {
        expect(TECH, `${project.slug} → ${id}`).toHaveProperty(id);
      }
    }
  });
});