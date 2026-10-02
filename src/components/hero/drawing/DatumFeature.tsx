import { LINE } from "./primitives";

const FRAME = 18;
const STEM = 24;

interface DatumFeatureProps {
  x: number;
  y: number;
  label: string;
}

export function DatumFeature({ x, y, label }: DatumFeatureProps) {
  return (
    <g>
      <path d={`M${x - 6} ${y} L${x + 6} ${y} L${x} ${y + 9} Z`} className="fill-current" />
      <path d={`M${x} ${y + 9} V${y + STEM}`} {...LINE} />
      <rect x={x - FRAME / 2} y={y + STEM} width={FRAME} height={FRAME} {...LINE} />
      <text x={x} y={y + STEM + 13} fontSize={12} textAnchor="middle" className="fill-current">
        {label}
      </text>
    </g>
  );
}
