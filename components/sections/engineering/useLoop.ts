"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Contador que avança para sempre enquanto o elemento está visível.
 * `step = tick % ms.length`, cada passo dura `ms[step]`. Com movimento reduzido fica parado em `still`.
 */
export function useLoop<T extends HTMLElement>(ms: readonly number[], still: number) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const id = setTimeout(() => setTick((t) => t + 1), ms[tick % ms.length]);
    return () => clearTimeout(id);
  }, [inView, reduce, tick, ms]);

  const t = reduce ? still : tick;
  return { ref, tick: t, step: t % ms.length, cycle: Math.floor(t / ms.length), still: !!reduce };
}
