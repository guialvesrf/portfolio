"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import s from "./heatmap.module.css";

// Células são indexadas por coluna (semana * 7 + dia): ↑↓ = ±1 dia, ←→ = ±1 semana.
const step: Record<string, number> = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -7, ArrowRight: 7 };

/** Moldura interativa do heatmap: dispara a cascata, rola para o fim no mobile, tooltip e teclado. */
export function HeatmapFrame({ label, days, children }: { label: string; days: string[]; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, margin: "-10% 0px" });
  const [tip, setTip] = useState<{ text: string; x: number; y: number; p: number } | null>(null);

  // Mobile: começa mostrando as semanas mais recentes.
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  const show = (target: EventTarget | null) => {
    const cell = target instanceof HTMLElement ? target.closest<HTMLElement>("[data-i]") : null;
    if (!cell || !root.current) return;
    const r = cell.getBoundingClientRect();
    const f = root.current.getBoundingClientRect();
    const x = r.left + r.width / 2 - f.left;
    // p desloca o tooltip proporcionalmente: ancorado à esquerda na borda esquerda, à direita na direita.
    setTip({ text: cell.getAttribute("aria-label") ?? "", x, y: r.top - f.top, p: Math.min(1, Math.max(0, x / f.width)) });
  };

  return (
    <div
      ref={root}
      role="group"
      aria-label={label}
      data-in={inView || undefined}
      className={`${s.frame} relative flex gap-2`}
      onPointerOver={(e) => show(e.target)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setTip(null)}
      onFocus={(e) => show(e.target)}
      onBlur={() => setTip(null)}
      onKeyDown={(e) => {
        const i = Number((e.target as HTMLElement).dataset.i);
        const next = step[e.key] && root.current?.querySelector<HTMLElement>(`[data-i="${i + step[e.key]}"]`);
        if (!next) return;
        e.preventDefault();
        next.focus();
      }}
    >
      <div aria-hidden className="flex shrink-0 flex-col pt-[18px] font-mono text-[10px] leading-none text-fg-subtle">
        <div className="grid flex-1 grid-rows-7 gap-[2px] lg:gap-[3px]">
          {days.map((d, i) => (
            <span key={i} className="flex items-center">{d}</span>
          ))}
        </div>
      </div>
      <div
        ref={scroller}
        className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain [scrollbar-width:none] max-lg:fade-x [&::-webkit-scrollbar]:hidden"
        onScroll={() => {
          const a = document.activeElement;
          if (a && root.current?.contains(a) && a.matches("[data-i]")) show(a);
          else setTip(null);
        }}
      >
        {children}
      </div>
      {tip && (
        <div
          aria-hidden
          className="pointer-events-none absolute z-10 w-max max-w-56 border border-line-strong bg-ink-800 px-2.5 py-1.5 font-mono text-[11px] leading-snug text-fg"
          style={{ left: tip.x, top: tip.y - 8, transform: `translate(${-tip.p * 100}%, -100%)` }}
        >
          {tip.text}
        </div>
      )}
    </div>
  );
}
