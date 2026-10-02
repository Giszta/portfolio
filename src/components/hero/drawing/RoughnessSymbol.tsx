import { LINE } from "./primitives";

interface RoughnessSymbolProps {
  x: number;
  y: number;
  value: number;
}

export function RoughnessSymbol({ x, y, value }: RoughnessSymbolProps) {
  const label = `Ra ${value}`;
  return (
    <g>
      <path
        d={`M${x - 6} ${y - 10} L${x} ${y} L${x + 12} ${y - 20} H${x + 34} M${x - 6} ${y - 10} H${x + 6}`}
        {...LINE}
      />
      <text x={x + 14} y={y - 11} fontSize={10} className="fill-current">
        {label}
      </text>
    </g>
  );
}
