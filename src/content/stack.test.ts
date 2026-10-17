import { describe, expect, it } from "vitest";
import { STACK, type StackItem } from "./stack";
import { TECH } from "./tech";

const key = (item: StackItem) => `${item.kind}:${item.id}`;

describe("STACK", () => {
  it("has unique group ids, in the order they are shown", () => {
    expect(STACK.map((group) => group.id)).toEqual([
      "interface",
      "backend",
      "automation",
      "quality",
      "engineering",
    ]);
  });

  it("only refers to registered technologies", () => {
    for (const group of STACK) {
      for (const item of group.items) {
        if (item.kind === "tech") {
          expect(TECH, `${group.id} → ${item.id}`).toHaveProperty(item.id);
        }
      }
    }
  });

  it("lists every item once, across all groups", () => {
    const keys = STACK.flatMap((group) => group.items.map(key));
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("has no empty group", () => {
    for (const group of STACK) {
      expect(group.items.length, group.id).toBeGreaterThan(0);
    }
  });

  it("marks only the engineering group as the engineering view", () => {
    for (const group of STACK) {
      expect(group.view, group.id).toBe(group.id === "engineering" ? "engineering" : "software");
    }
  });
});
