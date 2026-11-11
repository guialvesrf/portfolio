/** Label `[ TEXTO ]` com colchetes desenhados como bordas em L. */
export function Eyebrow({ children, tone = "blue", className = "" }: {
  children: React.ReactNode;
  tone?: "blue" | "muted" | "yellow" | "green";
  className?: string;
}) {
  const color = {
    blue: "text-blue-300 before:border-blue-400 after:border-blue-400",
    muted: "text-fg-muted before:border-fg-subtle after:border-fg-subtle",
    yellow: "text-yellow-300 before:border-yellow-300 after:border-yellow-300",
    green: "text-green-500 before:border-green-500 after:border-green-500",
  }[tone];
  return (
    <span
      className={`relative inline-flex items-center px-3 py-1 font-mono text-[11px] uppercase leading-none tracking-[0.12em] sm:text-xs
        before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:border-y before:border-l before:content-['']
        after:absolute after:inset-y-0 after:right-0 after:w-1.5 after:border-y after:border-r after:content-[''] ${color} ${className}`}
    >
      {children}
    </span>
  );
}
