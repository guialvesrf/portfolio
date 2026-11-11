/** Ícones pixel 12×12 desenhados à mão. Cada caractere é uma célula; "." é vazio. */
const icons = {
  // gopher simplificado: orelhas, olhos grandes, focinho, dentes, mãos e pés
  go: {
    colors: { C: "#00ADD8", W: "#FFFFFF", K: "#05090A", S: "#F6D2A2" },
    rows: [
      ".CC......CC.",
      ".CCCCCCCCCC.",
      "CCWWWCCWWWCC",
      "CCWKWCCWKWCC",
      "CCWWWCCWWWCC",
      "CCCCSSSSCCCC",
      "CCCCSKKSCCCC",
      "SCCCCWWCCCCS",
      "CCCCCCCCCCCC",
      "CCCCCCCCCCCC",
      ".CCCCCCCCCC.",
      ".SS......SS.",
    ],
  },
  // pãozinho com "TS" em azul
  ts: {
    colors: { B: "#F9E6C4", D: "#D9A066", T: "#3178C6" },
    rows: [
      "............",
      "....BBBB....",
      "..BBBBBBBB..",
      ".BBBBBBBBBB.",
      ".BBTTTBTTTB.",
      "BBBBTBBTBBBB",
      "BBBBTBBTTTBB",
      "BBBBTBBBBTBB",
      "BBBBTBBTTTBB",
      "DDDDDDDDDDDD",
      ".DDDDDDDDDD.",
      "............",
    ],
  },
  // duas cobras encaixadas, simetria de 180°
  py: {
    colors: { B: "#3776AB", Y: "#FFD43B", K: "#05090A" },
    rows: [
      "...BBBB.....",
      "..BBKBBB....",
      "..BBBBBB....",
      "......BB.YY.",
      ".BBBBBBB.YY.",
      ".BBBBBBB.YY.",
      ".BB.YYYYYYY.",
      ".BB.YYYYYYY.",
      ".BB.YY......",
      "....YYYYYY..",
      "....YYYKYY..",
      ".....YYYY...",
    ],
  },
} satisfies Record<string, { colors: Record<string, string>; rows: string[] }>;

export type IconName = keyof typeof icons;

export function PixelIcon({ name, label, className = "" }: { name: IconName; label: string; className?: string }) {
  const { colors, rows } = icons[name];
  const palette: Record<string, string> = colors;
  return (
    <svg viewBox="0 0 12 12" role="img" aria-label={label} shapeRendering="crispEdges" className={className}>
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) => (palette[ch] ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={palette[ch]} /> : null)),
      )}
    </svg>
  );
}
