"use client";

import { motion } from "motion/react";
import { useId } from "react";
import type { Bilingual, Locale } from "@/lib/i18n";
import { Badge } from "@/components/ui/Badge";
import { EPISODES, SP_Y, VIEW } from "./pid/episodes";
import { EASE, LABEL, Num, Rails, useTimeline } from "./pid/shared";

const content: Bilingual<{
  episode: string;
  samples: string;
  status: [collecting: string, evaluating: string, rules: string, rule: string, hold: string];
  setpoint: string;
  legend: [filtered: string, raw: string, note: string];
  window: string;
  tail: string;
  metrics: string;
  metric: [label: string, note: string][];
  lower: string;
  rules: string;
  rule: string[];
  rails: string;
  summary: string;
}> = {
  pt: {
    episode: "Episódio",
    samples: "300 amostras ≈ 5 min",
    status: ["coletando", "avaliando", "regras", "regra", "mantém"],
    setpoint: "setpoint",
    legend: ["mediana-3", "bruto", "glitch de 1 amostra descartado"],
    window: "janela de regulação",
    tail: "cauda",
    metrics: "Métricas",
    metric: [["overshoot", ""], ["undershoot", ""], ["oscilação", "σ cauda"], ["offset", "média cauda"], ["Hz saturado", ""]],
    lower: "menor = melhor",
    rules: "Regras · a 1ª que casa",
    rule: ["overshoot / undershoot", "Hz saturado / varrendo", "oscilação", "offset abaixo do setpoint", "offset acima do setpoint", "dentro da tolerância"],
    rails: "Trilhos · passo ±30% · bounds",
    summary:
      "Animação de três episódios de sintonia. Cada episódio tem 300 amostras de temperatura (cerca de 5 minutos), filtradas por mediana de 3. A partir do primeiro cruzamento do setpoint, a janela de regulação, saem overshoot, undershoot, oscilação e offset (desvio padrão e média do último quarto) e a fração de Hz saturado, que compõem um score ponderado: menor é melhor. As regras são avaliadas nesta ordem e a primeira que casa decide: 1, overshoot ou undershoot, aumenta D e reduz P; 2, Hz saturado ou varrendo a faixa, reduz P e aumenta D; 3, oscilação, reduz P e I; 4, offset abaixo do setpoint, aumenta I e P levemente; 5, offset acima, reduz P e I; senão mantém o PID. O PID sugerido passa pelos trilhos: no máximo ±30% por episódio e dentro dos limites. No exemplo, o episódio 1 tem overshoot e o D sugerido bate no limite; o episódio 2 oscila; o episódio 3 fica dentro da tolerância e o PID é mantido.",
  },
  en: {
    episode: "Episode",
    samples: "300 samples ≈ 5 min",
    status: ["collecting", "evaluating", "rules", "rule", "hold"],
    setpoint: "setpoint",
    legend: ["median-3", "raw", "1-sample glitch dropped"],
    window: "regulation window",
    tail: "tail",
    metrics: "Metrics",
    metric: [["overshoot", ""], ["undershoot", ""], ["oscillation", "tail σ"], ["offset", "tail mean"], ["Hz saturated", ""]],
    lower: "lower is better",
    rules: "Rules · first match wins",
    rule: ["overshoot / undershoot", "Hz saturated / sweeping", "oscillation", "offset below setpoint", "offset above setpoint", "within tolerance"],
    rails: "Rails · ±30% step · bounds",
    summary:
      "Animation of three tuning episodes. Each episode holds 300 temperature samples (about 5 minutes), cleaned by a median-of-3 filter. From the first setpoint crossing on, the regulation window, it measures overshoot, undershoot, oscillation and offset (standard deviation and mean of the last quarter) plus the share of saturated Hz, combined into a weighted score where lower is better. Rules run in this order and the first match decides: 1, overshoot or undershoot, raise D and lower P; 2, Hz saturated or sweeping the range, lower P and raise D; 3, oscillation, lower P and I; 4, offset below setpoint, raise I and P slightly; 5, offset above, lower P and I; otherwise keep the PID. The suggested PID then goes through the rails: at most ±30% per episode and within bounds. In the example, episode 1 overshoots and the suggested D hits its bound; episode 2 oscillates; episode 3 is within tolerance and the PID is kept.",
  },
};

const ACTIONS = ["D↑ P↓", "P↓ D↑", "P↓ I↓", "I↑ (P↑)", "P↓ I↓"];
const HOT = [[0, 1], [4], [2], [3], [3], []]; // métricas que dispararam cada regra
const DRAW = 2.2; // s para desenhar as 300 amostras

// fase: 0 limpa · 1 desenha · 2 métricas · 3 cursor desce as regras · 4 trilhos
const FRAMES = EPISODES.flatMap((e, ep) => [
  { ep, phase: 0, cursor: -1, ms: 500 },
  { ep, phase: 1, cursor: -1, ms: (DRAW + 0.5) * 1000 },
  { ep, phase: 2, cursor: -1, ms: 1300 },
  ...Array.from({ length: e.rule + 1 }, (_, c) => ({ ep, phase: 3, cursor: c, ms: c === e.rule ? 1100 : 550 })),
  { ep, phase: 4, cursor: e.rule, ms: 2800 },
]);
const MS = FRAMES.map((f) => f.ms);
const STILL = FRAMES.findIndex((f) => f.ep === 0 && f.phase === 4);

/** Aparece quando a curva chega na fração `at` do eixo x. */
const fade = (on: boolean, at = 0) => ({
  initial: false as const,
  animate: { opacity: on ? 1 : 0 },
  transition: on ? { delay: at * DRAW, duration: 0.4 } : { duration: 0.2 },
});

export function PidRules({ lang }: { lang: Locale }) {
  const t = content[lang];
  const { ref, step } = useTimeline<HTMLDivElement>(MS, STILL);
  const { ep, phase, cursor } = FRAMES[step];
  const e = EPISODES[ep];
  const drawn = phase >= 1;
  const c = drawn ? e : EPISODES.at(ep - 1)!; // curva em tela (a anterior sai na fase 0)
  const shown = phase >= 2 ? e : EPISODES.at(ep - 1)!; // métricas anteriores esmaecidas até recalcular
  const decided = phase === 4;
  const hot = phase >= 3 && cursor === e.rule ? HOT[e.rule] : [];
  const clip = useId();
  const { overshoot, undershoot, oscillation, offset, sat } = shown.m;
  const values = [overshoot, undershoot, oscillation, offset, sat * 100];

  return (
    <div ref={ref} className="h-full">
      <p className="sr-only">{t.summary}</p>
      <div aria-hidden className="flex h-full flex-col gap-3.5">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <p className={`${LABEL} flex items-center gap-1.5`}>
            {t.episode}
            <span className="font-pixel text-sm leading-none text-blue-400">{String(ep + 1).padStart(2, "0")}</span>
            <span>· {t.samples}</span>
          </p>
          <Badge tone={decided ? (e.rule < 5 ? "blue" : "green") : "gray"}>
            {decided ? (e.rule < 5 ? `${t.status[3]} ${e.rule + 1}` : t.status[4]) : t.status[Math.max(0, phase - 1)]}
          </Badge>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="dot-grid relative h-[120px] w-full border border-line sm:h-[150px]">
            <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} preserveAspectRatio="none" className="absolute inset-0 size-full">
              <defs>
                <clipPath id={clip}>
                  <motion.rect
                    x={0}
                    y={0}
                    height={VIEW.h}
                    initial={false}
                    animate={{ width: drawn ? VIEW.w : 0 }}
                    transition={drawn ? { duration: DRAW, ease: "linear" } : { duration: 0.3, ease: EASE }}
                  />
                </clipPath>
              </defs>
              <motion.g {...fade(drawn, c.cross)} shapeRendering="crispEdges">
                <rect x={c.cross * VIEW.w} width={VIEW.w} height={VIEW.h} className="fill-blue-400/[0.07]" />
                <line x1={c.cross * VIEW.w} x2={c.cross * VIEW.w} y2={VIEW.h} strokeDasharray="2 3" vectorEffect="non-scaling-stroke" className="stroke-blue-400/60" />
              </motion.g>
              <motion.rect {...fade(drawn, c.tail)} x={c.tail * VIEW.w} width={VIEW.w} height={VIEW.h} shapeRendering="crispEdges" className="fill-blue-400/[0.07]" />
              <line x2={VIEW.w} y1={SP_Y * VIEW.h} y2={SP_Y * VIEW.h} strokeDasharray="4 4" vectorEffect="non-scaling-stroke" shapeRendering="crispEdges" className="stroke-fg-subtle" />
              <g clipPath={`url(#${clip})`} fill="none">
                <path d={c.rawPath} strokeWidth={1} vectorEffect="non-scaling-stroke" className="stroke-fg-subtle/70" />
                <path d={c.path} strokeWidth={1.75} strokeLinejoin="round" vectorEffect="non-scaling-stroke" className="stroke-blue-400" />
              </g>
              <motion.g {...fade(drawn, c.peak.x)} shapeRendering="crispEdges" className="stroke-yellow-300">
                <line x1={c.peak.x * VIEW.w} x2={c.peak.x * VIEW.w} y1={SP_Y * VIEW.h} y2={c.peak.y * VIEW.h} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
                <line x1={c.peak.x * VIEW.w - 6} x2={c.peak.x * VIEW.w + 6} y1={c.peak.y * VIEW.h} y2={c.peak.y * VIEW.h} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
              </motion.g>
            </svg>
            <span className={`${LABEL} absolute left-1.5 -translate-y-[calc(100%+4px)]`} style={{ top: `${SP_Y * 100}%` }}>
              {t.setpoint}
            </span>
            <motion.span {...fade(drawn, c.cross)} className={`${LABEL} absolute bottom-1.5 text-blue-300`} style={{ left: `calc(${c.cross * 100}% + 6px)` }}>
              {t.window}
            </motion.span>
            <motion.span {...fade(drawn, c.tail)} className={`${LABEL} absolute bottom-1.5 right-1.5 text-blue-300`}>
              {t.tail}
            </motion.span>
          </div>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] text-fg-subtle">
            <span className="flex items-center gap-1.5"><i className="h-0.5 w-3 bg-blue-400" />{t.legend[0]}</span>
            <span className="flex items-center gap-1.5"><i className="h-px w-3 bg-fg-subtle/70" />{t.legend[1]}</span>
            <span>{t.legend[2]}</span>
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] sm:gap-5">
          <div className={`flex flex-col gap-2 transition-opacity duration-300 ${phase >= 2 ? "" : "opacity-40"}`}>
            <p className={LABEL}>{t.metrics}</p>
            <dl className="flex flex-col gap-1 font-mono text-[11px]">
              {t.metric.map(([label, note], k) => (
                <div key={label} className="flex items-baseline justify-between gap-3">
                  <dt className="truncate text-fg-muted">
                    {label} <span className="text-fg-subtle">{note}</span>
                  </dt>
                  <dd className={`whitespace-nowrap transition-colors duration-300 ${hot.includes(k) ? "text-blue-300" : "text-fg"}`}>
                    <Num value={values[k]} decimals={k === 4 ? 0 : 1} />
                    <span className="text-fg-subtle"> {k === 4 ? "%" : "°C"}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <div className="flex items-end justify-between gap-3 border-t border-line pt-2">
              <span className="flex flex-col gap-1">
                <span className={LABEL}>score</span>
                <span className="font-mono text-[10px] text-fg-subtle">{t.lower}</span>
              </span>
              <span className="font-pixel text-2xl leading-none text-fg">
                <Num value={shown.score} />
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className={LABEL}>{t.rules}</p>
            <ol className="flex flex-col font-mono text-[11px]">
              {t.rule.map((label, i) => {
                const state = phase < 3 || i > cursor ? "idle" : i < cursor ? "miss" : i === e.rule ? "match" : "check";
                return (
                  <li
                    key={label}
                    className={`flex h-[22px] items-center gap-2 border-l-2 px-2 transition-colors duration-300 ${
                      {
                        idle: "border-transparent text-fg-muted",
                        miss: "border-transparent text-fg-subtle",
                        check: "border-blue-400 bg-ink-850 text-fg",
                        match: "border-blue-400 bg-blue-600/25 text-fg",
                      }[state]
                    }`}
                  >
                    <span className="w-2.5 shrink-0 text-fg-subtle">{i < 5 ? i + 1 : "–"}</span>
                    <span className="min-w-0 flex-1 truncate">{label}</span>
                    <span className={`shrink-0 whitespace-nowrap ${state === "match" ? "text-blue-300" : ""}`}>
                      {ACTIONS[i] ?? t.status[4]}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <Rails title={t.rails} cur={e.cur} next={e.next} raw={e.proposed} go={decided} />
      </div>
    </div>
  );
}
