export interface DiameterTolerance {
  fit: string;
  upper: number;
  lower: number;
}

export interface ShaftStep {
  length: number;
  diameter: number;
  tolerance?: DiameterTolerance;
  roughness?: number;
  datum?: string;
  runout?: { value: number; datums: string };
  closingLink?: boolean;
  shoulderFillet?: number;
  dimensionAt?: number;
}

export const SHAFT_END_CHAMFER = 3;

export const SHAFT_GENERAL_FILLET = 3;

export const SHAFT_EDGE_CHAMFER = 2;

export const SHAFT_STEPS = [
  {
    length: 140,
    diameter: 120,
    tolerance: { fit: "k6", upper: 0.025, lower: 0.003 },
    roughness: 0.8,
    datum: "B",
    shoulderFillet: 2,
  },
  { length: 160, diameter: 200 },
  {
    length: 140,
    diameter: 160,
    tolerance: { fit: "h6", upper: 0, lower: -0.025 },
    roughness: 1.6,
    runout: { value: 0.02, datums: "B-C" },
  },
  { length: 320, diameter: 280, closingLink: true, dimensionAt: 0.25 },
  {
    length: 160,
    diameter: 160,
    tolerance: { fit: "h6", upper: 0, lower: -0.025 },
    roughness: 1.6,
    runout: { value: 0.02, datums: "B-C" },
  },
  { length: 160, diameter: 200, shoulderFillet: 2 },
  {
    length: 120,
    diameter: 120,
    tolerance: { fit: "k6", upper: 0.025, lower: 0.003 },
    roughness: 0.8,
    datum: "C",
  },
] as const satisfies readonly ShaftStep[];
