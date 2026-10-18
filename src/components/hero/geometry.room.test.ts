import { describe, expect, it } from "vitest";
import { CUT_MAX, CUT_MIN, cutFromPointer } from "@/lib/cut";
import {
  TRACK_INSET,
  VIEW,
  VIEW_BOX,
  VIEW_BOX_VERTICAL,
  VIEW_VERTICAL,
  cutToTrackPercent,
  cutToX,
  cutToY,
} from "./geometry";

/** Najdalszy zasięg znacznika od linii cięcia (strzałka na desktopie 30, na telefonie 40). */
const MARK_REACH_X = 30;
const MARK_REACH_Y = 40;

const parse = (box: string) => {
  const [x = 0, y = 0, width = 0, height = 0] = box.split(" ").map(Number);
  return { x, y, width, height };
};

describe("cut marker room", () => {
  it("keeps the desktop marker inside the viewBox at both ends of the cut", () => {
    const box = parse(VIEW_BOX);
    expect(cutToX(CUT_MIN) - MARK_REACH_X).toBeGreaterThanOrEqual(box.x);
    expect(cutToX(CUT_MAX) + MARK_REACH_X).toBeLessThanOrEqual(box.x + box.width);
  });

  it("keeps the mobile marker inside the viewBox at both ends of the cut", () => {
    const box = parse(VIEW_BOX_VERTICAL);
    expect(cutToY(CUT_MIN) - MARK_REACH_Y).toBeGreaterThanOrEqual(box.y);
    expect(cutToY(CUT_MAX)).toBeLessThanOrEqual(box.y + box.height);
  });

  it("does not change the drawn sheet, only the room around it", () => {
    const box = parse(VIEW_BOX);
    expect(box.y).toBe(VIEW.y);
    expect(box.height).toBe(VIEW.height);
    expect(parse(VIEW_BOX_VERTICAL).x).toBe(VIEW_VERTICAL.x);
  });

  it("places the handle on the line: ends inside the track, centre unchanged", () => {
    expect(cutToTrackPercent(50)).toBe(50);
    expect(cutToTrackPercent(CUT_MIN)).toBeCloseTo(TRACK_INSET * 100);
    expect(cutToTrackPercent(CUT_MAX)).toBeCloseTo((1 - TRACK_INSET) * 100);
  });

  it("maps a pointer back to the value whose handle is under it", () => {
    const width = 1000;
    for (const value of [0, 12, 50, 77, 100]) {
      const pointer = (cutToTrackPercent(value) / 100) * width;
      const back = cutFromPointer(pointer, width * TRACK_INSET, width * (1 - 2 * TRACK_INSET));
      expect(back).toBeCloseTo(value);
    }
  });
});
