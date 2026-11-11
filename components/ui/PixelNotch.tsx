/** Canto em degraus de pixel (2 quadrados), recortado com a cor do fundo da página. */
export function PixelNotch({ corner = "tr", size = 12, color = "var(--color-ink-950)" }: {
  corner?: "tr" | "br" | "tl" | "bl";
  size?: number;
  color?: string;
}) {
  const v = corner[0] === "t" ? "top" : "bottom";
  const h = corner[1] === "r" ? "right" : "left";
  const sq = (dx: number, dy: number) => ({
    position: "absolute" as const,
    width: size,
    height: size,
    background: color,
    [v]: dy * size,
    [h]: dx * size,
  });
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      <span style={sq(0, 0)} />
      <span style={sq(1, 0)} />
      <span style={sq(0, 1)} />
      <span style={{ ...sq(1, 1), opacity: 0.55 }} />
    </span>
  );
}
