import { describe, expect, it } from "vitest";
import {
  CUT_DEFAULT,
  CUT_MAX,
  CUT_MIN,
  clampCut,
  cutFromKey,
  cutFromPointer,
  cutShares,
  presetForValue,
  snapCut,
} from "./cut";

describe("clampCut", () => {
  it.each([
    [42, 42],
    [-10, CUT_MIN],
    [140, CUT_MAX],
    [Number.NaN, CUT_DEFAULT],
  ])("clamps %s to %s", (input, expected) => {
    expect(clampCut(input)).toBe(expected);
  });
});

describe("cutFromKey", () => {
  it.each([
    ["ArrowRight", 55],
    ["ArrowUp", 55],
    ["ArrowLeft", 45],
    ["ArrowDown", 45],
    ["PageUp", 75],
    ["PageDown", 25],
    ["Home", CUT_MIN],
    ["End", CUT_MAX],
  ])("%s moves the cut from 50 to %s", (key, expected) => {
    expect(cutFromKey(50, key)).toBe(expected);
  });

  it("stays within the range at the ends", () => {
    expect(cutFromKey(CUT_MAX, "ArrowRight")).toBe(CUT_MAX);
    expect(cutFromKey(CUT_MIN, "PageDown")).toBe(CUT_MIN);
  });

  it("ignores keys that a slider does not handle", () => {
    expect(cutFromKey(50, "Tab")).toBeNull();
    expect(cutFromKey(50, "a")).toBeNull();
  });
});

describe("cutFromPointer", () => {
  it("maps a pointer position inside the track to a percentage", () => {
    expect(cutFromPointer(300, 100, 800)).toBe(25);
  });

  it("clamps positions outside the track", () => {
    expect(cutFromPointer(50, 100, 800)).toBe(CUT_MIN);
    expect(cutFromPointer(2000, 100, 800)).toBe(CUT_MAX);
  });
});

describe("snapCut", () => {
  it("snaps to a nearby detent", () => {
    expect(snapCut(53)).toBe(CUT_DEFAULT);
    expect(snapCut(97)).toBe(CUT_MAX);
  });

  it("leaves positions away from detents untouched", () => {
    expect(snapCut(30)).toBe(30);
  });
});

describe("cutShares", () => {
  it("rounds to whole percentages that always add up to 100", () => {
    expect(cutShares(33.5)).toEqual({ drawing: 34, code: 66 });
    expect(cutShares(-5)).toEqual({ drawing: 0, code: 100 });
  });
});

describe("presetForValue", () => {
  it("recognises exact preset positions only", () => {
    expect(presetForValue(CUT_MAX)).toBe("drawing");
    expect(presetForValue(CUT_DEFAULT)).toBe("section");
    expect(presetForValue(CUT_MIN)).toBe("code");
    expect(presetForValue(42)).toBeNull();
  });
});
