import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import pl from "../../messages/pl.json";
import { NAV_SECTIONS } from "./navigation";

describe("NAV_SECTIONS", () => {
  it("has unique ids", () => {
    expect(new Set(NAV_SECTIONS).size).toBe(NAV_SECTIONS.length);
  });

  it.each(NAV_SECTIONS)("%s has a navigation label in every locale", (section) => {
    expect(en.navigation).toHaveProperty(section);
    expect(pl.navigation).toHaveProperty(section);
  });
});
