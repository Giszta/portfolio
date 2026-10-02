import type { ShaftStep } from "@/content/hero/shaft";

export type ShaftAxis = "horizontal" | "vertical";

/** Punkt w układzie wału: [wzdłuż osi, w poprzek osi] [mm]. */
export type ShaftPoint = readonly [along: number, across: number];

export interface StepSpan extends ShaftStep {
  /** Początek stopnia na osi wału [mm]. */
  start: number;
  /** Koniec stopnia na osi wału [mm]. */
  end: number;
}

export interface Shoulder {
  /** Położenie odsadzenia na osi wału [mm]. */
  position: number;
  /** Średnica, na której rysujemy linię odsadzenia — większa z sąsiednich [mm]. */
  diameter: number;
}

export interface Boundary {
  /** Położenie na osi [mm]. */
  position: number;
  /** Promień, od którego zaczyna się linia pomocnicza wymiaru [mm]. */
  radius: number;
}

export interface OutlineOptions {
  axis?: ShaftAxis;
  /** Fazka 45° na obu czołach [mm]; 0 = ostra krawędź. */
  chamfer?: number;
  /** Promień przejścia dla odsadzeń bez własnego `shoulderFillet` [mm]; 0 = ostry narożnik. */
  fillet?: number;
  /** Fazka 45° na wypukłych krawędziach odsadzeń [mm]; 0 = ostra krawędź. */
  edgeChamfer?: number;
}

export interface FilletMark {
  /** Odsadzenie, przy którym leży promień [mm]. */
  position: number;
  radius: number;
  /** Strona odsadzenia z promieniem: −1 przed nim, +1 za nim (zawsze na mniejszym stopniu). */
  side: -1 | 1;
  /** Środek łuku na dolnej krawędzi — tu kończy się linia odniesienia opisu „R…”. */
  anchor: ShaftPoint;
}

type Segment = { kind: "line"; to: ShaftPoint } | { kind: "arc"; radius: number; to: ShaftPoint };

/** Stopnie z bezwzględnym położeniem na osi: kolejny zaczyna się tam, gdzie kończy poprzedni. */
export function stepSpans(steps: readonly ShaftStep[]): StepSpan[] {
  let start = 0;
  return steps.map((step) => {
    const span = { ...step, start, end: start + step.length };
    start = span.end;
    return span;
  });
}

export function shaftLength(steps: readonly ShaftStep[]): number {
  return steps.reduce((total, step) => total + step.length, 0);
}

export function maxDiameter(steps: readonly ShaftStep[]): number {
  return Math.max(...steps.map((step) => step.diameter));
}

/** Promień przejścia na odsadzeniu za stopniem: własny albo ogólny z notatki. */
export function filletAt(step: ShaftStep, general: number): number {
  return step.shoulderFillet ?? general;
}

/**
 * Górna krawędź obrysu od lewego do prawego czoła: odcinki i łuki.
 * Narożnik wklęsły (na mniejszym stopniu) dostaje promień, wypukły (na większym) — fazkę.
 */
function topEdge(
  steps: readonly ShaftStep[],
  chamfer: number,
  fillet: number,
  edgeChamfer: number,
) {
  const spans = stepSpans(steps);
  const segments: Segment[] = [];
  const line = (to: ShaftPoint) => segments.push({ kind: "line", to });
  const arc = (radius: number, to: ShaftPoint) => segments.push({ kind: "arc", radius, to });

  const firstRadius = (spans[0]?.diameter ?? 0) / 2;
  const start: ShaftPoint = [0, -firstRadius + chamfer];
  if (chamfer > 0) line([chamfer, -firstRadius]);

  spans.forEach((span, index) => {
    const r = span.diameter / 2;
    const next = spans[index + 1];

    if (!next) {
      line([span.end - chamfer, -r]);
      if (chamfer > 0) line([span.end, -r + chamfer]);
      return;
    }

    const nextR = next.diameter / 2;
    const R = filletAt(span, fillet);
    const e = edgeChamfer;
    const x = span.end;

    if (nextR > r) {
      // Odsadzenie w górę: promień na końcu bieżącego (mniejszego) stopnia,
      // fazka na wypukłej krawędzi następnego (większego).
      line([x - R, -r]);
      if (R > 0) arc(R, [x, -r - R]);
      line([x, -nextR + e]);
      if (e > 0) line([x + e, -nextR]);
    } else {
      // Odsadzenie w dół: fazka na wypukłej krawędzi bieżącego (większego) stopnia,
      // promień na początku następnego (mniejszego).
      line([x - e, -r]);
      if (e > 0) line([x, -r + e]);
      line([x, -nextR - R]);
      if (R > 0) arc(R, [x + R, -nextR]);
    }
  });

  return { start, segments };
}

/**
 * Obrys wału jako ścieżka SVG: oś symetrii na 0, wał od 0 do długości całkowitej.
 * Dolna krawędź to lustro górnej przechodzone w odwrotnej kolejności.
 * Pionowy wał to ten sam obrys z zamienionymi współrzędnymi.
 */
export function buildShaftPath(
  steps: readonly ShaftStep[],
  { axis = "horizontal", chamfer = 0, fillet = 0, edgeChamfer = 0 }: OutlineOptions = {},
): string {
  const { start, segments } = topEdge(steps, chamfer, fillet, edgeChamfer);

  const mirror = ([along, across]: ShaftPoint): ShaftPoint => [along, -across];
  const toSvg = ([along, across]: ShaftPoint) =>
    axis === "horizontal" ? `${along} ${across}` : `${across} ${along}`;
  // Zamiana osi to odbicie lustrzane — odwraca kierunek obiegu łuków.
  const sweep = axis === "horizontal" ? 0 : 1;
  const draw = (segment: Segment) =>
    segment.kind === "line"
      ? `L${toSvg(segment.to)}`
      : `A${segment.radius} ${segment.radius} 0 0 ${sweep} ${toSvg(segment.to)}`;

  // Dolna krawędź: te same segmenty od końca, każdy kończy się w lustrzanym odbiciu punktu poprzedniego.
  // Odbicie i odwrócenie kierunku znoszą się — łuki zachowują ten sam kierunek obiegu.
  const points = [start, ...segments.map((segment) => segment.to)];
  const bottom = segments
    .map((segment, index): Segment => ({ ...segment, to: mirror(points[index] ?? start) }))
    .reverse();
  const last = points.at(-1) ?? start;

  return [
    `M${toSvg(start)}`,
    ...segments.map(draw),
    `L${toSvg(mirror(last))}`,
    ...bottom.map(draw),
    "Z",
  ].join(" ");
}

/** Odsadzenia — miejsca zmiany średnicy, rysowane na rysunku jako linie poprzeczne. */
export function shoulders(steps: readonly ShaftStep[]): Shoulder[] {
  const spans = stepSpans(steps);
  return spans.slice(0, -1).map((span, index) => ({
    position: span.end,
    diameter: Math.max(span.diameter, spans[index + 1]?.diameter ?? span.diameter),
  }));
}

/** Czoła wału i odsadzenia — z nich wychodzą linie pomocnicze wymiarów długości. */
export function boundaries(steps: readonly ShaftStep[]): Boundary[] {
  const spans = stepSpans(steps);
  const first = spans[0];
  const last = spans.at(-1);
  if (!first || !last) return [];

  return [
    { position: first.start, radius: first.diameter / 2 },
    ...shoulders(steps).map(({ position, diameter }) => ({ position, radius: diameter / 2 })),
    { position: last.end, radius: last.diameter / 2 },
  ];
}

/**
 * Promienie, które trzeba opisać na rysunku: tylko różne od ogólnego
 * (ogólny podaje notatka „Nieoznaczone promienie R…”).
 */
export function filletMarks(steps: readonly ShaftStep[], general: number): FilletMark[] {
  const spans = stepSpans(steps);
  return spans.flatMap((span, index): FilletMark[] => {
    const next = spans[index + 1];
    const radius = span.shoulderFillet;
    if (!next || radius === undefined || radius === general) return [];

    const side = next.diameter > span.diameter ? -1 : 1;
    const smallRadius = Math.min(span.diameter, next.diameter) / 2;
    // Środek łuku leży w odległości R·(1 − 1/√2) od narożnika w obu kierunkach.
    const inset = radius * (1 - Math.SQRT1_2);
    return [
      { position: span.end, radius, side, anchor: [span.end + side * inset, smallRadius + inset] },
    ];
  });
}

/** Wymiary łańcuchowe: wszystkie stopnie poza ogniwem zamykającym (łańcuch nie może być zamknięty). */
export function chainDimensions(steps: readonly ShaftStep[]): StepSpan[] {
  return stepSpans(steps).filter((span) => !span.closingLink);
}

/** Odchyłka wymiaru jak na rysunku: znak przy wartości ≠ 0, trzy miejsca po przecinku; zero bez znaku. */
export function formatDeviation(value: number): string {
  if (value === 0) return "0";
  return `${value > 0 ? "+" : ""}${value.toFixed(3)}`;
}

/** Promień wału w danym położeniu na osi [mm]; poza wałem 0. Na odsadzeniu — promień stopnia, który się tam zaczyna. */
export function radiusAt(steps: readonly ShaftStep[], position: number): number {
  const span = stepSpans(steps).find(({ start, end }) => position >= start && position < end);
  return span ? span.diameter / 2 : 0;
}
