"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/** Conta de `from` até `to` quando entra na tela. Escreve direto no DOM (sem re-render por frame). */
export function Counter({ to, from = 0, decimals = 0, duration = 1.6, locale = "pt-BR", prefix = "", suffix = "", className = "" }: {
  to: number;
  from?: number;
  decimals?: number;
  duration?: number;
  locale?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const fmt = (v: number) =>
    prefix + v.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;

  useEffect(() => {
    if (!inView || !ref.current) return;
    if (reduce) {
      ref.current.textContent = fmt(to);
      return;
    }
    const c = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => ref.current && (ref.current.textContent = fmt(v)),
    });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {fmt(reduce ? to : from)}
    </span>
  );
}
