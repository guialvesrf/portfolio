/** `■ ACTIVE` — badge de status mono com bullet quadrado. */
export function Badge({ children, tone = "green", className = "" }: {
  children: React.ReactNode;
  tone?: "green" | "gray" | "blue" | "yellow";
  className?: string;
}) {
  const color = {
    green: "bg-green-950 text-green-500",
    gray: "bg-ink-800 text-fg-subtle",
    blue: "bg-blue-950 text-blue-300",
    yellow: "bg-yellow-300/10 text-yellow-300",
  }[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap px-1.5 py-[3px] font-mono text-[10px] uppercase leading-none tracking-[0.1em] ${color} ${className}`}>
      <span aria-hidden className="size-[5px] bg-current" />
      {children}
    </span>
  );
}
