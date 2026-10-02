import { describe, expect, it } from "vitest";
import {
  SHAFT_EDGE_CHAMFER,
  SHAFT_END_CHAMFER,
  SHAFT_GENERAL_FILLET,
  SHAFT_STEPS,
  type ShaftStep,
} from "@/content/hero/shaft";
import {
  boundaries,
  buildShaftPath,
  chainDimensions,
  filletAt,
  filletMarks,
  formatDeviation,
  maxDiameter,
  radiusAt,
  shaftLength,
  shoulders,
  stepSpans,
} from "./shaft";

const RISING = [
  { length: 100, diameter: 40 },
  { length: 50, diameter: 80 },
] as const;

const FALLING = [
  { length: 100, diameter: 80 },
  { length: 50, diameter: 40 },
] as const;

const STEPS_SPEC: readonly ShaftStep[] = SHAFT_STEPS;

const SHARP = SHAFT_STEPS.map(({ length, diameter }) => ({ length, diameter }));

const IT6 = [
  { over: 80, upTo: 120, value: 0.022 },
  { over: 120, upTo: 180, value: 0.025 },
] as const;

describe("shaft geometry", () => {
  it("lays steps end to end along the axis", () => {
    const spans = stepSpans(SHAFT_STEPS);
    expect(spans[0]?.start).toBe(0);
    spans.slice(1).forEach((span, index) => expect(span.start).toBe(spans[index]?.end));
    expect(spans.at(-1)?.end).toBe(shaftLength(SHAFT_STEPS));
  });

  it("measures the hero shaft like the drawing: 1200 long, Ø280 max", () => {
    expect(shaftLength(SHAFT_STEPS)).toBe(1200);
    expect(maxDiameter(SHAFT_STEPS)).toBe(280);
  });

  it("builds a closed sharp outline around the axis", () => {
    expect(buildShaftPath(RISING)).toBe(
      "M0 -20 L100 -20 L100 -40 L150 -40 L150 40 L100 40 L100 20 L0 20 Z",
    );
  });

  it("uses four outline points per step when edges are sharp", () => {
    const points = buildShaftPath(SHARP).split(" L").length;
    expect(points).toBe(SHARP.length * 4);
  });

  it("draws a vertical shaft by swapping the axes", () => {
    expect(buildShaftPath(RISING, { axis: "vertical" })).toBe(
      "M-20 0 L-20 100 L-40 100 L-40 150 L40 150 L40 100 L20 100 L20 0 Z",
    );
  });

  it("puts a shoulder between steps, drawn at the larger diameter", () => {
    expect(shoulders(RISING)).toEqual([{ position: 100, diameter: 80 }]);
    expect(shoulders(SHAFT_STEPS)).toHaveLength(SHAFT_STEPS.length - 1);
  });
});

describe("outline edges", () => {
  it("chamfers both shaft ends at 45°", () => {
    expect(buildShaftPath(RISING, { chamfer: 2 })).toBe(
      "M0 -18 L2 -20 L100 -20 L100 -40 L148 -40 L150 -38 L150 38 L148 40 L100 40 L100 20 L2 20 L0 18 Z",
    );
  });

  it("rounds a rising shoulder on the smaller step", () => {
    expect(buildShaftPath(RISING, { fillet: 5 })).toBe(
      "M0 -20 L95 -20 A5 5 0 0 0 100 -25 L100 -40 L150 -40 L150 40 L100 40 L100 25 A5 5 0 0 0 95 20 L0 20 Z",
    );
  });

  it("rounds a falling shoulder on the smaller step", () => {
    expect(buildShaftPath(FALLING, { fillet: 5 })).toBe(
      "M0 -40 L100 -40 L100 -25 A5 5 0 0 0 105 -20 L150 -20 L150 20 L105 20 A5 5 0 0 0 100 25 L100 40 L0 40 Z",
    );
  });

  it("flips the arc direction when the axes are swapped (a mirror changes orientation)", () => {
    const vertical = buildShaftPath(RISING, { fillet: 5, axis: "vertical" });
    expect(vertical).toContain("A5 5 0 0 1");
    expect(vertical).not.toContain("A5 5 0 0 0");
  });

  it("breaks the convex edge of a rising shoulder on the larger step", () => {
    expect(buildShaftPath(RISING, { edgeChamfer: 2 })).toBe(
      "M0 -20 L100 -20 L100 -38 L102 -40 L150 -40 L150 40 L102 40 L100 38 L100 20 L0 20 Z",
    );
  });

  it("combines a convex chamfer and a fillet on one falling shoulder", () => {
    expect(buildShaftPath(FALLING, { fillet: 5, edgeChamfer: 2 })).toBe(
      "M0 -40 L98 -40 L100 -38 L100 -25 A5 5 0 0 0 105 -20 L150 -20 L150 20 L105 20 A5 5 0 0 0 100 25 L100 38 L98 40 L0 40 Z",
    );
  });
  it("reports the shaft radius at any position along the axis", () => {
    expect(radiusAt(RISING, 50)).toBe(20);
    expect(radiusAt(RISING, 100)).toBe(40); // odsadzenie należy do stopnia, który się tam zaczyna
    expect(radiusAt(RISING, 150)).toBe(0); // za czołem wału
  });
});

describe("drawing annotations", () => {
  it.each([
    [0.025, "+0.025"],
    [0.003, "+0.003"],
    [0, "0"],
    [-0.029, "-0.029"],
  ])("formats deviation %s as %s", (value, expected) => {
    expect(formatDeviation(value)).toBe(expected);
  });

  it("leaves exactly one link of the length chain open", () => {
    expect(chainDimensions(SHAFT_STEPS)).toHaveLength(SHAFT_STEPS.length - 1);
    expect(STEPS_SPEC.filter((step) => step.closingLink)).toHaveLength(1);
  });

  it("starts extension lines at both shaft ends and every shoulder", () => {
    const positions = boundaries(SHAFT_STEPS).map((boundary) => boundary.position);
    expect(positions).toEqual([0, 140, 300, 440, 760, 920, 1080, 1200]);
  });

  it("has valid tolerance zones (upper above lower, h-fits with zero upper deviation)", () => {
    for (const { tolerance } of STEPS_SPEC) {
      if (!tolerance) continue;
      expect(tolerance.upper).toBeGreaterThan(tolerance.lower);
      if (tolerance.fit.startsWith("h")) expect(tolerance.upper).toBe(0);
    }
  });

  it("matches ISO 286 IT6 zone widths for every grade-6 fit", () => {
    for (const { diameter, tolerance } of STEPS_SPEC) {
      if (!tolerance?.fit.endsWith("6")) continue;
      const grade = IT6.find((range) => diameter > range.over && diameter <= range.upTo);
      expect(grade, `no IT6 range for Ø${diameter}`).toBeDefined();
      expect(tolerance.upper - tolerance.lower).toBeCloseTo(grade?.value ?? Number.NaN, 6);
    }
  });

  it("marks only the fillets that differ from the general radius", () => {
    const marks = filletMarks(SHAFT_STEPS, SHAFT_GENERAL_FILLET);
    expect(marks.map(({ position, radius }) => [position, radius])).toEqual([
      [140, 2],
      [1080, 2],
    ]);
  });

  it("anchors a fillet mark at the middle of the arc, on the smaller step", () => {
    const [mark] = filletMarks(
      [
        { length: 100, diameter: 40, shoulderFillet: 4 },
        { length: 50, diameter: 80 },
      ],
      0,
    );
    const inset = 4 * (1 - Math.SQRT1_2);
    expect(mark?.side).toBe(-1);
    expect(mark?.anchor[0]).toBeCloseTo(100 - inset);
    expect(mark?.anchor[1]).toBeCloseTo(20 + inset);
  });

  it("keeps every fillet and chamfer smaller than the features they sit on", () => {
    const spans = stepSpans(SHAFT_STEPS);
    spans.forEach((span, index) => {
      const next = spans[index + 1];
      if (!next) return;
      const radius = filletAt(span, SHAFT_GENERAL_FILLET);
      const shoulderHeight = Math.abs(next.diameter - span.diameter) / 2;
      expect(radius + SHAFT_EDGE_CHAMFER).toBeLessThan(shoulderHeight);
      expect(radius).toBeLessThan(Math.min(span.length, next.length));
    });
    expect(SHAFT_END_CHAMFER).toBeLessThan(
      Math.min(...SHAFT_STEPS.map((step) => step.diameter)) / 2,
    );
  });
});
