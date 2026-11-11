/** Divisor em degraus: faixas de cor interpolada, tom sobre tom. */
export function StepDivider({ flip = false }: { flip?: boolean }) {
  const steps = ["#0a0e10", "#0f1315", "#14181a", "#0f1315", "#0a0e10"];
  return (
    <div aria-hidden className={`flex flex-col ${flip ? "flex-col-reverse" : ""}`}>
      {steps.map((c, i) => (
        <div key={i} className="h-2 sm:h-2.5" style={{ background: c }} />
      ))}
    </div>
  );
}
