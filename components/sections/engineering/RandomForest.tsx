"use client";

import type { Bilingual, Locale } from "@/lib/i18n";
import { Badge } from "@/components/ui/Badge";
import { CropMarks } from "@/components/ui/CropMarks";
import { STEP_LIMIT, prng, rails, type Gains } from "./pid/episodes";
import { LABEL, Rails, fmtGain, useTimeline } from "./pid/shared";

const content: Bilingual<{
  episodes: string;
  status: [rules: string, model: string, drive: string];
  profile: string;
  trees: string;
  features: [x: string, y: string];
  candidates: string;
  axes: string;
  mode: string;
  tie: string;
  rails: string;
  summary: string;
}> = {
  pt: {
    episodes: "Episódios de regime",
    status: ["regras decidem", "modelo liberado", "drive · aplica"],
    profile: "perfil",
    trees: "árvores",
    features: ["X = P, I, D, nível, SP", "y = score do episódio"],
    candidates: "candidatos",
    axes: "colunas P · linhas I",
    mode: "Modo",
    tie: "predições empatadas (spread < 1%) → regras decidem",
    rails: "Trilhos · os mesmos da regra",
    summary:
      "Animação da camada de machine learning do pid-service. Enquanto o histórico tem menos de 20 episódios de regime, as regras determinísticas decidem. Com 20, um RandomForestRegressor de 80 árvores é treinado com P, I, D, nível e setpoint para prever o score do episódio. Ele avalia uma grade de 5 × 5 × 5 = 125 candidatos, cada ganho entre −30% e +30% do PID atual, e escolhe o de menor score previsto (argmin). A sugestão passa pelos mesmos trilhos das regras, ±30% por episódio e limites, e só é aplicada no modo drive; em shadow ela só é registrada e em off a camada fica desligada. Se as predições praticamente empatam (variação menor que 1%), as regras decidem. O loop alterna entre dois perfis de operação.",
  },
  en: {
    episodes: "Steady-state episodes",
    status: ["rules decide", "model unlocked", "drive · applies"],
    profile: "profile",
    trees: "trees",
    features: ["X = P, I, D, level, SP", "y = episode score"],
    candidates: "candidates",
    axes: "columns P · rows I",
    mode: "Mode",
    tie: "predictions tied (spread < 1%) → rules decide",
    rails: "Rails · same as the rules",
    summary:
      "Animation of the pid-service machine learning layer. While history holds fewer than 20 steady-state episodes, the deterministic rules decide. At 20, an 80-tree RandomForestRegressor is trained on P, I, D, level and setpoint to predict the episode score. It scores a 5 × 5 × 5 grid of 125 candidates, each gain from −30% to +30% of the current PID, and picks the lowest predicted score (argmin). The suggestion goes through the same rails as the rules, ±30% per episode and bounds, and is only applied in drive mode; in shadow it is just logged and off disables the layer. If the predictions are nearly tied (spread under 1%), the rules decide. The loop alternates between two operating profiles.",
  },
};

const AXIS = [0, 1, 2, 3, 4];
const MODES = ["off", "shadow", "drive"];

// Dois perfis (setpoint + nível) ilustrativos. O "modelo" é uma tigela com ruído
// de seed: só a forma do mapa importa aqui, os números não são da planta.
// Índice do candidato: d·25 + i·5 + p (um painel por D, linhas I, colunas P).
const PROFILES = [
  { cur: [1.2, 0.1, 0.24] as Gains, center: [1, 1, 3], seed: 3 },
  { cur: [0.95, 0.08, 0.25] as Gains, center: [3, 3, 1], seed: 9 },
].map(({ cur, center, seed }) => {
  const r = prng(seed);
  const axes = cur.map((g) => AXIS.map((k) => g * (1 - STEP_LIMIT + (k * STEP_LIMIT) / 2))); // linspace(−30%, +30%, 5)
  const scores = Array.from({ length: 125 }, (_, n) => {
    const at = [n % 5, Math.floor(n / 5) % 5, Math.floor(n / 25)];
    return 4.1 + 0.55 * (at[0] - center[0]) ** 2 + 0.4 * (at[1] - center[1]) ** 2 + 0.35 * (at[2] - center[2]) ** 2 + 0.5 * r();
  });
  const lo = Math.min(...scores);
  const hi = Math.max(...scores);
  const best = scores.indexOf(lo);
  const pick: Gains = [axes[0][best % 5], axes[1][Math.floor(best / 5) % 5], axes[2][Math.floor(best / 25)]];
  return {
    cur,
    axes,
    best,
    score: lo,
    heat: scores.map((s) => Math.round(100 * (1 - (s - lo) / (hi - lo)) ** 2.5)),
    next: rails(pick, cur),
  };
});

// fase: 0 limpa · 1 histórico enche · 2 grade · 3 floresta · 4 predição · 5 argmin · 6 trilhos + drive
const FRAMES = PROFILES.flatMap((_, prof) => [
  { prof, phase: 0, count: 0, ms: 600 },
  ...Array.from({ length: 20 }, (_, k) => ({ prof, phase: 1, count: k + 1, ms: k === 19 ? 600 : 90 })),
  ...[1000, 1800, 1700, 1400, 3000].map((ms, k) => ({ prof, phase: k + 2, count: 20, ms })),
]);
const MS = FRAMES.map((f) => f.ms);
const STILL = FRAMES.findIndex((f) => f.prof === 0 && f.phase === 6);

const TREE = ["..#..", ".###.", "#####", ".###.", "#####", "..#.."]
  .flatMap((row, y) => [...row].map((ch, x) => (ch === "#" ? `M${x} ${y}h1v1h-1z` : "")))
  .join("");

export function RandomForest({ lang }: { lang: Locale }) {
  const t = content[lang];
  const { ref, step } = useTimeline<HTMLDivElement>(MS, STILL);
  const { prof, phase, count } = FRAMES[step];
  const p = PROFILES[prof];

  return (
    <div ref={ref} className="h-full">
      <p className="sr-only">{t.summary}</p>
      <div aria-hidden className="flex h-full flex-col gap-3.5">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <p className="flex items-baseline gap-2.5">
            <span className={LABEL}>{t.episodes}</span>
            <span className="font-pixel text-2xl leading-none text-fg tabular-nums">
              {String(count).padStart(2, "0")}
              <span className="text-base text-fg-subtle">/20</span>
            </span>
          </p>
          <span className="flex items-center gap-2.5">
            <span className={LABEL}>
              {t.profile} {"AB"[prof]}
            </span>
            <Badge tone={count < 20 ? "gray" : phase === 6 ? "green" : "blue"}>
              {t.status[count < 20 ? 0 : phase === 6 ? 2 : 1]}
            </Badge>
          </span>
        </div>

        <div className="grid grid-cols-20 gap-[3px]">
          {Array.from({ length: 20 }, (_, k) => (
            <span key={k} className={`h-2.5 transition-colors duration-150 ${k < count ? "bg-blue-400" : "bg-ink-800"}`} />
          ))}
        </div>

        <div className="grid items-center gap-3 sm:grid-cols-[minmax(0,1fr)_9.5rem] sm:gap-5">
          <svg viewBox="0 0 138 30" className="w-full" shapeRendering="crispEdges">
            {Array.from({ length: 80 }, (_, n) => {
              const col = n % 20;
              const row = Math.floor(n / 20);
              const fill = phase === 4 ? "fill-blue-300" : phase >= 3 ? "fill-blue-400" : "fill-fg-faint";
              return (
                <path
                  key={n}
                  d={TREE}
                  transform={`translate(${col * 7} ${row * 8})`}
                  className={`transition-colors duration-300 ${fill}`}
                  style={{ transitionDelay: phase >= 3 ? `${(col + row * 3) * 22}ms` : "0ms" }}
                />
              );
            })}
          </svg>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 sm:flex-col sm:items-start sm:gap-1.5">
            <p className="flex items-baseline gap-2">
              <span className="font-pixel text-3xl leading-none text-fg">80</span>
              <span className={LABEL}>{t.trees}</span>
            </p>
            <p className="font-mono text-[10px] text-fg-muted">RandomForestRegressor</p>
            {t.features.map((f) => (
              <p key={f} className="font-mono text-[10px] text-fg-subtle">
                {f}
              </p>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <p className={LABEL}>
              5×5×5 = 125 {t.candidates} · ±30%
            </p>
            <p className="font-mono text-[10px] text-fg-subtle">{t.axes}</p>
          </div>
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {AXIS.map((d) => (
              <div
                key={d}
                className={`flex flex-col gap-1 transition-opacity duration-500 ${phase >= 2 ? "" : "opacity-30"}`}
                style={{ transitionDelay: phase >= 2 ? `${d * 90}ms` : "0ms" }}
              >
                <span className="whitespace-nowrap font-mono text-[10px] text-fg-subtle">D {fmtGain(p.axes[2][d])}</span>
                <div className="grid grid-cols-5 gap-[2px]">
                  {AXIS.map((row) =>
                    AXIS.map((col) => {
                      const n = d * 25 + (4 - row) * 5 + col;
                      const lit = phase >= 4 ? (phase >= 5 && n !== p.best ? 0.55 : 1) : 0;
                      return (
                        <span key={n} className="relative aspect-square bg-ink-800">
                          <span
                            className="absolute inset-0 transition-opacity duration-300"
                            style={{
                              background: `color-mix(in oklab, var(--color-blue-400) ${p.heat[n]}%, var(--color-ink-800))`,
                              opacity: lit,
                              transitionDelay: phase === 4 ? `${(d * 25 + row * 5 + col) * 5}ms` : "0ms",
                            }}
                          />
                          {phase >= 5 && n === p.best && <CropMarks size={5} inset={-3} className="animate-pulse border-yellow-300" />}
                        </span>
                      );
                    }),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 font-mono text-[11px]">
            <span className={`${LABEL} text-yellow-300`}>argmin</span>
            {phase >= 5 ? (
              <>
                <span className="whitespace-nowrap text-fg">
                  P {fmtGain(p.next[0])} · I {fmtGain(p.next[1])} · D {fmtGain(p.next[2])}
                </span>
                <span className="whitespace-nowrap text-fg-subtle">
                  → score <span className="font-pixel text-base leading-none text-fg">{p.score.toFixed(2)}</span>
                </span>
              </>
            ) : (
              <span className="text-fg-subtle">—</span>
            )}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className={LABEL}>{t.mode}</span>
            <span className="flex font-mono text-[10px] uppercase leading-none tracking-[0.1em]">
              {MODES.map((m) => (
                <span
                  key={m}
                  className={`-ml-px border px-1.5 py-1 first:ml-0 ${m === "drive" ? "relative border-blue-400 bg-blue-600 text-fg" : "border-line text-fg-subtle"}`}
                >
                  {m}
                </span>
              ))}
            </span>
            <span className="font-mono text-[10px] text-fg-subtle">{t.tie}</span>
          </div>
        </div>

        <Rails title={t.rails} cur={p.cur} next={p.next} go={phase === 6} />
      </div>
    </div>
  );
}
