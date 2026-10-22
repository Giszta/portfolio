import { describe, expect, it } from "vitest";
import { buildPersonJsonLd, serializeJsonLd } from "./structuredData";

const input = {
  name: "Adam Giszter",
  url: "https://example.com/en",
  jobTitle: "Engineer",
  description: "Desc",
  sameAs: ["https://github.com/x", null, "https://linkedin.com/in/x"],
  knowsAbout: ["TypeScript"],
  countryCode: "PL",
} as const;

describe("buildPersonJsonLd", () => {
  it("builds a schema.org Person", () => {
    const data = buildPersonJsonLd(input);
    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("Person");
    expect(data.address).toEqual({ "@type": "PostalAddress", addressCountry: "PL" });
  });

  it("drops missing profile links", () => {
    expect(buildPersonJsonLd(input).sameAs).toEqual([
      "https://github.com/x",
      "https://linkedin.com/in/x",
    ]);
  });
});

describe("serializeJsonLd", () => {
  it("escapes < so the payload cannot close the script tag", () => {
    const json = serializeJsonLd({ name: "</script><b>" });
    expect(json).not.toContain("<");
    expect(JSON.parse(json)).toEqual({ name: "</script><b>" });
  });
});
