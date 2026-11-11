"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import type { Bilingual, Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CropMarks } from "@/components/ui/CropMarks";
import { Logo } from "@/components/ui/Logo";
import { Typewriter } from "@/components/ui/Typewriter";

const content: Bilingual<{
  prompt: string;
  exec: string;
  logs: string[];
  connected: string;
  badge: string;
  allLinks: string;
  profile: string;
  role: string;
  config: [string, string][];
}> = {
  pt: {
    prompt: "Construir um back-end em tempo real que lê o CLP, ajusta o controle sozinho e continua testável sem o equipamento ligado.",
    exec: "Execução",
    logs: [
      "leitura do CLP · 1 socket · 1 Hz",
      "broadcast → web-service, pid-service",
      "episódio fechado · regra 1 → P↓ D↑",
      "20/20 episódios · random forest ativo",
      "painel 4,75 MB → 1,26 MB (−74%)",
      "release arm64 + amd64 ✓",
    ],
    connected: "Conectado",
    badge: "conectado",
    allLinks: "Ver todos os links",
    profile: "Perfil",
    role: "Desenvolvedor Back-End",
    config: [
      ["Cargo", "Desenvolvedor"],
      ["Exp", "1 ano"],
      ["Base", "Rio Verde · GO"],
      ["Stack", "Go · TS/Bun · Python"],
      ["Modo", "Back-End"],
    ],
  },
  en: {
    prompt: "Build a real-time back-end that reads the PLC, tunes its own control loop and stays testable with the equipment switched off.",
    exec: "Execution",
    logs: [
      "PLC read · 1 socket · 1 Hz",
      "broadcast → web-service, pid-service",
      "episode closed · rule 1 → P↓ D↑",
      "20/20 episodes · random forest active",
      "dashboard 4.75 MB → 1.26 MB (−74%)",
      "release arm64 + amd64 ✓",
    ],
    connected: "Connected",
    badge: "connected",
    allLinks: "View all links",
    profile: "Profile config",
    role: "Back-End Developer",
    config: [
      ["Role", "Developer"],
      ["Exp", "1 year"],
      ["Base", "Rio Verde · GO"],
      ["Stack", "Go · TS/Bun · Python"],
      ["Mode", "Back-End"],
    ],
  },
};

const tags = [
  ["MODBUS", "text-green-500"],
  ["WS", "text-blue-400"],
  ["PID", "text-purple-400"],
  ["ML", "text-magenta-400"],
  ["GO", "text-yellow-300"],
  ["CI", "text-fg"],
] as const;

// Ícones pixel 7×7 (1 = pixel aceso).
const socials = [
  { name: "GitHub", href: site.social.github, map: ["1000001", "1100011", "1111111", "1011101", "1111111", "0111110", "0010100"] },
  { name: "LinkedIn", href: site.social.linkedin, map: ["1000000", "0000000", "1011110", "1011011", "1011011", "1011011", "1011011"] },
  { name: "Instagram", href: site.social.instagram, map: ["0111110", "1000011", "1011101", "1010101", "1011101", "1000001", "0111110"] },
];

const stack = [
  ["Go", "bg-blue-400 text-ink-950"],
  ["TS", "bg-blue-600 text-white"],
  ["Bun", "bg-fg text-ink-950"],
  ["Py", "bg-yellow-300 text-ink-950"],
] as const;

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];
const panel = "flex flex-col border border-line bg-ink-900 p-4 sm:p-5";
const chip = "flex h-8 items-center gap-1.5 bg-ink-850 px-2.5 font-mono text-[11px] text-fg-muted";
const chevron = (
  <svg viewBox="0 0 12 12" className="size-3 text-fg-subtle" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="m3 4.5 3 3 3-3" />
  </svg>
);

function Head({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 border-b border-dashed border-line-strong pb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle">
      {children}
    </p>
  );
}

function Pixels({ map }: { map: string[] }) {
  return (
    <svg viewBox="0 0 7 7" className="size-3.5" shapeRendering="crispEdges" aria-hidden>
      {map.flatMap((row, y) =>
        [...row].map((c, x) => c === "1" && <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="currentColor" />),
      )}
    </svg>
  );
}

/** Mock de produto em 3 colunas: prompt digita → logs entram um a um → painéis laterais. */
export function HeroMock({ lang }: { lang: Locale }) {
  const t = content[lang];
  const reduce = useReducedMotion();
  const [risen, setRisen] = useState(false);
  const [shown, setShown] = useState(0); // linhas de log liberadas; 0 = prompt ainda digitando
  const n = reduce ? tags.length : shown;
  const live = n > 0;

  const enter = (delay: number, y = 20) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y }, animate: live ? { opacity: 1, y: 0 } : undefined, transition: { duration: 0.7, delay, ease } };

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.75fr)_minmax(0,1fr)] lg:gap-4 lg:pt-10 lg:[mask-image:linear-gradient(to_bottom,#000_calc(100%_-_7rem),transparent)]">
      {/* Centro: prompt + execução */}
      <motion.div
        className="flex flex-col gap-3 sm:col-span-2 lg:col-span-1 lg:col-start-2 lg:row-start-1"
        initial={reduce ? false : { opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1, ease }}
        onAnimationComplete={() => setRisen(true)}
      >
        <div className="border border-fg-faint p-[3px] shadow-[0_0_60px_-18px_rgba(63,127,232,0.45)]">
          <div className="border border-fg-subtle/50 bg-ink-900 p-4 sm:p-5">
            <p className="text-[15px] leading-relaxed text-fg">
              {reduce || risen ? (
                <Typewriter text={t.prompt} speed={12} startDelay={150} cursor={!live} onDone={() => setShown((s) => Math.max(s, 1))} />
              ) : (
                <span className="invisible">{t.prompt}</span>
              )}
            </p>
            <div aria-hidden className="mt-6 flex items-center gap-2">
              <span className="grid size-8 place-items-center border border-line-strong text-fg-subtle">+</span>
              <span className={chip}>
                <span className="size-1.5 bg-blue-400" />
                Go
                {chevron}
              </span>
              <span className={`${chip} ml-auto`}>
                Auto
                {chevron}
              </span>
              <span className="grid size-8 place-items-center bg-blue-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.2)]">
                <svg viewBox="0 0 24 24" className="size-4">
                  <path d="M22 2 15 22l-4-9-9-4z" fill="currentColor" />
                  <path d="M22 2 11 13" stroke="var(--color-blue-600)" strokeWidth="1.5" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div className={`${panel} flex-1 lg:pb-28`}>
          <Head>{t.exec}</Head>
          <ul className="mt-2 space-y-2.5 font-mono text-[11px] leading-5 sm:text-xs lg:text-[11px] xl:text-xs">
            {tags.map(([tag, color], i) => (
              <li key={tag} className={`flex gap-2.5 sm:gap-3 ${i < n ? "" : "invisible"}`}>
                <span className="hidden shrink-0 tabular-nums text-fg-subtle sm:inline">10:24:{11 + i}</span>
                <span className={`w-[8ch] shrink-0 ${color}`}>[{tag}]</span>
                <span className="min-w-0 flex-1 text-fg-muted">
                  {i < n ? (
                    <Typewriter
                      text={t.logs[i]}
                      speed={10}
                      startDelay={i ? 140 : 250}
                      cursor={i === n - 1}
                      onDone={() => setShown((s) => Math.max(s, i + 2))}
                    />
                  ) : (
                    t.logs[i]
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Esquerda: redes */}
      <motion.div className={`${panel} lg:col-start-1 lg:row-start-1 lg:mt-16 lg:pb-28`} {...enter(0.3)}>
        <Head>{t.connected}</Head>
        <ul>
          {socials.map((so, i) => (
            <motion.li key={so.name} className="border-b border-dashed border-line last:border-0" {...enter(0.45 + i * 0.08, 8)}>
              <a
                href={so.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${so.name} @${site.handle}`}
                className="-mx-2 flex items-center gap-2.5 px-2 py-3 transition-colors duration-300 hover:bg-ink-850"
              >
                <span className="grid size-8 shrink-0 place-items-center bg-blue-600 text-white">
                  <Pixels map={so.map} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm text-fg">{so.name}</span>
                    <Badge>{t.badge}</Badge>
                  </span>
                  <span className="mt-0.5 block truncate text-[13px] text-fg-subtle">@{site.handle}</span>
                </span>
              </a>
            </motion.li>
          ))}
        </ul>
        <div className="mt-auto pt-4">
          <Button href="#contato" variant="outline" size="sm" className="h-10 w-full">
            {t.allLinks}
          </Button>
        </div>
      </motion.div>

      {/* Direita: perfil */}
      <motion.div className={`${panel} lg:col-start-3 lg:row-start-1 lg:mt-16 lg:pb-28`} {...enter(0.45)}>
        <Head>{t.profile}</Head>
        <div className="flex items-center gap-3 border-b border-dashed border-line py-3">
          <span className="relative grid size-14 shrink-0 place-items-center">
            <CropMarks size={10} />
            <Logo size={22} />
          </span>
          <span className="min-w-0">
            <span className="block text-[15px] text-fg">{site.name}</span>
            <span className="mt-0.5 block text-pretty text-[13px] leading-snug text-fg-subtle">{t.role}</span>
          </span>
        </div>
        <dl className="space-y-2.5 py-4 font-mono text-xs">
          {t.config.map(([k, v], i) => (
            <motion.div key={k} className="flex justify-between gap-4" {...enter(0.6 + i * 0.06, 6)}>
              <dt className="shrink-0 text-fg-subtle">{k}</dt>
              <dd className="min-w-0 truncate text-right text-fg">{v}</dd>
            </motion.div>
          ))}
        </dl>
        <div className="mt-auto border-t border-dashed border-line pt-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-fg-subtle">Stack</p>
          <div className="mt-3 flex gap-1.5">
            {stack.map(([name, color]) => (
              <span key={name} className={`grid size-8 place-items-center font-pixel text-[11px] leading-none ${color}`}>
                {name}
              </span>
            ))}
            <span aria-hidden className="grid size-8 place-items-center border border-line-strong text-fg-subtle">+</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
