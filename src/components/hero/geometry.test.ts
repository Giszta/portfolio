import { describe, expect, it } from "vitest";
import { CUT_DEFAULT, CUT_MAX, CUT_MIN } from "@/lib/cut";
import { SHAFT_LENGTH, VIEW, VIEW_VERTICAL, cutToX, cutToY } from "./geometry";

describe("hero geometry", () => {
  it("maps the whole slider range onto the drawing sheet", () => {
    expect(cutToX(CUT_MIN)).toBe(VIEW.x);
    expect(cutToX(CUT_MAX)).toBe(VIEW.x + VIEW.width);
  });

  it("places the default 50/50 cut exactly in the middle of the shaft", () => {
    expect(cutToX(CUT_DEFAULT)).toBe(SHAFT_LENGTH / 2);
  });
  it("uses the same cut convention on the vertical (mobile) sheet", () => {
    expect(cutToY(CUT_MIN)).toBe(VIEW_VERTICAL.y);
    expect(cutToY(CUT_MAX)).toBe(VIEW_VERTICAL.y + VIEW_VERTICAL.height);
    expect(cutToY(CUT_DEFAULT)).toBe(SHAFT_LENGTH / 2);
  });
});
