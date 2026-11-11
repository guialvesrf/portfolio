import type { CSSProperties } from "react";
import type { Bilingual, Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { HeroMock } from "./hero/HeroMock";
import s from "./hero/hero.module.css";

const content: Bilingual<{ eyebrow: string; title: string[]; sub: string; primary: string; secondary: string }> = {
  pt: {
    eyebrow: "Guilherme Alves · Desenvolvedor Back-End",
    title: ["Sistemas em tempo real,", "do CLP ao navegador"],
    sub: "Back-end em Go, TypeScript/Bun e Python. Construo serviços que conversam com equipamento industrial, aprendem com os dados e continuam testáveis sem o hardware ligado.",
    primary: "Ver projetos",
    secondary: "Contato",
  },
  en: {
    eyebrow: "Guilherme Alves · Back-End Developer",
    title: ["Real-time systems,", "from PLC to browser"],
    sub: "Back-end in Go, TypeScript/Bun and Python. I build services that talk to industrial equipment, learn from the data and stay testable with the hardware switched off.",
    primary: "See projects",
    secondary: "Contact",
  },
};

const tech = ["Go", "Gin", "TypeScript", "Bun", "Python", "scikit-learn", "PostgreSQL", "SQLite", "Prisma", "Docker", "GitHub Actions", "WebSocket", "Modbus TCP", "Raspberry Pi", "nginx", "React"];

// mulberry32 com seed fixa: a nuvem de quadrados é sempre a mesma.
let seed = 20;
const rand = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const squares = Array.from({ length: 72 }, () => ({
  x: (rand() * 104 - 4).toFixed(2),
  y: (rand() * 100).toFixed(2),
  size: Math.round(26 + rand() * 30),
  r: Math.round(rand() * 90),
  d: (10 + rand() * 10).toFixed(1),
  dl: (-rand() * 20).toFixed(1),
  strong: rand() > 0.4,
}));

export function Hero({ lang }: { lang: Locale }) {
  const t = content[lang];
  return (
    <section className="noise overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-36 lg:pb-6">
      <div
        aria-hidden
        className={`${s.fade} pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_50%_0%,var(--color-ink-850),transparent_70%)]`}
      />

      <Container className="relative flex flex-col items-center text-center">
        <Reveal delay={0.1}>
          <Eyebrow className="max-sm:tracking-[0.06em]">{t.eyebrow}</Eyebrow>
        </Reveal>
        <RevealText
          as="h1"
          lines={t.title}
          delay={0.2}
          stagger={0.08}
          className="mt-6 text-balance font-pixel text-[clamp(2.5rem,7vw,5rem)] leading-[1.05] tracking-[-0.01em] text-fg"
        />
        <Reveal delay={0.55}>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">{t.sub}</p>
        </Reveal>
        <Reveal delay={0.7} className="mt-8 w-full sm:w-auto">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="#projetos" className="w-full sm:w-auto">{t.primary}</Button>
            <Button href="#contato" variant="outline" className="w-full sm:w-auto">{t.secondary}</Button>
          </div>
        </Reveal>

        <Reveal delay={0.85} className="mt-14 w-full max-w-4xl overflow-hidden fade-x sm:mt-16">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1 || undefined} aria-label={copy ? undefined : "Stack"} className="flex shrink-0">
                {tech.map((name) => (
                  <li key={name} className="flex items-center gap-3 whitespace-nowrap pr-8 font-mono text-sm text-fg-subtle sm:pr-12 sm:text-[15px]">
                    <span aria-hidden className="size-1.5 bg-fg-faint" />
                    {name}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </Reveal>
      </Container>

      <div className="relative mt-14 sm:mt-20 lg:mt-10">
        <div
          aria-hidden
          className={`${s.cloud} pointer-events-none absolute inset-x-0 -top-16 h-[680px] [mask-image:linear-gradient(to_bottom,transparent,#000_25%,#000_65%,transparent)]`}
        >
          {squares.map((q, i) => (
            <span
              key={i}
              className={`${s.sq} absolute border ${q.strong ? "border-line-strong" : "border-line"} ${i % 2 ? "max-sm:hidden" : ""}`}
              style={{ left: `${q.x}%`, top: `${q.y}%`, width: q.size, height: q.size, "--r": `${q.r}deg`, "--d": `${q.d}s`, "--dl": `${q.dl}s` } as CSSProperties}
            />
          ))}
        </div>
        <div className="relative mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-4">
          <HeroMock lang={lang} />
        </div>
      </div>
    </section>
  );
}
