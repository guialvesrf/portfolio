import type { ReactNode } from "react";
import type { Bilingual, Locale } from "@/lib/i18n";
import { Badge } from "@/components/ui/Badge";
import { Counter } from "@/components/ui/Counter";
import { CropMarks } from "@/components/ui/CropMarks";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Bar } from "./highlights/Bar";
import { Contributions } from "./highlights/Contributions";

type Kpi = { tag: string; label: string; sub: string };

const content: Bilingual<{
  eyebrow: string;
  title: string[];
  description: string;
  before: string;
  after: string;
  live: string;
  perMonth: string;
  kpis: Kpi[];
}> = {
  pt: {
    eyebrow: "Destaques",
    title: ["Números que", "saíram do código"],
    description: "Resultados medidos em produção, no back-end que eu escrevo e mantenho.",
    before: "Antes",
    after: "Depois",
    live: "Em produção",
    perMonth: "mil/mês",
    kpis: [
      { tag: "Desempenho", label: "Payload do painel no 1º acesso", sub: "4,75 MB → 1,26 MB" },
      { tag: "Consultas", label: "Paginação de eventos com índice", sub: "antes 96 ms · 300 mil registros" },
      { tag: "Rede", label: "Chamadas à API sobre conexões TCP", sub: "trocar de tela não reconecta o WebSocket" },
      { tag: "Impacto", label: "Redução de custo na Cargill, Jataí-GO", sub: "algoritmos determinístico + random forest do pid-service" },
    ],
  },
  en: {
    eyebrow: "Highlights",
    title: ["Numbers that", "came out of the code"],
    description: "Results measured in production, on the back end I write and maintain.",
    before: "Before",
    after: "After",
    live: "In production",
    perMonth: "k/mo",
    kpis: [
      { tag: "Performance", label: "Dashboard payload on first load", sub: "4.75 MB → 1.26 MB" },
      { tag: "Queries", label: "Event pagination with an index", sub: "was 96 ms · 300k rows" },
      { tag: "Network", label: "API calls over TCP connections", sub: "switching screens no longer reconnects the WebSocket" },
      { tag: "Impact", label: "Cost reduction at Cargill, Jataí-GO, Brazil", sub: "deterministic + random forest algorithms in pid-service" },
    ],
  },
};

// Ícones pixel 10×10 ("#" = pixel aceso), desenhados a 20px = 2px por pixel.
const icons = [
  ["....##....", "....##....", "....##....", "..#.##.#..", "...####...", "....##....", "..........", "#........#", "#........#", "##########"],
  ["....####..", "...####...", "..####....", ".####.....", ".#######..", "....###...", "...###....", "..###.....", "..##......", ".#........"],
  ["###....###", "#.#....#.#", "###....###", ".#......#.", "..#....#..", "...#..#...", "...####...", "...#..#...", "...####...", ".........."],
  ["#.........", "#.#.......", "#..#......", "#...#.....", "#....#..#.", "#.....#.#.", "#......##.", "#.....###.", "#.........", "##########"],
];

// Largura da barra "depois" relativa ao "antes" (4,75 → 1,26 MB · 96 → 0,04 ms · 40 → 10).
const afterWidths = ["26.5%", "max(2px, 0.04%)", "25%"];

function PixelIcon({ rows, className }: { rows: string[]; className: string }) {
  return (
    <svg viewBox="0 0 10 10" aria-hidden shapeRendering="crispEdges" fill="currentColor" className={`size-5 shrink-0 transition-colors duration-300 ${className}`}>
      {rows.flatMap((row, y) => [...row].map((c, x) => (c === "#" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" /> : null)))}
    </svg>
  );
}

export function Highlights({ lang }: { lang: Locale }) {
  const t = content[lang];
  const locale = lang === "pt" ? "pt-BR" : "en-US";
  const unit = "font-mono text-sm text-fg-muted";

  const values: ReactNode[] = [
    <Counter key="pct" to={74} prefix="−" suffix="%" locale={locale} />,
    <>
      <Counter from={96} to={0.04} decimals={2} locale={locale} />
      <span className={unit}>ms</span>
    </>,
    <>
      <span className="tabular-nums">40</span>
      <span className="font-mono text-sm text-fg-subtle">→</span>
      <Counter from={40} to={10} locale={locale} />
    </>,
    <>
      <span className={unit}>R$</span>
      <Counter to={22} locale={locale} />
      <span className={unit}>{t.perMonth}</span>
    </>,
  ];

  return (
    <Section id="destaques">
      <SectionHeader eyebrow={t.eyebrow} title={t.title} description={t.description} />

      <div className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {t.kpis.map((k, i) => {
          const hl = i === 3;
          return (
            <Reveal key={k.tag} delay={i * 0.08} className="h-full">
              <article
                className={`group relative flex h-full flex-col border bg-ink-900 p-5 transition-colors duration-300 hover:bg-ink-850 sm:p-7 ${
                  hl
                    ? "border-blue-600/70 bg-[radial-gradient(120%_70%_at_100%_0%,rgb(5_74_178/0.16),transparent_60%)] hover:border-blue-400/70"
                    : "border-line hover:border-line-strong"
                }`}
              >
                {hl && <CropMarks size={10} inset={-1} />}
                <div className="flex items-start justify-between gap-3">
                  <span className="truncate font-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-fg-subtle">
                    0{i + 1} <span className="text-blue-400">■</span> {k.tag}
                  </span>
                  <PixelIcon rows={icons[i]} className={hl ? "text-blue-400" : "text-fg-subtle group-hover:text-blue-400"} />
                </div>

                <p className="mt-8 flex items-baseline gap-1.5 whitespace-nowrap font-pixel text-[clamp(2.25rem,1.6rem+1.6vw,3rem)] leading-none text-blue-400 sm:mt-10">
                  {values[i]}
                </p>
                <h3 className="mt-4 text-pretty text-[15px] leading-snug text-fg">{k.label}</h3>
                <p className="mt-2 text-pretty font-mono text-[11px] leading-relaxed text-fg-subtle">{k.sub}</p>

                <div className="mt-auto flex min-h-7 flex-col justify-end pt-6">
                  {hl ? (
                    <Badge tone="green" className="self-start">{t.live}</Badge>
                  ) : (
                    <div className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase leading-none tracking-[0.1em] text-fg-subtle">
                      <span>{t.before}</span>
                      <span className="relative h-1.5 bg-[repeating-linear-gradient(90deg,currentColor_0_4px,transparent_0_6px)] text-ink-800">
                        <Bar width="100%" className="text-fg-subtle" />
                      </span>
                      <span>{t.after}</span>
                      <span className="relative h-1.5 bg-[repeating-linear-gradient(90deg,currentColor_0_4px,transparent_0_6px)] text-ink-800">
                        <Bar width={afterWidths[i]} className="text-blue-400" />
                      </span>
                    </div>
                  )}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      <Contributions lang={lang} />
    </Section>
  );
}
