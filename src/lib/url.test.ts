import { describe, expect, it } from "vitest";
import { displayHost } from "./url";

describe("displayHost", () => {
  it("returns the host without protocol and path", () => {
    expect(displayHost("https://nexus-nine-psi-67.vercel.app/dashboard")).toBe(
      "nexus-nine-psi-67.vercel.app",
    );
  });

  it("strips a leading www.", () => {
    expect(displayHost("https://www.fotoroman.pl")).toBe("fotoroman.pl");
  });

  it("throws on an invalid URL instead of rendering garbage", () => {
    expect(() => displayHost("fotoroman")).toThrow();
  });
});