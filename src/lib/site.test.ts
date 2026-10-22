import { describe, expect, it } from "vitest";
import { resolveSiteUrl } from "./site";

describe("resolveSiteUrl", () => {
  it("prefers an explicit site URL", () => {
    const url = resolveSiteUrl({
      NEXT_PUBLIC_SITE_URL: "https://example.com",
      VERCEL_PROJECT_PRODUCTION_URL: "portfolio.vercel.app",
    });
    expect(url.origin).toBe("https://example.com");
  });

  it("falls back to the Vercel production URL and adds the protocol", () => {
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "portfolio.vercel.app" }).origin).toBe(
      "https://portfolio.vercel.app",
    );
  });

  it("ignores blank values", () => {
    const url = resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "  ", VERCEL_PROJECT_PRODUCTION_URL: "" });
    expect(url.origin).toBe("http://localhost:3000");
  });

  it("uses localhost when nothing is set", () => {
    expect(resolveSiteUrl({}).origin).toBe("http://localhost:3000");
  });
});
