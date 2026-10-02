"use client";

import { ChevronsLeftRight } from "lucide-react";
import { motion, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { useId, useRef, type KeyboardEvent } from "react";
import { SHAFT_EDGE_CHAMFER, SHAFT_GENERAL_FILLET } from "@/content/hero/shaft";
import { CUT_MAX, CUT_MIN, cutFromKey, cutFromPointer, cutShares, snapCut } from "@/lib/cut";
import { cn } from "@/lib/utils/cn";
import { VIEW, VIEW_BOX, cutToX } from "./geometry";
import { ShaftCode } from "./ShaftCode";
import { ShaftDrawing } from "./ShaftDrawing";
import { useCut } from "./useCut";

const SECTION_MARK = "A";
const MARK_Y = [VIEW.y + 40, -VIEW.y - 40] as const;

interface ShaftCutProps {
  className?: string;
}

/** Hero desktop: wał przecięty linią A–A. Przeciągnij linię albo użyj klawiatury. */
export function ShaftCut({ className }: ShaftCutProps) {
  const t = useTranslations("hero.cut");
  const trackRef = useRef<HTMLDivElement>(null);

  const uid = useId().replace(/[^\w-]/g, "");
  const ids = { drawing: `${uid}-drawing`, code: `${uid}-code`, outline: `${uid}-outline` };

  const { cut, target, moveTo } = useCut();

  const cutX = useTransform(cut, cutToX);
  const drawingWidth = useTransform(cutX, (x) => x - VIEW.x);
  const codeWidth = useTransform(cutX, (x) => VIEW.x + VIEW.width - x);
  const handleLeft = useTransform(cut, (value) => `${value}%`);

  const followPointer = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    cut.stop();
    cut.set(cutFromPointer(clientX, rect.left, rect.width));
  };

  const release = () => moveTo(snapCut(cut.get()));

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = cutFromKey(target, event.key);
    if (next === null) return;
    event.preventDefault();
    moveTo(next);
  };

  return (
    <motion.div
      ref={trackRef}
      onPointerDown={(event) => followPointer(event.clientX)}
      onPan={(event) => followPointer(event.clientX)}
      onPanEnd={release}
      onPointerUp={release}
      className={cn("relative cursor-ew-resize touch-pan-y select-none", className)}
    >
      <svg viewBox={VIEW_BOX} role="img" aria-label={t("figure")} className="block h-auto w-full">
        <defs>
          <clipPath id={ids.drawing}>
            <motion.rect x={VIEW.x} y={VIEW.y} height={VIEW.height} width={drawingWidth} />
          </clipPath>
          <clipPath id={ids.code}>
            <motion.rect x={cutX} y={VIEW.y} height={VIEW.height} width={codeWidth} />
          </clipPath>
        </defs>

        <g clipPath={`url(#${ids.drawing})`}>
          <ShaftDrawing
            title={t("drawingTitle")}
            notes={[
              t("generalTolerances"),
              t("generalRadii", { radius: SHAFT_GENERAL_FILLET }),
              t("generalChamfers", { size: SHAFT_EDGE_CHAMFER }),
            ]}
          />
        </g>
        <g clipPath={`url(#${ids.code})`}>
          <ShaftCode clipId={ids.outline} />
        </g>

        {/* Znacznik przekroju A–A: rysowany w x = 0 i przesuwany razem z cięciem */}
        <motion.g style={{ x: cutX }} className="text-amber">
          <line
            x1={0}
            x2={0}
            y1={MARK_Y[0]}
            y2={MARK_Y[1]}
            className="stroke-current"
            strokeWidth={1.5}
            strokeDasharray="28 6 4 6"
            vectorEffect="non-scaling-stroke"
          />
          {MARK_Y.map((y) => (
            <g key={y}>
              <path
                d={`M0 ${y} H-30 M-22 ${y - 8} L-30 ${y} L-22 ${y + 8}`}
                className="fill-none stroke-current"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
              />
              <text
                x={8}
                y={y < 0 ? y - 6 : y + 18}
                fontSize={16}
                className="fill-current font-mono"
              >
                {SECTION_MARK}
              </text>
            </g>
          ))}
        </motion.g>
      </svg>

      <motion.div
        role="slider"
        tabIndex={0}
        aria-label={t("label")}
        aria-orientation="horizontal"
        aria-valuemin={CUT_MIN}
        aria-valuemax={CUT_MAX}
        aria-valuenow={target}
        aria-valuetext={t("valueText", cutShares(target))}
        onKeyDown={onKeyDown}
        style={{ left: handleLeft }}
        className="absolute top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-amber bg-canvas text-amber shadow-glow-soft"
      >
        <ChevronsLeftRight aria-hidden="true" className="size-5" />
      </motion.div>
    </motion.div>
  );
}
