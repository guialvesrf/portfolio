"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { BOUNDS, type Gains } from "./episodes";

export const EASE = [0.16, 1, 0.3, 1] as const;
export const LABEL = "font-mono text-[10px] uppercase leading-none tracking-[0.12em] text-fg-subtle";
export const fmtGain = (v: number) => v.toFixed(v < 0.1 ? 3 : 2);

/** Linha do tempo em loop: avança um passo por timeout, só enquanto visível.
 *  Com movimento reduzido fica parada em `still` (estado final legível). */
export function useTimeline<T extends HTMLElement>(ms: readonly number[], still: number) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    const id = setTimeout(() => setStep((s) => (s + 1) % ms.length), ms[step]);
    return () => clearTimeout(id);
  }, [inView, reduce, step, ms]);
  return { ref, step: reduce ? still : step };
}

/** Número que conta do valor anterior até o novo (escreve via MotionValue, sem re-render por frame). */
export function Num({ value, decimals = 1 }: { value: number; decimals?: number }) {
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => v.toFixed(decimals));
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.9, ease: EASE });
    return () => c.stop();
  }, [mv, value]);
  return <motion.span className="tabular-nums">{text}</motion.span>;
}

/** Os trilhos de P, I e D por onde passa todo PID sugerido, venha da regra ou do modelo. */
export function Rails({ title, cur, next, raw = next, go }: { title: string; cur: Gains; next: Gains; raw?: Gains; go: boolean }) {
  return (
    <div className="mt-auto flex flex-col gap-1.5 border-t border-line pt-3">
      <p className={`${LABEL} mb-0.5`}>{title}</p>
      {(["P", "I", "D"] as const).map((n, k) => (
        <Rail key={n} name={n} cur={cur[k]} next={next[k]} raw={raw[k]} bounds={BOUNDS[k]} go={go} />
      ))}
    </div>
  );
}

/** Trilho de um ganho: eixo relativo ao valor atual (±50%), faixa de ±30% por
 *  episódio e bounds. O valor sugerido (`raw`) que passa do bound bate e volta. */
function Rail({ name, cur, next, raw, bounds, go }: {
  name: string;
  cur: number;
  next: number;
  raw: number;
  bounds: [number, number];
  go: boolean;
}) {
  const pos = (v: number) => Math.min(100, Math.max(0, 50 + 100 * (v / cur - 1)));
  const [lo, hi] = bounds.map(pos);
  const hit = go && Math.abs(raw - next) > 1e-9;
  const to = go ? (hit ? [50, pos(raw), pos(next)] : [pos(next)]) : [50];
  const kf = <V,>(f: (v: number) => V) => (to.length > 1 ? to.map(f) : f(to[0]));
  const reduce = useReducedMotion();
  const transition = { duration: hit ? 1.1 : 0.8, times: hit ? [0, 0.45, 1] : undefined, ease: EASE };
  const changed = go && Math.abs(next - cur) > 1e-9;
  const zone = "absolute inset-y-0 bg-[repeating-linear-gradient(135deg,var(--color-line-strong)_0_1px,transparent_1px_4px)] transition-[left,width] duration-500";

  return (
    <div className="flex items-center gap-2.5">
      <span className="w-3 font-pixel text-sm leading-none text-fg">{name}</span>
      <div className="relative h-4 min-w-0 flex-1 border border-line bg-ink-950">
        <span className="absolute inset-y-0 left-[20%] w-[60%] border-x border-dashed border-blue-400/50 bg-blue-400/[0.06]" />
        {lo > 0 && <span className={`${zone} left-0`} style={{ width: `${lo}%` }} />}
        {hi < 100 && <span className={`${zone} right-0`} style={{ left: `${hi}%` }} />}
        {[lo, hi].map((b, k) =>
          b > 0 && b < 100 ? (
            <span key={k} className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-fg-muted transition-[left] duration-500" style={{ left: `${b}%` }}>
              {hit && k === (raw > next ? 1 : 0) && (
                <motion.span
                  className="absolute inset-0 bg-yellow-300"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.5] }}
                  transition={{ delay: 0.45, duration: 0.7 }}
                />
              )}
            </span>
          ) : null,
        )}
        <span className="absolute -inset-y-px left-1/2 w-px bg-fg-subtle" />
        <motion.span
          className="absolute inset-y-0 left-0 w-full origin-left bg-blue-400/20"
          initial={false}
          animate={{ scaleX: kf((v) => v / 100) }}
          transition={transition}
        />
        <motion.span className="absolute inset-0" initial={false} animate={{ x: kf((v) => `${v}%`) }} transition={transition}>
          <span className="absolute -inset-y-px -left-px w-0.5 bg-yellow-300" />
        </motion.span>
      </div>
      <span className="w-[5.75rem] shrink-0 whitespace-nowrap text-right font-mono text-[11px] tabular-nums text-fg-muted">
        {fmtGain(cur)}
        {changed && (
          <>
            <span className="text-fg-subtle"> → </span>
            <span className={hit ? "text-yellow-300" : "text-blue-300"}>{fmtGain(next)}</span>
          </>
        )}
      </span>
    </div>
  );
}
