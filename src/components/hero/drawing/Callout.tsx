import { LINE, monoWidth } from "./primitives";

const FONT = 12;
const RUN = 20;
const RISE = 28;
const HEAD = 6;

interface CalloutProps {
  /** Ostrze strzałki na krawędzi przedmiotu. */
  x: number;
  y: number;
  /** Kierunek linii odniesienia: w prawo (1) / w lewo (−1), w dół (1) / w górę (−1). */
  dirX: 1 | -1;
  dirY: 1 | -1;
  label: string;
}

/** Opis z linią odniesienia (ISO 128): strzałka na krawędzi, ukośna linia, półka z tekstem. */
export function Callout({ x, y, dirX, dirY, label }: CalloutProps) {
  const kneeX = x + dirX * RUN;
  const kneeY = y + dirY * RISE;
  const shelfEnd = kneeX + dirX * (monoWidth(label, FONT) + 4);

  // Grot wzdłuż linii odniesienia: wektor jednostkowy od ostrza do załamania i prostopadła do niego.
  const length = Math.hypot(RUN, RISE);
  const ux = (dirX * RUN) / length;
  const uy = (dirY * RISE) / length;
  const baseX = x + ux * HEAD;
  const baseY = y + uy * HEAD;
  const wingX = (-uy * HEAD) / 2;
  const wingY = (ux * HEAD) / 2;

  return (
    <g>
      <path
        d={`M${x} ${y} L${kneeX} ${kneeY} H${shelfEnd} M${baseX + wingX} ${baseY + wingY} L${x} ${y} L${baseX - wingX} ${baseY - wingY}`}
        {...LINE}
      />
      <text
        x={kneeX + dirX * 2}
        y={kneeY - 4}
        fontSize={FONT}
        textAnchor={dirX === 1 ? "start" : "end"}
        className="fill-current"
      >
        {label}
      </text>
    </g>
  );
}
