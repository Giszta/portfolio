import { describe, expect, it } from "vitest";
import { buildRobots, buildSitemap } from "./sitemap";

const base = new URL("https://example.com");

describe("buildSitemap", () => {
  it("lists every locale of the home page with absolute URLs", () => {
    const urls = buildSitemap(base).map((entry) => entry.url);
    expect(urls).toEqual(["https://example.com/pl", "https://example.com/en"]);
  });

  it("links each entry to all language versions and x-default", () => {
    const [first] = buildSitemap(base);
    expect(first?.alternates?.languages).toEqual({
      pl: "https://example.com/pl",
      en: "https://example.com/en",
      "x-default": "https://example.com/en",
    });
  });

  it("expands every href into one entry per locale", () => {
    expect(buildSitemap(base, ["/", "/projects/forge"])).toHaveLength(4);
  });

  it("does not leak a localhost URL when given a production base", () => {
    const joined = buildSitemap(base).map((entry) => entry.url).join(" ");
    expect(joined).not.toContain("localhost");
  });
});

describe("buildRobots", () => {
  it("allows crawling and points to the sitemap", () => {
    expect(buildRobots(base)).toEqual({
      rules: [{ userAgent: "*", allow: "/" }],
      sitemap: "https://example.com/sitemap.xml",
    });
  });
});
