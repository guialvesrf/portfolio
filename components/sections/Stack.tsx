import type { Bilingual, Locale } from "@/lib/i18n";
import { CropMarks } from "@/components/ui/CropMarks";
import { PixelNotch } from "@/components/ui/PixelNotch";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PixelIcon, type IconName } from "./stack/PixelIcon";
import { Terminal } from "./stack/Terminal";

type Lang = { icon: IconName; name: string; meta: string; body: string; chips: string[] };

const content: Bilingual<{ eyebrow: string; title: string[]; description: string; iconLabel: string; toolsLabel: string; langs: Lang[] }> = {
  pt: {
    eyebrow: "Stack",
    title: ["As linguagens", "que eu uso todo dia"],
    description: "Três linguagens, cada uma onde rende mais: Go nos serviços, TypeScript nas aplicações web e Python nos dados e na comunicação com o CLP.",
    iconLabel: "Ícone pixel de",
    toolsLabel: "Também no dia a dia",
    langs: [
      {
        icon: "go",
        name: "Go",
        meta: "go 1.27 · produção",
        body: "Concorrência simples com goroutines e um binário único, sem runtime para instalar: ótimo para serviços de rede. Uso no supervisório web em Gin + SQLite (REST + WebSocket, JWT com refresh rotacionado e rate limit) e no Guardian, um gerenciador de senhas zero-knowledge com TUI.",
        chips: ["Gin", "SQLite", "WebSocket", "JWT", "x/crypto", "x/term"],
      },
      {
        icon: "ts",
        name: "TypeScript / Bun",
        meta: "ts 6 · api + web",
        body: "A tipagem pega o erro antes de chegar em produção, e o Bun completa o par como runtime rápido, com bundler e test runner embutidos. Na aplicação de comissões, a API usa Express, Prisma e PostgreSQL, com testes automatizados e CI no GitHub Actions.",
        chips: ["Express", "Prisma", "PostgreSQL", "React", "Vite", "Vitest"],
      },
      {
        icon: "py",
        name: "Python",
        meta: "python 3.14 · dados + CLP",
        body: "Ecossistema científico maduro: álgebra, estatística e machine learning sem reinventar nada. Uso no serviço de ajuste adaptativo (NumPy e random forest do scikit-learn), organizado em portas e adaptadores, e no core que conversa com o CLP via Modbus TCP.",
        chips: ["NumPy", "scikit-learn", "httpx", "pymodbus"],
      },
    ],
  },
  en: {
    eyebrow: "Stack",
    title: ["The languages", "I use every day"],
    description: "Three languages, each where it pays off most: Go for services, TypeScript for web apps and Python for data and talking to the PLC.",
    iconLabel: "Pixel icon for",
    toolsLabel: "Also in the toolbox",
    langs: [
      {
        icon: "go",
        name: "Go",
        meta: "go 1.27 · production",
        body: "Simple concurrency with goroutines and a single binary with no runtime to install, which makes it great for network services. I use it for a web supervisory system on Gin + SQLite (REST + WebSocket, JWT with rotating refresh tokens, rate limiting) and for Guardian, a zero-knowledge password manager with a TUI.",
        chips: ["Gin", "SQLite", "WebSocket", "JWT", "x/crypto", "x/term"],
      },
      {
        icon: "ts",
        name: "TypeScript / Bun",
        meta: "ts 6 · api + web",
        body: "Types catch the bug before it reaches production, and Bun rounds it out as a fast runtime with its own bundler and test runner. In the commissions app, the API runs on Express, Prisma and PostgreSQL, with automated tests and CI on GitHub Actions.",
        chips: ["Express", "Prisma", "PostgreSQL", "React", "Vite", "Vitest"],
      },
      {
        icon: "py",
        name: "Python",
        meta: "python 3.14 · data + PLC",
        body: "A mature scientific ecosystem: linear algebra, statistics and machine learning without reinventing anything. I use it for the adaptive tuning service (NumPy and a scikit-learn random forest), built with ports and adapters, and for the core that talks to the PLC over Modbus TCP.",
        chips: ["NumPy", "scikit-learn", "httpx", "pymodbus"],
      },
    ],
  },
};

const terminals: Record<IconName, { cmd: string; out: string[]; env?: string }> = {
  go: {
    cmd: "go mod init github.com/guialvesrf/app",
    out: ["go: creating new go.mod: module github.com/guialvesrf/app"],
  },
  ts: {
    cmd: "bun init -y",
    out: ["+ .gitignore", "+ index.ts", "+ tsconfig.json (for editor autocomplete)", "+ README.md", "To get started, run:", "  bun run index.ts"],
  },
  py: {
    cmd: "python3 -m venv .venv && source .venv/bin/activate",
    out: [],
    env: "(.venv)",
  },
};

const tools = ["Docker", "GitHub Actions", "PostgreSQL", "SQLite", "nginx", "Raspberry Pi", "Linux"];

export function Stack({ lang }: { lang: Locale }) {
  const t = content[lang];
  return (
    <Section id="stack">
      <SectionHeader eyebrow={t.eyebrow} title={t.title} description={t.description} />

      <div className="mt-12 flex flex-wrap justify-center gap-4 sm:mt-16 sm:gap-5">
        {t.langs.map((l, i) => (
          <Reveal key={l.icon} delay={i * 0.1} className="w-full md:w-[calc(50%-10px)] lg:w-[calc((100%-40px)/3)]">
            <article className="group relative flex h-full flex-col border border-line bg-ink-900 transition-colors duration-300 hover:border-line-strong hover:bg-ink-850">
              <span aria-hidden className="pointer-events-none absolute -inset-px">
                <PixelNotch corner="tr" size={10} />
              </span>

              <div className="flex flex-1 flex-col gap-5 p-5 sm:p-7">
                <div className="relative grid size-[72px] place-items-center">
                  <CropMarks size={10} />
                  <PixelIcon
                    name={l.icon}
                    label={`${t.iconLabel} ${l.name}`}
                    className="size-12 transition-transform duration-200 ease-[steps(2)] group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-balance font-pixel text-2xl leading-tight text-fg sm:text-[28px] lg:text-2xl xl:text-[28px]">{l.name}</h3>
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle">{l.meta}</p>
                </div>
                <p className="text-pretty text-sm leading-relaxed text-fg-muted sm:text-[15px]">{l.body}</p>
                <ul className="mt-auto flex flex-wrap gap-1.5">
                  {l.chips.map((c) => (
                    <li key={c} className="whitespace-nowrap border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              <Terminal {...terminals[l.icon]} delay={400 + i * 600} />
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2} className="mt-10 flex flex-col items-center gap-3 border-t border-line pt-6 sm:mt-12 md:flex-row md:justify-center md:gap-6">
        <span className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle">{t.toolsLabel}</span>
        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 font-mono text-xs text-fg-muted">
          {tools.map((tool) => (
            <li key={tool} className="whitespace-nowrap">
              <span aria-hidden className="mr-1.5 text-blue-400">■</span>
              {tool}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
