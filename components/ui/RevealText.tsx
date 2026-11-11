"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Título que revela palavra por palavra (opacidade 0.12 → 1, cascata), como na referência.
 * `lines` quebra em linhas; `dim` deixa palavras finais num cinza para dar hierarquia.
 */
export function RevealText({ lines, as: Tag = "h2", className = "", delay = 0, stagger = 0.07 }: {
  lines: string[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  let i = 0;
  return (
    <Tag className={className}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(" ").map((word, wi, arr) => {
            const n = i++;
            return (
              <motion.span
                key={wi}
                className="inline-block"
                initial={reduce ? false : { opacity: 0.12, filter: "blur(2px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.5, delay: delay + n * stagger, ease: [0.16, 1, 0.3, 1] }}
              >
                {word}
                {wi < arr.length - 1 && " "}
              </motion.span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
