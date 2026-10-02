import { HERO_CODE } from "@/content/hero/code";
import { tokenize } from "@/lib/highlight";
import { TOKEN_FILL } from "./codeTheme";
import { SHAFT_LENGTH, SHAFT_MAX_DIAMETER, SHAFT_OUTLINE } from "./geometry";

const LINES = tokenize(HERO_CODE);

const FONT_SIZE = 13;
const LINE_HEIGHT = 20;
const FIRST_BASELINE = -SHAFT_MAX_DIAMETER / 2 + LINE_HEIGHT - 5;
/** Dwie kolumny kodu wypełniają cały wał — przy każdym położeniu cięcia widać kod, nie pustkę. */
const COLUMNS = [20, SHAFT_LENGTH / 2 + 20];

interface ShaftCodeProps {
  clipId: string;
}

/** Widok „Software”: ten sam obrys wału, wypełniony kodem. */
export function ShaftCode({ clipId }: ShaftCodeProps) {
  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <path d={SHAFT_OUTLINE} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <rect
          x={0}
          y={-SHAFT_MAX_DIAMETER / 2}
          width={SHAFT_LENGTH}
          height={SHAFT_MAX_DIAMETER}
          className="fill-surface"
        />
        {COLUMNS.map((columnX) => (
          <text
            key={columnX}
            fontSize={FONT_SIZE}
            xmlSpace="preserve"
            className="font-mono whitespace-pre"
          >
            {LINES.map((tokens, row) => (
              <tspan key={row} x={columnX} y={FIRST_BASELINE + row * LINE_HEIGHT}>
                {tokens.map((token, index) => (
                  <tspan key={index} className={TOKEN_FILL[token.kind]}>
                    {token.text}
                  </tspan>
                ))}
              </tspan>
            ))}
          </text>
        ))}
      </g>

      <path
        d={SHAFT_OUTLINE}
        className="fill-none stroke-accent"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
}
