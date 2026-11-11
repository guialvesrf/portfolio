import type { CSSProperties } from "react";
import { cacheLife } from "next/cache";
import type { Bilingual, Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { HeatmapFrame } from "./HeatmapFrame";
import s from "./heatmap.module.css";

type Day = { date: string; count: number; level: number };

/** Contribuições do último ano. Falha vira `null` (cacheado só por minutos, para tentar de novo logo). */
async function getContributions(): Promise<{ total: number; days: Day[] } | null> {
  "use cache";
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${site.handle}?y=last`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const json = await res.json();
    if (typeof json?.total?.lastYear !== "number" || !Array.isArray(json.contributions) || !json.contributions.length)
      throw new Error("formato inesperado");
    cacheLife("days");
    return {
      total: json.total.lastYear,
      days: json.contributions.map(({ date, count, level }: Day) => ({ date, count, level })),
    };
  } catch {
    cacheLife("minutes");
    return null;
  }
}

const content: Bilingual<{
  label: string;
  group: string;
  unit: string;
  source: string;
  error: string;
  less: string;
  more: string;
  on: string;
  days: string[];
  count: (n: number) => string;
}> = {
  pt: {
    label: "Contribuições · últimos 12 meses",
    group: "Gráfico de contribuições no GitHub, um quadrado por dia",
    unit: "contribuições",
    source: "Fonte: GitHub · atualiza 1× por dia",
    error: "Não foi possível carregar os dados agora",
    less: "Menos",
    more: "Mais",
    on: "em",
    days: ["", "Seg", "", "Qua", "", "Sex", ""],
    count: (n) => (n === 0 ? "Nenhuma contribuição" : n === 1 ? "1 contribuição" : `${n} contribuições`),
  },
  en: {
    label: "Contributions · last 12 months",
    group: "GitHub contribution graph, one square per day",
    unit: "contributions",
    source: "Source: GitHub · refreshed daily",
    error: "Couldn't load the data right now",
    less: "Less",
    more: "More",
    on: "on",
    days: ["", "Mon", "", "Wed", "", "Fri", ""],
    count: (n) => (n === 0 ? "No contributions" : n === 1 ? "1 contribution" : `${n} contributions`),
  },
};

const utc = (date: string) => new Date(`${date}T00:00:00Z`);

export async function Contributions({ lang }: { lang: Locale }) {
  const t = content[lang];
  const locale = lang === "pt" ? "pt-BR" : "en-US";
  const data = await getContributions();

  // Semanas começam no domingo: completa a 1ª semana com vazios e fica com as últimas 53 colunas.
  // Sem dados: grade cinza de 53 × 7.
  const cells: (Day | null)[] = data
    ? [...Array<null>(utc(data.days[0].date).getUTCDay()).fill(null), ...data.days]
    : Array.from({ length: 53 * 7 }, () => ({ date: "", count: 0, level: 0 }));
  const weeks: (Day | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  const cols = weeks.slice(-53);
  const last = (cols.length - 1) * 7 + cols[cols.length - 1].length - 1;

  // Rótulo de mês na 1ª coluna cujo domingo cai no mês; some se não couber (< 3 colunas até o próximo / o fim).
  const monthFmt = new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" });
  const months: { w: number; m: string; text: string }[] = [];
  cols.forEach((week, w) => {
    const date = week.find((c) => c?.date)?.date;
    if (!date || date.slice(0, 7) === months[months.length - 1]?.m) return;
    const text = monthFmt.format(utc(date)).replace(".", "");
    months.push({ w, m: date.slice(0, 7), text: text[0].toUpperCase() + text.slice(1) });
  });
  const shownMonths = months.filter((l, i) => (months[i + 1]?.w ?? cols.length + 1) - l.w >= 3);

  const dateFmt = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  const columns = { gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr))` };

  return (
    <Reveal className="mt-4 sm:mt-5">
      <div className="border border-line bg-ink-900 p-5 transition-colors duration-300 hover:border-line-strong sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 flex-col gap-3">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle">{t.label}</h3>
            <p className="flex items-baseline gap-2 whitespace-nowrap">
              <span className="font-pixel text-[clamp(2.25rem,1.6rem+1.6vw,3rem)] leading-none text-fg">
                {data ? <Counter to={data.total} locale={locale} /> : <span className="text-fg-faint">—</span>}
              </span>
              <span className="font-mono text-sm text-fg-muted">{t.unit}</span>
            </p>
          </div>
          <a
            href={site.social.github}
            target="_blank"
            rel="noreferrer"
            className="-mx-1 inline-flex min-h-10 items-center gap-1.5 self-start px-1 font-mono text-xs text-fg-muted transition-colors duration-300 hover:text-blue-400 sm:self-auto"
          >
            github.com/{site.handle}
            <span aria-hidden>↗</span>
          </a>
        </div>

        <div className="mt-6 sm:mt-8">
          <HeatmapFrame label={t.group} days={t.days}>
            {/* < lg: largura mínima de célula 10px + respiro de 12% sob o fade-x. ≥ lg: preenche o card. */}
            <div className="box-content max-lg:px-[12%]" style={{ minWidth: cols.length * 12 - 2 }}>
              <div aria-hidden className="mb-1.5 grid h-3 gap-x-[2px] font-mono text-[10px] leading-3 text-fg-subtle lg:gap-x-[3px]" style={columns}>
                {shownMonths.map((l) => (
                  <span key={l.m} className="whitespace-nowrap" style={{ gridColumnStart: l.w + 1 }}>
                    {l.text}
                  </span>
                ))}
              </div>
              <div className="grid gap-[2px] lg:gap-[3px]" style={columns}>
                {cols.map((week, w) => (
                  <div key={w} className={`${s.col} grid content-start gap-[2px] lg:gap-[3px]`} style={{ "--i": w } as CSSProperties}>
                    {week.map((c, d) => {
                      const i = w * 7 + d;
                      return c?.date ? (
                        <span
                          key={d}
                          data-i={i}
                          data-l={c.level}
                          role="img"
                          aria-label={`${t.count(c.count)} ${t.on} ${dateFmt.format(utc(c.date))}`}
                          tabIndex={i === last ? 0 : -1}
                          className={s.cell}
                        />
                      ) : (
                        <span key={d} className={`${s.cell} ${c ? "" : "invisible"}`} />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </HeatmapFrame>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 font-mono text-[10px] uppercase tracking-[0.1em] text-fg-subtle">
          <span>{data ? t.source : t.error}</span>
          <span className="flex items-center gap-1.5" aria-hidden>
            {t.less}
            {[0, 1, 2, 3, 4].map((l) => (
              <span key={l} data-l={l} className={`${s.cell} w-2.5`} />
            ))}
            {t.more}
          </span>
        </div>
      </div>
    </Reveal>
  );
}
