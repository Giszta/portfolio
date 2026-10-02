import { SHAFT_END_CHAMFER, SHAFT_GENERAL_FILLET, SHAFT_STEPS } from "@/content/hero/shaft";
import { filletMarks, shoulders, stepSpans } from "@/lib/shaft";
import { Callout } from "./drawing/Callout";
import { DatumFeature } from "./drawing/DatumFeature";
import { DiameterDimension } from "./drawing/DiameterDimension";
import { FeatureControlFrame } from "./drawing/FeatureControlFrame";
import { LengthDimensions } from "./drawing/LengthDimensions";
import { LINE } from "./drawing/primitives";
import { RoughnessSymbol } from "./drawing/RoughnessSymbol";
import { SHAFT_LENGTH, SHAFT_OUTLINE, VIEW } from "./geometry";

const SHOULDERS = shoulders(SHAFT_STEPS);
const SPANS = stepSpans(SHAFT_STEPS);
const FILLET_MARKS = filletMarks(SHAFT_STEPS, SHAFT_GENERAL_FILLET);

const FIRST_RADIUS = SHAFT_STEPS[0].diameter / 2;
const LAST_RADIUS = (SHAFT_STEPS.at(-1)?.diameter ?? 0) / 2;
const HALF_CHAMFER = SHAFT_END_CHAMFER / 2;
const CHAMFER_LABEL = `${SHAFT_END_CHAMFER}×45°`;

/** Fazki na obu czołach: krawędź przejścia fazki w walec i punkt opisu na środku fazki. */
const CHAMFERS = [
  {
    edge: SHAFT_END_CHAMFER,
    radius: FIRST_RADIUS,
    mark: [HALF_CHAMFER, -FIRST_RADIUS + HALF_CHAMFER],
    dirX: -1,
  },
  {
    edge: SHAFT_LENGTH - SHAFT_END_CHAMFER,
    radius: LAST_RADIUS,
    mark: [SHAFT_LENGTH - HALF_CHAMFER, -LAST_RADIUS + HALF_CHAMFER],
    dirX: 1,
  },
] as const;

const TITLE_Y = VIEW.y + 36;
const NOTE_Y = VIEW.y + VIEW.height - 20;
const NOTE_LINE_HEIGHT = 16;

interface ShaftDrawingProps {
  title: string;
  /** Uwagi na arkuszu (tolerancje ogólne, nieoznaczone promienie) — od góry do dołu. */
  notes: readonly string[];
}

/** Widok „Engineering”: rysunek wykonawczy wału. Wszystkie elementy generowane z SHAFT_STEPS. */
export function ShaftDrawing({ title, notes }: ShaftDrawingProps) {
  return (
    <g className="font-mono">
      <text x={0} y={TITLE_Y} fontSize={13} className="fill-fg-muted tracking-widest">
        {title}
      </text>

      {/* Oś symetrii: linia punktowa */}
      <path
        d={`M-40 0 H${SHAFT_LENGTH + 40}`}
        className="stroke-fg-muted"
        strokeDasharray="24 6 4 6"
        vectorEffect="non-scaling-stroke"
      />

      <g className="text-cyan">
        <path d={SHAFT_OUTLINE} {...LINE} strokeWidth={1.5} />
        {SHOULDERS.map(({ position, diameter }) => (
          <path
            key={position}
            d={`M${position} ${-diameter / 2} V${diameter / 2}`}
            {...LINE}
            className="fill-none stroke-current opacity-45"
          />
        ))}
        {CHAMFERS.map(({ edge, radius }) => (
          <path
            key={edge}
            d={`M${edge} ${-radius} V${radius}`}
            {...LINE}
            className="fill-none stroke-current opacity-45"
          />
        ))}
      </g>

      <g className="text-amber">
        {SPANS.map((span) => (
          <DiameterDimension key={span.start} span={span} />
        ))}
        <LengthDimensions />

        {SPANS.map(
          (span) =>
            span.roughness !== undefined && (
              <RoughnessSymbol
                key={span.start}
                x={span.start + 16}
                y={-span.diameter / 2}
                value={span.roughness}
              />
            ),
        )}
        {SPANS.map(
          (span) =>
            span.datum && (
              <DatumFeature
                key={span.start}
                // Baza bliżej czoła wału — z dala od odsadzenia i opisu promienia.
                x={span.start === 0 ? span.start + 30 : span.end - 30}
                y={span.diameter / 2}
                label={span.datum}
              />
            ),
        )}
        {SPANS.map(
          (span) =>
            span.runout && (
              <FeatureControlFrame
                key={span.start}
                x={(span.start + span.end) / 2 + 20}
                y={-span.diameter / 2}
                value={span.runout.value}
                datums={span.runout.datums}
              />
            ),
        )}

        {CHAMFERS.map(({ mark: [x, y], dirX }) => (
          <Callout key={x} x={x} y={y} dirX={dirX} dirY={-1} label={CHAMFER_LABEL} />
        ))}
        {FILLET_MARKS.map(({ position, radius, side, anchor: [x, y] }) => (
          <Callout key={position} x={x} y={y} dirX={side} dirY={1} label={`R${radius}`} />
        ))}
      </g>

      {notes.map((note, index) => (
        <text
          key={note}
          x={0}
          y={NOTE_Y - (notes.length - 1 - index) * NOTE_LINE_HEIGHT}
          fontSize={12}
          className="fill-fg-muted"
        >
          {note}
        </text>
      ))}
    </g>
  );
}
