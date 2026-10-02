import { SHAFT_STEPS } from "@/content/hero/shaft";
import { shoulders, stepSpans } from "@/lib/shaft";
import { LINE, arrowhead } from "./drawing/primitives";
import { SHAFT_LENGTH, SHAFT_MAX_DIAMETER, SHAFT_OUTLINE_VERTICAL } from "./geometry";

const SHOULDERS = shoulders(SHAFT_STEPS);
const SPANS = stepSpans(SHAFT_STEPS);

/** Na telefonie arkusz ma ~0,4 px/mm — pismo i groty powiększone, żeby były czytelne. */
const FONT = 30;
const ARROW = 14;

const FIRST_RADIUS = SHAFT_STEPS[0].diameter / 2;
const LAST_RADIUS = (SHAFT_STEPS.at(-1)?.diameter ?? 0) / 2;
const LENGTH_X = -SHAFT_MAX_DIAMETER / 2 - 40;
/** Liczba wymiarowa na 1/4 długości — środek zajmuje domyślne cięcie A–A. */
const LENGTH_LABEL_Y = SHAFT_LENGTH / 4;
const LENGTH_LABEL = String(SHAFT_LENGTH);

/** Widok „Engineering” na telefon: obrys, odsadzenia, średnice i długość całkowita. */
export function ShaftDrawingVertical() {
  return (
    <g className="font-mono">
      <path
        d={`M0 -40 V${SHAFT_LENGTH + 40}`}
        className="stroke-fg-muted"
        strokeDasharray="24 6 4 6"
        vectorEffect="non-scaling-stroke"
      />

      <g className="text-cyan">
        <path d={SHAFT_OUTLINE_VERTICAL} {...LINE} strokeWidth={1.5} />
        {SHOULDERS.map(({ position, diameter }) => (
          <path
            key={position}
            d={`M${-diameter / 2} ${position} H${diameter / 2}`}
            {...LINE}
            className="fill-none stroke-current opacity-45"
          />
        ))}
      </g>

      <g className="text-amber">
        {SPANS.map(({ start, end, diameter, dimensionAt = 0.5 }) => {
          const y = start + (end - start) * dimensionAt;
          const r = diameter / 2;
          const label = `Ø${diameter}`;
          return (
            <g key={start}>
              <path
                d={`M${-r} ${y} H${r} ${arrowhead(-r, y, "left", ARROW)} ${arrowhead(r, y, "right", ARROW)}`}
                {...LINE}
              />
              <text x={0} y={y - 10} fontSize={FONT} textAnchor="middle" className="fill-current">
                {label}
              </text>
            </g>
          );
        })}

        <path
          d={`M${-FIRST_RADIUS - 6} 0 H${LENGTH_X - 8} M${-LAST_RADIUS - 6} ${SHAFT_LENGTH} H${LENGTH_X - 8}`}
          {...LINE}
          className="fill-none stroke-current opacity-60"
        />
        <path
          d={`M${LENGTH_X} 0 V${SHAFT_LENGTH} ${arrowhead(LENGTH_X, 0, "up", ARROW)} ${arrowhead(LENGTH_X, SHAFT_LENGTH, "down", ARROW)}`}
          {...LINE}
        />
        <text
          transform={`translate(${LENGTH_X - 8} ${LENGTH_LABEL_Y}) rotate(-90)`}
          fontSize={FONT}
          textAnchor="middle"
          className="fill-current"
        >
          {LENGTH_LABEL}
        </text>
      </g>
    </g>
  );
}
