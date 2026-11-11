"use client";

import { useReducedMotion } from "motion/react";
import { useState } from "react";
import { Typewriter } from "@/components/ui/Typewriter";

const Prompt = ({ env }: { env?: string }) => (
  <span className="shrink-0 whitespace-nowrap">
    {env && <span className="text-fg-subtle">{env} </span>}
    <span className="text-blue-400">~/app</span> <span className="text-fg-subtle">$</span>
  </span>
);

/**
 * Mini terminal no rodapé do card: digita `cmd` ao entrar na tela, mostra `out`
 * linha a linha e deixa o cursor piscando no prompt seguinte.
 * Corpo com altura fixa (9 linhas) para não haver layout shift; linhas longas quebram com recuo.
 */
export function Terminal({ cmd, out, env, delay = 0 }: { cmd: string; out: string[]; env?: string; delay?: number }) {
  const [done, setTyped] = useState(false);
  const reduce = useReducedMotion();
  const typed = done || !!reduce; // sem animação: saída já visível
  const show = (i: number) => ({ opacity: typed ? 1 : 0, transition: `opacity 300ms ${typed ? 250 + i * 120 : 0}ms` });

  return (
    <div className="mt-auto border-t border-line bg-ink-950/60">
      <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2 bg-ink-800" />
          <span className="size-2 bg-ink-800" />
          <span className="size-2 bg-ink-800" />
        </span>
        <span className="truncate font-mono text-[11px] text-fg-subtle">~/app — zsh</span>
      </div>

      <div aria-hidden className="h-[212px] overflow-hidden p-4 font-mono text-xs leading-5 text-fg-muted">
        <div className="flex gap-[1ch]">
          <Prompt />
          <Typewriter text={cmd} speed={38} startDelay={delay} cursor={!typed} onDone={() => setTyped(true)} className="min-w-0 text-fg" />
        </div>
        {out.map((line, i) => (
          <div key={i} style={show(i)} className="whitespace-pre-wrap pl-[2ch] -indent-[2ch] [overflow-wrap:anywhere]">
            {line.startsWith("+ ") ? (
              <>
                <span className="text-green-500">+</span>
                {line.slice(1)}
              </>
            ) : (
              line
            )}
          </div>
        ))}
        <div style={show(out.length)} className="flex gap-[1ch]">
          <Prompt env={env} />
          <span>
            <span className="inline-block h-[1.05em] w-[0.5em] translate-y-[0.15em] animate-blink bg-fg" />
          </span>
        </div>
      </div>

      <pre className="sr-only">{[`$ ${cmd}`, ...out].join("\n")}</pre>
    </div>
  );
}
