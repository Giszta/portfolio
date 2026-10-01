import { describe, expect, it } from "vitest";
import { getSocialLinks } from "./social";

const all = {
  github: "https://github.com/example",
  linkedin: "https://www.linkedin.com/in/example",
  email: "hello@example.com",
};

describe("getSocialLinks", () => {
  it("returns every configured channel in a fixed order", () => {
    expect(getSocialLinks(all).map((link) => link.key)).toEqual(["github", "linkedin", "email"]);
  });

  it("skips channels that are not configured", () => {
    const links = getSocialLinks({ ...all, linkedin: null, email: null });
    expect(links.map((link) => link.key)).toEqual(["github"]);
  });

  it("turns the email address into a mailto link", () => {
    const email = getSocialLinks(all).find((link) => link.key === "email");
    expect(email?.href).toBe("mailto:hello@example.com");
  });
});
