"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Digita `text` letra a letra quando visível. `onDone` dispara ao terminar.
 * O texto completo fica reservado (invisível) para o layout não pular.
 */
export function Typewriter({ text, speed = 28, startDelay = 0, cursor = true, onDone, className = "" }: {
  text: string;
  speed?: number;
  startDelay?: number;
  cursor?: boolean;
  onDone?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [typed, setN] = useState(0);
  const n = reduce ? text.length : typed;
  const done = n >= text.length;

  useEffect(() => {
    if (!inView || reduce) return;
    let i = 0;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      i++;
      setN(i);
      if (i < text.length) t = setTimeout(tick, speed + (Math.random() * speed) / 2);
    };
    t = setTimeout(tick, startDelay);
    return () => clearTimeout(t);
  }, [inView, reduce, text, speed, startDelay]);

  useEffect(() => {
    if (done && inView) onDone?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, inView]);

  return (
    <span ref={ref} className={`relative inline-grid ${className}`}>
      <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-pre-wrap">{text}</span>
      <span className="col-start-1 row-start-1 whitespace-pre-wrap">
        {text.slice(0, n)}
        {cursor && <span aria-hidden className={`ml-px inline-block h-[1.05em] w-[0.5em] translate-y-[0.15em] bg-current ${done ? "animate-blink" : ""}`} />}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
