export const ARROW = 6;

export const LINE = {
  className: "fill-none stroke-current",
  vectorEffect: "non-scaling-stroke",
} as const;

export type ArrowDirection = "up" | "down" | "left" | "right";

/** Grot strzałki wymiarowej z ostrzem w (x, y), skierowany w `direction`. */
export function arrowhead(
  x: number,
  y: number,
  direction: ArrowDirection,
  size: number = ARROW,
): string {
  const half = size / 2;
  switch (direction) {
    case "up":
      return `M${x - half} ${y + size} L${x} ${y} L${x + half} ${y + size}`;
    case "down":
      return `M${x - half} ${y - size} L${x} ${y} L${x + half} ${y - size}`;
    case "left":
      return `M${x + size} ${y - half} L${x} ${y} L${x + size} ${y + half}`;
    case "right":
      return `M${x - size} ${y - half} L${x} ${y} L${x - size} ${y + half}`;
  }
}

/** Szerokość tekstu w foncie monospace: każdy znak JetBrains Mono ma 0.6 em. */
export function monoWidth(text: string, fontSize: number): number {
  return text.length * fontSize * 0.6;
}
