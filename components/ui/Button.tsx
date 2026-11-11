import Link from "next/link";
import type { ComponentProps } from "react";

const variants = {
  primary:
    "bg-blue-600 text-white border-blue-500 shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_0_24px_-6px_rgba(26,95,208,.6)] hover:bg-blue-500",
  outline: "border-line-strong text-fg bg-ink-950/40 hover:border-fg-subtle hover:bg-ink-850",
  white: "bg-fg text-ink-950 border-fg hover:bg-white",
} as const;

type Props = ComponentProps<typeof Link> & {
  variant?: keyof typeof variants;
  arrow?: boolean;
  size?: "sm" | "md";
};

/** Botão de canto reto. Sempre é link (âncora interna ou externa). */
export function Button({ variant = "primary", arrow, size = "md", className = "", children, ...props }: Props) {
  const pad = size === "sm" ? "h-9 px-3.5 text-[13px]" : "h-11 px-5 text-sm sm:h-12 sm:px-6 sm:text-[15px]";
  return (
    <Link
      className={`group inline-flex select-none items-center justify-center gap-2 border font-medium transition-colors duration-200 ${pad} ${variants[variant]} ${className}`}
      {...props}
    >
      {arrow && <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>}
      {children}
    </Link>
  );
}
