import { SHAFT_STEPS } from "@/content/hero/shaft";
import { boundaries, chainDimensions } from "@/lib/shaft";
import { SHAFT_LENGTH, SHAFT_MAX_DIAMETER } from "../geometry";
import { LINE, arrowhead } from "./primitives";

const CHAIN = chainDimensions(SHAFT_STEPS);
const BOUNDARIES = boundaries(SHAFT_STEPS);
const GAP = 6;
const OVERHANG = 8;
const CHAIN_Y = SHAFT_MAX_DIAMETER / 2 + 44;
const OVERALL_Y = CHAIN_Y + 40;
const LABEL_SIZE = 13;
const OVERALL_LABEL = String(SHAFT_LENGTH);

interface DimensionLineProps {
  start: number;
  end: number;
  y: number;
  label: string;
  labelAt?: number;
}

function DimensionLine({ start, end, y, label, labelAt = 0.5 }: DimensionLineProps) {
  return (
    <g>
      <path
        d={`M${start} ${y} H${end} ${arrowhead(start, y, "left")} ${arrowhead(end, y, "right")}`}
        {...LINE}
      />
      <text
        x={start + (end - start) * labelAt}
        y={y - 6}
        fontSize={LABEL_SIZE}
        textAnchor="middle"
        className="fill-current"
      >
        {label}
      </text>
    </g>
  );
}
export function LengthDimensions() {
  const lastIndex = BOUNDARIES.length - 1;

  return (
    <g>
      {BOUNDARIES.map(({ position, radius }, index) => {
        const reachesOverall = index === 0 || index === lastIndex;
        return (
          <path
            key={position}
            d={`M${position} ${radius + GAP} V${(reachesOverall ? OVERALL_Y : CHAIN_Y) + OVERHANG}`}
            {...LINE}
            className="fill-none stroke-current opacity-60"
          />
        );
      })}

      {CHAIN.map(({ start, end, length }) => (
        <DimensionLine key={start} start={start} end={end} y={CHAIN_Y} label={String(length)} />
      ))}

      <DimensionLine
        start={0}
        end={SHAFT_LENGTH}
        y={OVERALL_Y}
        label={OVERALL_LABEL}
        labelAt={0.25}
      />
    </g>
  );
}
