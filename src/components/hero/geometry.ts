import {
  SHAFT_EDGE_CHAMFER,
  SHAFT_END_CHAMFER,
  SHAFT_GENERAL_FILLET,
  SHAFT_STEPS,
} from "@/content/hero/shaft";
import { buildShaftPath, maxDiameter, shaftLength, type OutlineOptions } from "@/lib/shaft";

export const SHAFT_LENGTH = shaftLength(SHAFT_STEPS);
export const SHAFT_MAX_DIAMETER = maxDiameter(SHAFT_STEPS);

const OUTLINE_OPTIONS = {
  chamfer: SHAFT_END_CHAMFER,
  fillet: SHAFT_GENERAL_FILLET,
  edgeChamfer: SHAFT_EDGE_CHAMFER,
} as const satisfies OutlineOptions;

/** Obrys z fazkami i promieniami — wspólny dla rysunku i kodu, żeby ich krawędzie pokrywały się co do piksela. */
export const SHAFT_OUTLINE = buildShaftPath(SHAFT_STEPS, OUTLINE_OPTIONS);

/** Ten sam obrys dla telefonu: oś pionowa, czoło wału u góry. */
export const SHAFT_OUTLINE_VERTICAL = buildShaftPath(SHAFT_STEPS, {
  ...OUTLINE_OPTIONS,
  axis: "vertical",
});

/** Margines arkusza na wymiary i opisy [mm]. */
const PAD_X = 80;
const PAD_Y = 170;
const PAD_VERTICAL = 80;

/** Arkusz desktop: oś wału na y = 0, wał od x = 0 do SHAFT_LENGTH. */
export const VIEW = {
  x: -PAD_X,
  y: -(SHAFT_MAX_DIAMETER / 2 + PAD_Y),
  width: SHAFT_LENGTH + 2 * PAD_X,
  height: SHAFT_MAX_DIAMETER + 2 * PAD_Y,
} as const;

/** Arkusz mobile: oś wału na x = 0, wał od y = 0 do SHAFT_LENGTH. */
export const VIEW_VERTICAL = {
  x: -(SHAFT_MAX_DIAMETER / 2 + PAD_VERTICAL),
  y: -PAD_VERTICAL,
  width: SHAFT_MAX_DIAMETER + 2 * PAD_VERTICAL,
  height: SHAFT_LENGTH + 2 * PAD_VERTICAL,
} as const;

export const VIEW_BOX = `${VIEW.x} ${VIEW.y} ${VIEW.width} ${VIEW.height}`;
export const VIEW_BOX_VERTICAL = `${VIEW_VERTICAL.x} ${VIEW_VERTICAL.y} ${VIEW_VERTICAL.width} ${VIEW_VERTICAL.height}`;

/** Wartość cięcia [%] → x na arkuszu desktop. Torem suwaka jest cała szerokość arkusza. */
export function cutToX(value: number): number {
  return VIEW.x + (value / 100) * VIEW.width;
}

/** Wartość cięcia [%] → y na arkuszu mobile. Ta sama umowa: % „Drawing” od początku osi. */
export function cutToY(value: number): number {
  return VIEW_VERTICAL.y + (value / 100) * VIEW_VERTICAL.height;
}
