import { describe, expect, it } from "vitest";
import { PROJECT_COPY, PROJECTS, PROJECT_SLUGS, projectsByTier } from "./index";

const CURRENT_YEAR = new Date().getFullYear();
const LOCALES = Object.keys(PROJECT_COPY) as (keyof typeof PROJECT_COPY)[];

describe("PROJECTS", () => {
  it("lists every slug exactly once, in PROJECT_SLUGS order", () => {
    expect(PROJECTS.map((project) => project.slug)).toEqual([...PROJECT_SLUGS]);
  });

  it("has both featured and archived projects", () => {
    expect(projectsByTier("featured").length).toBeGreaterThan(0);
    expect(projectsByTier("archive").length).toBeGreaterThan(0);
  });

  it("featured projects all have a live demo", () => {
    for (const project of projectsByTier("featured")) {
      expect(project.links.demo, project.slug).not.toBeNull();
    }
  });

  describe.each(PROJECTS)("$slug", (project) => {
    it("has a plausible year range", () => {
      expect(project.period.start).toBeGreaterThanOrEqual(2020);
      expect(project.period.start).toBeLessThanOrEqual(CURRENT_YEAR);
      if (project.period.end !== undefined) {
        expect(project.period.end).toBeGreaterThan(project.period.start);
        expect(project.period.end).toBeLessThanOrEqual(CURRENT_YEAR);
      }
    });

    it("has 1–6 unique stack entries", () => {
      expect(project.stack.length).toBeGreaterThan(0);
      expect(project.stack.length).toBeLessThanOrEqual(6);
      expect(new Set(project.stack).size).toBe(project.stack.length);
    });

    it("links to a GitHub repo and an https demo", () => {
      expect(new URL(project.links.repo).hostname).toBe("github.com");
      if (project.links.demo !== null) {
        expect(new URL(project.links.demo).protocol).toBe("https:");
      }
    });
  });
});

describe("PROJECT_COPY", () => {
  describe.each(LOCALES)("%s", (locale) => {
    it.each(PROJECT_SLUGS)("%s has a concise description", (slug) => {
      const { description } = PROJECT_COPY[locale][slug];
      expect(description.trim()).not.toBe("");
      expect(description.length).toBeLessThanOrEqual(160);
    });
  });

  it("Polish copy is actually Polish", () => {
    const text = Object.values(PROJECT_COPY.pl)
      .map((copy) => copy.description)
      .join(" ");
    expect(text).toMatch(/[ąćęłńóśźż]/i);
  });
});