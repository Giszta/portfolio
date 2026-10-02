import { animate, useMotionValue, useReducedMotion, type MotionValue } from "motion/react";
import { useState } from "react";
import { CUT_DEFAULT, clampCut } from "@/lib/cut";

const SPRING = { type: "spring", stiffness: 320, damping: 32 } as const;

export interface CutControls {
  /** Położenie cięcia na żywo — do stylów, bez re-renderu Reacta. */
  cut: MotionValue<number>;
  /** Wartość docelowa — do ARIA, przycisków i kroków klawiatury. */
  target: number;
  /** Przesuwa cięcie sprężyną; przy prefers-reduced-motion — od razu. */
  moveTo: (value: number) => void;
}

/** Wspólny stan linii A–A dla wersji desktop (suwak) i mobile (przełącznik). */
export function useCut(initial = CUT_DEFAULT): CutControls {
  const reduceMotion = useReducedMotion();
  const cut = useMotionValue(initial);
  const [target, setTarget] = useState(initial);

  const moveTo = (value: number) => {
    const next = clampCut(value);
    setTarget(next);
    animate(cut, next, reduceMotion ? { duration: 0 } : SPRING);
  };

  return { cut, target, moveTo };
}
