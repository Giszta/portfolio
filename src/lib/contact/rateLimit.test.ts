import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rateLimit";

function setup(limit = 2, windowMs = 1000) {
  let time = 0;
  const limiter = createRateLimiter({ limit, windowMs, now: () => time });
  return { limiter, advance: (ms: number) => (time += ms) };
}

describe("createRateLimiter", () => {
  it("allows up to the limit and then refuses", () => {
    const { limiter } = setup();
    expect(limiter.take("a")).toBe(true);
    expect(limiter.take("a")).toBe(true);
    expect(limiter.take("a")).toBe(false);
  });

  it("counts every key separately", () => {
    const { limiter } = setup(1);
    expect(limiter.take("a")).toBe(true);
    expect(limiter.take("b")).toBe(true);
    expect(limiter.take("a")).toBe(false);
  });

  it("frees the slot once the window has passed", () => {
    const { limiter, advance } = setup(1, 1000);
    expect(limiter.take("a")).toBe(true);
    advance(999);
    expect(limiter.take("a")).toBe(false);
    advance(1);
    expect(limiter.take("a")).toBe(true);
  });

  it("does not extend the block by refused attempts", () => {
    const { limiter, advance } = setup(1, 1000);
    limiter.take("a");
    advance(500);
    limiter.take("a");
    advance(500);
    expect(limiter.take("a")).toBe(true);
  });
});
