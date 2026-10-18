import { describe, expect, it } from "vitest";
import { heroEnter } from "./enter";

describe("heroEnter", () => {
  it("defaults to the fade variant and carries the order as --i", () => {
    const props = heroEnter(3);
    expect(props["data-hero-enter"]).toBe("fade");
    expect(props.style).toEqual({ "--i": 3 });
  });

  it("supports the transform-only variant", () => {
    expect(heroEnter(2, "rise")["data-hero-enter"]).toBe("rise");
  });
});
