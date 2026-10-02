"use client";

import { motion, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { useId } from "react";
import { CUT_PRESETS, presetForValue } from "@/lib/cut";
import { cn } from "@/lib/utils/cn";
import { VIEW_BOX_VERTICAL, VIEW_VERTICAL, cutToY } from "./geometry";
import { ShaftCodeVertical } from "./ShaftCodeVertical";
import { ShaftDrawingVertical } from "./ShaftDrawingVertical";
import { useCut } from "./useCut";

const SECTION_MARK = "A";
const MARK_X = [VIEW_VERTICAL.x + 40, -VIEW_VERTICAL.x - 40] as const;

interface ShaftCutMobileProps {
  className?: string;
}

/**
 * Hero mobile: wał obrócony o 90°, cięcie A–A poziome.
 * Zamiast przeciągania (konflikt ze scrollem) — przełącznik Rysunek / A–A / Kod.
 */
export function ShaftCutMobile({ className }: ShaftCutMobileProps) {
  const t = useTranslations("hero.cut");
  const uid = useId().replace(/[^\w-]/g, "");
  const ids = { drawing: `${uid}-drawing`, code: `${uid}-code`, outline: `${uid}-outline` };

  const { cut, target, moveTo } = useCut();
  const active = presetForValue(target);

  const cutY = useTransform(cut, cutToY);
  const drawingHeight = useTransform(cutY, (y) => y - VIEW_VERTICAL.y);
  const codeHeight = useTransform(cutY, (y) => VIEW_VERTICAL.y + VIEW_VERTICAL.height - y);

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <svg
        viewBox={VIEW_BOX_VERTICAL}
        role="img"
        aria-label={t("figure")}
        className="block h-[65svh] max-h-160 w-auto max-w-full"
      >
        <defs>
          <clipPath id={ids.drawing}>
            <motion.rect
              x={VIEW_VERTICAL.x}
              y={VIEW_VERTICAL.y}
              width={VIEW_VERTICAL.width}
              height={drawingHeight}
            />
          </clipPath>
          <clipPath id={ids.code}>
            <motion.rect
              x={VIEW_VERTICAL.x}
              y={cutY}
              width={VIEW_VERTICAL.width}
              height={codeHeight}
            />
          </clipPath>
        </defs>

        <g clipPath={`url(#${ids.drawing})`}>
          <ShaftDrawingVertical />
        </g>
        <g clipPath={`url(#${ids.code})`}>
          <ShaftCodeVertical clipId={ids.outline} />
        </g>

        {/* Znacznik A–A: strzałki patrzą w górę, na rysunek */}
        <motion.g style={{ y: cutY }} className="text-amber">
          <line
            x1={MARK_X[0]}
            x2={MARK_X[1]}
            y1={0}
            y2={0}
            className="stroke-current"
            strokeWidth={1.5}
            strokeDasharray="28 6 4 6"
            vectorEffect="non-scaling-stroke"
          />
          {MARK_X.map((x) => (
            <g key={x}>
              <path
                d={`M${x} 0 V-40 M${x - 10} -30 L${x} -40 L${x + 10} -30`}
                className="fill-none stroke-current"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
              />
              <text
                x={x < 0 ? x - 12 : x + 12}
                y={-14}
                fontSize={30}
                textAnchor={x < 0 ? "end" : "start"}
                className="fill-current font-mono"
              >
                {SECTION_MARK}
              </text>
            </g>
          ))}
        </motion.g>
      </svg>

      <div
        role="group"
        aria-label={t("viewsLabel")}
        className="inline-flex rounded-sm border border-line-strong font-mono text-label"
      >
        {CUT_PRESETS.map(({ id, value }) => (
          <button
            key={id}
            type="button"
            aria-pressed={active === id}
            onClick={() => moveTo(value)}
            className="h-11 min-w-20 px-4 text-fg-muted uppercase transition-colors not-last:border-r not-last:border-line-strong hover:text-fg aria-pressed:bg-surface-raised aria-pressed:text-amber"
          >
            {t(`views.${id}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
