import { describe, expect, it } from "vitest";
import { PROJECT_SLUGS } from "./slugs";

describe("PROJECT_SLUGS", () => {
  it("are unique", () => {
    expect(new Set(PROJECT_SLUGS).size).toBe(PROJECT_SLUGS.length);
  });

  it.each(PROJECT_SLUGS)("%s is kebab-case", (slug) => {
    expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });
});