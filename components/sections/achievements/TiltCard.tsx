"use client";

import { motion, useReducedMotion, useSpring } from "motion/react";
import type { ReactNode } from "react";

const MAX = 6; // graus
const spring = { stiffness: 180, damping: 18, mass: 0.6 };

/** Entrada (fade + scale + brilho diagonal) e tilt 3D seguindo o mouse. O pai define o visual via `className`. */
export function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      initial={reduce ? false : { opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      onPointerMove={(e) => {
        // pointerType "mouse" = ponteiro fino; toque e caneta ficam parados.
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        rotateY.set(((e.clientX - r.left) / r.width - 0.5) * 2 * MAX);
        rotateX.set((0.5 - (e.clientY - r.top) / r.height) * 2 * MAX);
      }}
      onPointerLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
    >
      {children}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_38%,rgb(255_255_255/0.09)_50%,transparent_62%)]"
        initial={{ x: "-100%" }}
        whileInView={reduce ? undefined : { x: "100%" }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1.4, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
      />
    </motion.div>
  );
}
