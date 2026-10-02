import { LINE, arrowhead, monoWidth } from "./primitives";

const RUNOUT_SYMBOL = "↗";
const HEIGHT = 18;
const FONT = 11;
const SYMBOL_CELL = 20;
const PADDING = 10;
const RISE = 44;

interface FeatureControlFrameProps {
  x: number;
  y: number;
  value: number;
  datums: string;
}

export function FeatureControlFrame({ x, y, value, datums }: FeatureControlFrameProps) {
  const valueText = value.toFixed(2);
  const valueCell = monoWidth(valueText, FONT) + PADDING;
  const datumCell = monoWidth(datums, FONT) + PADDING;
  const width = SYMBOL_CELL + valueCell + datumCell;
  const left = x - width;
  const top = y - RISE - HEIGHT;
  const baseline = top + 13;

  return (
    <g>
      <path d={`M${x} ${top + HEIGHT} V${y} ${arrowhead(x, y, "down")}`} {...LINE} />
      <rect x={left} y={top} width={width} height={HEIGHT} {...LINE} />
      <path
        d={`M${left + SYMBOL_CELL} ${top} V${top + HEIGHT} M${left + SYMBOL_CELL + valueCell} ${top} V${top + HEIGHT}`}
        {...LINE}
      />
      <g fontSize={FONT} textAnchor="middle" className="fill-current">
        <text x={left + SYMBOL_CELL / 2} y={baseline}>
          {RUNOUT_SYMBOL}
        </text>
        <text x={left + SYMBOL_CELL + valueCell / 2} y={baseline}>
          {valueText}
        </text>
        <text x={left + SYMBOL_CELL + valueCell + datumCell / 2} y={baseline}>
          {datums}
        </text>
      </g>
    </g>
  );
}
