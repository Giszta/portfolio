/**
 * Logika linii cięcia A–A.
 * Wartość = udział widoku „Drawing” w %, liczony od początku osi wału
 * (desktop: od lewej, mobile: od góry). 100 = sam rysunek, 0 = sam kod.
 */

export const CUT_MIN = 0;
export const CUT_MAX = 100;
export const CUT_DEFAULT = 50;

/** Strzałki: drobny krok. PageUp/PageDown: duży krok (wzorzec WAI-ARIA Slider). */
export const CUT_STEP = 5;
export const CUT_PAGE_STEP = 25;

/** Zapadki: pozycje, do których linia „przyciąga” po puszczeniu, jeśli jest blisko. */
export const CUT_DETENTS = [CUT_MIN, CUT_DEFAULT, CUT_MAX] as const;
export const SNAP_THRESHOLD = 4;

/** Presety przełącznika mobilnego — w kolejności przycisków: Drawing / A–A / Code. */
export const CUT_PRESETS = [
  { id: "drawing", value: CUT_MAX },
  { id: "section", value: CUT_DEFAULT },
  { id: "code", value: CUT_MIN },
] as const;

export type CutPreset = (typeof CUT_PRESETS)[number]["id"];

export function clampCut(value: number): number {
  if (Number.isNaN(value)) return CUT_DEFAULT;
  return Math.min(CUT_MAX, Math.max(CUT_MIN, value));
}

export function cutFromKey(current: number, key: string): number | null {
  switch (key) {
    case "ArrowRight":
    case "ArrowUp":
      return clampCut(current + CUT_STEP);
    case "ArrowLeft":
    case "ArrowDown":
      return clampCut(current - CUT_STEP);
    case "PageUp":
      return clampCut(current + CUT_PAGE_STEP);
    case "PageDown":
      return clampCut(current - CUT_PAGE_STEP);
    case "Home":
      return CUT_MIN;
    case "End":
      return CUT_MAX;
    default:
      return null;
  }
}

/**
 * Położenie wskaźnika → wartość cięcia.
 * Działa dla obu osi: przekaż clientX/left/width albo clientY/top/height.
 */
export function cutFromPointer(pointer: number, trackStart: number, trackSize: number): number {
  if (trackSize <= 0) return CUT_DEFAULT;
  return clampCut(((pointer - trackStart) / trackSize) * 100);
}

/** Przyciąga do najbliższej zapadki w promieniu SNAP_THRESHOLD; w przeciwnym razie zostawia wartość. */
export function snapCut(value: number): number {
  return CUT_DETENTS.find((detent) => Math.abs(value - detent) <= SNAP_THRESHOLD) ?? value;
}

/** Udziały obu widoków w pełnych procentach — zawsze sumują się do 100 (do opisu dla czytnika ekranu). */
export function cutShares(value: number): { drawing: number; code: number } {
  const drawing = Math.round(clampCut(value));
  return { drawing, code: CUT_MAX - drawing };
}

export function presetForValue(value: number): CutPreset | null {
  return CUT_PRESETS.find((preset) => preset.value === value)?.id ?? null;
}
