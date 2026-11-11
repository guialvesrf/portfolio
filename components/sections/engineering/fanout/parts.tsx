"use client";

import { motion } from "motion/react";

/**
 * Linha tracejada de 1px. `cls` posiciona e orienta por breakpoint: a caixa tem espessura
 * zero no eixo cruzado, então `border-t` desenha uma linha horizontal e `border-l` uma vertical.
 */
export function Line({ cls, lit = false, children }: { cls: string; lit?: boolean; children?: React.ReactNode }) {
  return (
    <span className={`absolute border-dashed transition-colors duration-500 ${lit ? "border-blue-400/60" : "border-line-strong"} ${cls}`}>
      {children}
    </span>
  );
}

// Constantes fora do render: o motion não reinicia a animação quando o pai re-renderiza.
const START = { x: "0%", y: "0%", opacity: 0 };
const END = { x: "100%", y: "100%", opacity: 0 };
const GO_FWD = { x: "100%", y: "100%", opacity: [1, 1, 0] };
const GO_REV = { x: "0%", y: "0%", opacity: [1, 1, 0] };
const HOLD = 0.05; // segura no fim do trecho para emendar com o próximo sem piscar

/**
 * Pacote que percorre a `Line` pai. O invólucro tem o tamanho da linha e desliza 100% do
 * próprio tamanho, então o mesmo componente anda na horizontal e na vertical sem medir nada.
 */
export function Packet({ at, dur, rev = false }: { at: number; dur: number; rev?: boolean }) {
  return (
    <motion.span
      className="absolute inset-0"
      initial={rev ? END : START}
      animate={rev ? GO_REV : GO_FWD}
      transition={{ delay: at, duration: dur, ease: "linear", opacity: { delay: at, duration: dur + HOLD, times: [0, dur / (dur + HOLD), 1] } }}
    >
      <span className="absolute left-0 top-0 size-1.5 -translate-x-1/2 -translate-y-1/2 bg-blue-400 shadow-[0_0_8px_var(--color-blue-400)]" />
    </motion.span>
  );
}

const OFF = { opacity: 0 };
const BLINK = { opacity: [0, 1, 0] };

/** Piscada azul sobre um nó (pai `relative`). Remonte com `key` para repetir. */
export function Flash({ at = 0, dur = 0.5 }: { at?: number; dur?: number }) {
  return (
    <motion.span
      className="pointer-events-none absolute -inset-px border border-blue-400 bg-blue-400/10"
      initial={OFF}
      animate={BLINK}
      transition={{ delay: at, duration: dur }}
    />
  );
}

/** Ícone pixel a partir de um mapa de "0"/"1", na cor do texto. */
export function Pixels({ map, px = 3, className = "" }: { map: string[]; px?: number; className?: string }) {
  const w = map[0].length;
  return (
    <svg width={w * px} height={map.length * px} viewBox={`0 0 ${w} ${map.length}`} shapeRendering="crispEdges" aria-hidden className={className}>
      {map.flatMap((row, y) => [...row].map((c, x) => c === "1" && <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="currentColor" />))}
    </svg>
  );
}
