import {
  SHAFT_EDGE_CHAMFER,
  SHAFT_END_CHAMFER,
  SHAFT_GENERAL_FILLET,
  SHAFT_STEPS,
} from "@/content/hero/shaft";
import { CUT_MAX } from "@/lib/cut";
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

/**
 * Zapas poza arkuszem na znacznik cięcia [mm]. Linia, strzałki i litera A wychodzą poza arkusz,
 * więc bez zapasu viewBox obcinałby je w skrajnych położeniach. Arkusz i przycinanie się nie zmieniają.
 */
const MARK_ROOM_X = 40;
const MARK_ROOM_TOP = 48;
const MARK_ROOM_BOTTOM = 8;

export const VIEW_BOX = `${VIEW.x - MARK_ROOM_X} ${VIEW.y} ${VIEW.width + 2 * MARK_ROOM_X} ${VIEW.height}`;
export const VIEW_BOX_VERTICAL = `${VIEW_VERTICAL.x} ${VIEW_VERTICAL.y - MARK_ROOM_TOP} ${VIEW_VERTICAL.width} ${VIEW_VERTICAL.height + MARK_ROOM_TOP + MARK_ROOM_BOTTOM}`;

/** Część szerokości toru (svg), którą zajmuje zapas z każdej strony. */
export const TRACK_INSET = MARK_ROOM_X / (VIEW.width + 2 * MARK_ROOM_X);

/** Wartość cięcia [%] → położenie uchwytu w % szerokości toru (arkusz leży między zapasami). */
export function cutToTrackPercent(value: number): number {
  const centre = CUT_MAX / 2;
  return centre + (value - centre) * (1 - 2 * TRACK_INSET);
}

/** Wartość cięcia [%] → x na arkuszu desktop. Torem suwaka jest cała szerokość arkusza. */
export function cutToX(value: number): number {
  return VIEW.x + (value / 100) * VIEW.width;
}

/** Wartość cięcia [%] → y na arkuszu mobile. Ta sama umowa: % „Drawing” od początku osi. */
export function cutToY(value: number): number {
  return VIEW_VERTICAL.y + (value / 100) * VIEW_VERTICAL.height;
}
