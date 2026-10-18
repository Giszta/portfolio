import { describe, expect, it } from "vitest";
import { siteConfig } from "@/content/site";
import { readMailConfig } from "./config";

describe("readMailConfig", () => {
  it("is null without an API key", () => {
    expect(readMailConfig({})).toBeNull();
    expect(readMailConfig({ RESEND_API_KEY: "   " })).toBeNull();
  });

  it("falls back to the site email and the Resend test sender", () => {
    expect(readMailConfig({ RESEND_API_KEY: "key" })).toEqual({
      apiKey: "key",
      to: siteConfig.links.email,
      from: "Portfolio <onboarding@resend.dev>",
    });
  });

  it("uses explicit recipient and sender when given", () => {
    expect(
      readMailConfig({
        RESEND_API_KEY: "key",
        CONTACT_TO_EMAIL: "me@example.com",
        CONTACT_FROM_EMAIL: "Site <hello@example.com>",
      }),
    ).toEqual({ apiKey: "key", to: "me@example.com", from: "Site <hello@example.com>" });
  });
});
