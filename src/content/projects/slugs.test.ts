import { describe, expect, it } from "vitest";
import en from "../../../messages/en.json";
import pl from "../../../messages/pl.json";
import { isProjectSlug, PROJECT_SLUGS } from "./slugs";

describe("isProjectSlug", () => {
  it.each(PROJECT_SLUGS)("accepts %s", (slug) => {
    expect(isProjectSlug(slug)).toBe(true);
  });

  it.each(["", "FORGE", "forge/", "unknown"])("rejects %j", (value) => {
    expect(isProjectSlug(value)).toBe(false);
  });
});

describe("project translations", () => {
  it.each(PROJECT_SLUGS)("%s has a title and subtitle in every locale", (slug) => {
    for (const messages of [en, pl]) {
      expect(messages.caseStudies).toHaveProperty([slug, "title"]);
      expect(messages.caseStudies).toHaveProperty([slug, "subtitle"]);
    }
  });
});
