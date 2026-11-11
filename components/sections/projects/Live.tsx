"use client";

import { useInView } from "motion/react";
import { useRef, type ReactNode } from "react";

/** Contêiner do diagrama: marca `data-paused` fora da tela e o CSS congela os pacotes. */
export function Live({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  return (
    <div ref={ref} aria-hidden className={className} data-paused={inView ? undefined : ""}>
      {children}
    </div>
  );
}
