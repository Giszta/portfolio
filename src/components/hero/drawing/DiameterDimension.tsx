import { formatDeviation, type StepSpan } from "@/lib/shaft";
import { LINE, arrowhead, monoWidth } from "./primitives";

const NOMINAL_SIZE = 14;
const DEVIATION_SIZE = 9;
const GAP = 3;

interface DiameterDimensionProps {
  span: StepSpan;
}

export function DiameterDimension({ span }: DiameterDimensionProps) {
  const { start, end, diameter, tolerance, dimensionAt = 0.5 } = span;
  const x = start + (end - start) * dimensionAt;
  const r = diameter / 2;

  const nominal = tolerance ? `Ø${diameter} ${tolerance.fit}` : `Ø${diameter}`;
  const upper = tolerance ? formatDeviation(tolerance.upper) : "";
  const lower = tolerance ? formatDeviation(tolerance.lower) : "";
  const nominalWidth = monoWidth(nominal, NOMINAL_SIZE);
  const deviationWidth = tolerance
    ? GAP + monoWidth(upper.length > lower.length ? upper : lower, DEVIATION_SIZE)
    : 0;
  const nominalCenter = -deviationWidth / 2;
  const deviationX = nominalCenter + nominalWidth / 2 + GAP;

  return (
    <g>
      <path
        d={`M${x} ${-r} V${r} ${arrowhead(x, -r, "up")} ${arrowhead(x, r, "down")}`}
        {...LINE}
      />
      <g transform={`translate(${x - 5} 0) rotate(-90)`} className="fill-current">
        <text x={nominalCenter} y={0} fontSize={NOMINAL_SIZE} textAnchor="middle">
          {nominal}
        </text>
        {tolerance && (
          <>
            <text x={deviationX} y={-8} fontSize={DEVIATION_SIZE}>
              {upper}
            </text>
            <text x={deviationX} y={1} fontSize={DEVIATION_SIZE}>
              {lower}
            </text>
          </>
        )}
      </g>
    </g>
  );
}
