"use client";

import { motion, useReducedMotion } from "motion/react";

/** Barra segmentada (pixel) revelada da esquerda para a direita ao entrar na tela. */
export function Bar({ width, className }: { width: string; className: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className={`absolute inset-y-0 left-0 bg-[repeating-linear-gradient(90deg,currentColor_0_4px,transparent_0_6px)] ${className}`}
      style={{ width }}
      initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
      whileInView={{ clipPath: "inset(0 0% 0 0)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}
