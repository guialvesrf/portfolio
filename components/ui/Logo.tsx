/** Marca em pixel art (7×7), estilo do "invader" da referência. */
const MAP = [
  "1111111",
  "1000001",
  "1011101",
  "1010101",
  "1010001",
  "1011111",
  "1111111",
];

export function Logo({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 7 7" shapeRendering="crispEdges" aria-hidden className={className}>
      {MAP.flatMap((row, y) =>
        [...row].map((c, x) => (c === "1" ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="var(--color-blue-400)" /> : null)),
      )}
    </svg>
  );
}
