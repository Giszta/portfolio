import { HERO_CODE } from "@/content/hero/code";
import { SHAFT_STEPS } from "@/content/hero/shaft";
import { tokenize } from "@/lib/highlight";
import { radiusAt } from "@/lib/shaft";
import { TOKEN_FILL } from "./codeTheme";
import { SHAFT_LENGTH, SHAFT_MAX_DIAMETER, SHAFT_OUTLINE_VERTICAL } from "./geometry";

const LINES = tokenize(HERO_CODE);
const FONT_SIZE = 22;
const LINE_HEIGHT = 32;
/** Wał ma 1200 mm długości, kod 14 linii — powtarzamy go, aż wypełni całą długość. */
const ROWS = Math.ceil(SHAFT_LENGTH / LINE_HEIGHT);
/** Odstęp kodu od krawędzi stopnia — większy niż promień przejścia i fazka. */
const PADDING = 10;

/**
 * Każdy rząd zaczyna się przy lewej krawędzi stopnia, w którym leży —
 * kod jest „wlany” w kształt wału, a nie ucięty z boku.
 * Rząd na odsadzeniu bierze węższy z dwóch stopni, żeby nie wyjść poza obrys.
 */
const ROW_X = Array.from({ length: ROWS }, (_, row) => {
  const top = row * LINE_HEIGHT;
  const bottom = Math.min(top + LINE_HEIGHT, SHAFT_LENGTH - 1);
  const radius = Math.min(radiusAt(SHAFT_STEPS, top), radiusAt(SHAFT_STEPS, bottom));
  return -radius + PADDING;
});

interface ShaftCodeVerticalProps {
  /** Id clipPath obrysu — musi być unikalne na stronie. */
  clipId: string;
}

/** Widok „Software” na telefon: pionowy wał wypełniony kodem, linie biegną w poprzek osi. */
export function ShaftCodeVertical({ clipId }: ShaftCodeVerticalProps) {
  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <path d={SHAFT_OUTLINE_VERTICAL} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <rect
          x={-SHAFT_MAX_DIAMETER / 2}
          y={0}
          width={SHAFT_MAX_DIAMETER}
          height={SHAFT_LENGTH}
          className="fill-surface"
        />
        <text fontSize={FONT_SIZE} xmlSpace="preserve" className="font-mono whitespace-pre">
          {Array.from({ length: ROWS }, (_, row) => {
            const tokens = LINES[row % LINES.length] ?? [];
            return (
              <tspan key={row} x={ROW_X[row]} y={(row + 1) * LINE_HEIGHT - 8}>
                {tokens.map((token, index) => (
                  <tspan key={index} className={TOKEN_FILL[token.kind]}>
                    {token.text}
                  </tspan>
                ))}
              </tspan>
            );
          })}
        </text>
      </g>

      <path
        d={SHAFT_OUTLINE_VERTICAL}
        className="fill-none stroke-accent"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
}
