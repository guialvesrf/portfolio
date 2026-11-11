/** Quatro cantos em L, posicionados no pai `relative`. */
export function CropMarks({ size = 10, inset = 0, className = "border-blue-400" }: {
  size?: number;
  inset?: number;
  className?: string;
}) {
  const s = { width: size, height: size };
  const c = `pointer-events-none absolute ${className}`;
  return (
    <>
      <span aria-hidden className={`${c} border-l border-t`} style={{ ...s, left: inset, top: inset }} />
      <span aria-hidden className={`${c} border-r border-t`} style={{ ...s, right: inset, top: inset }} />
      <span aria-hidden className={`${c} border-b border-l`} style={{ ...s, left: inset, bottom: inset }} />
      <span aria-hidden className={`${c} border-b border-r`} style={{ ...s, right: inset, bottom: inset }} />
    </>
  );
}
