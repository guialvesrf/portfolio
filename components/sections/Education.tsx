import type { Bilingual, Locale } from "@/lib/i18n";
import { Badge } from "@/components/ui/Badge";
import { CropMarks } from "@/components/ui/CropMarks";
import { PixelNotch } from "@/components/ui/PixelNotch";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TimelineMarker } from "./Experience";

const CAP = [
  "00000011000000",
  "00001111110000",
  "00111111111100",
  "11111111111111",
  "00111111111101",
  "00001111110001",
  "00010011001001",
  "00011100111001",
  "00011111111011",
  "00011111111011",
];
const BOOK = [
  "01110000001110",
  "10001100110001",
  "10000011000001",
  "10111011011101",
  "10000011000001",
  "10111011011101",
  "10000011000001",
  "10000011000001",
  "11110011001111",
  "00001111110000",
];

/** Ícone bitmap: cada "1" do mapa vira um pixel. */
function PixelIcon({ map }: { map: string[] }) {
  const d = map.flatMap((row, y) => [...row].map((c, x) => (c === "1" ? `M${x} ${y}h1v1h-1z` : ""))).join("");
  return (
    <svg viewBox={`0 0 ${map[0].length} ${map.length}`} width={map[0].length * 2} height={map.length * 2} shapeRendering="crispEdges" aria-hidden>
      <path d={d} fill="currentColor" />
    </svg>
  );
}

const schools = [
  { icon: CAP, name: "UniRV", full: "Universidade de Rio Verde", start: "2026", current: true },
  { icon: BOOK, name: "FIAP", start: "2024", end: "2025" },
];

const content: Bilingual<{
  eyebrow: string;
  title: string[];
  description: string;
  degree: string;
  present: string;
  status: { current: string; ended: string };
}> = {
  pt: {
    eyebrow: "Formação",
    title: ["Base", "acadêmica"],
    description: "Engenharia de Software, na FIAP e agora na UniRV.",
    degree: "Bacharelado em Engenharia de Software",
    present: "atual",
    status: { current: "cursando", ended: "encerrado" },
  },
  en: {
    eyebrow: "Education",
    title: ["Academic", "background"],
    description: "Software Engineering, at FIAP and now at UniRV.",
    degree: "B.Sc. in Software Engineering",
    present: "present",
    status: { current: "in progress", ended: "ended" },
  },
};

export function Education({ lang }: { lang: Locale }) {
  const t = content[lang];
  return (
    <Section id="formacao">
      <SectionHeader eyebrow={t.eyebrow} title={t.title} description={t.description} />

      {/* Timeline horizontal ligando os cards (só desktop). */}
      <div aria-hidden className="relative mt-16 hidden grid-cols-2 gap-5 md:grid">
        <span className="fade-x absolute inset-x-0 top-1/2 h-px bg-size-[8px_1px] bg-[linear-gradient(to_right,var(--color-fg-faint)_50%,transparent_0)]" />
        {schools.map((s) => (
          <div key={s.name} className="relative pl-7">
            <TimelineMarker current={s.current} />
          </div>
        ))}
      </div>

      <ul className="mt-12 grid gap-4 sm:mt-16 sm:gap-5 md:mt-5 md:grid-cols-2">
        {schools.map((s, i) => (
          <li key={s.name}>
            <Reveal delay={i * 0.1} className="h-full">
              <article className="relative flex h-full flex-col gap-14 border border-line bg-ink-900 p-5 transition-colors duration-300 hover:border-line-strong hover:bg-ink-850 sm:p-7">
                <PixelNotch corner={i ? "br" : "tr"} size={10} />
                <span className="relative grid size-16 place-items-center text-fg">
                  <CropMarks />
                  <PixelIcon map={s.icon} />
                </span>
                <div className="mt-auto flex flex-col gap-3">
                  <p className="font-mono text-[28px] uppercase leading-none tracking-tight text-fg tabular-nums lg:text-4xl">
                    {s.start} – {s.current ? t.present : s.end}
                  </p>
                  <h3 className="mt-2 text-balance font-pixel text-xl leading-tight text-fg sm:text-2xl">{t.degree}</h3>
                  <p className="text-[15px] text-fg-muted">
                    <span className="font-medium text-fg">{s.name}</span>
                    {s.full && <> · {s.full}</>}
                  </p>
                  <Badge tone={s.current ? "green" : "gray"} className="mt-2 self-start">
                    {s.current ? t.status.current : t.status.ended}
                  </Badge>
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
