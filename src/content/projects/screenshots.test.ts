import { describe, expect, it } from "vitest";
import { projectsByTier } from "./index";
import { getScreenshot } from "./screenshots";

const LOCALES = ["pl", "en"] as const;

describe("getScreenshot", () => {
  it.each(projectsByTier("featured").map((project) => project.slug))(
    "%s has a screenshot with a meaningful alt text in every locale",
    (slug) => {
      for (const locale of LOCALES) {
        const screenshot = getScreenshot(slug, locale);
        expect(screenshot, `${slug}/${locale}`).not.toBeNull();
        expect(screenshot?.alt.length ?? 0).toBeGreaterThan(40);
      }
    },
  );

  it("archived projects have no screenshot", () => {
    for (const project of projectsByTier("archive")) {
      expect(getScreenshot(project.slug, "en")).toBeNull();
    }
  });

  it("Polish alt texts are actually Polish", () => {
    expect(getScreenshot("nexus", "pl")?.alt).toMatch(/[ąćęłńóśźż]/i);
  });
});