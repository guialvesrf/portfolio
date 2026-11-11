"use client";

import type { Bilingual, Locale } from "@/lib/i18n";
import { Badge } from "@/components/ui/Badge";
import { CropMarks } from "@/components/ui/CropMarks";
import { Flash, Line, Packet, Pixels } from "./fanout/parts";
import { useLoop } from "./useLoop";

const content: Bilingual<{
  scan: string;
  frames: string;
  clients: string;
  plcConn: string;
  clp: [label: string, name: string, sub: string];
  hub: [label: string, name: string, sub: string];
  web: [label: string, name: string, sub: string];
  pid: [label: string, name: string, sub: string];
  slot: string;
  register: string;
  sample: string;
  summary: string;
}> = {
  pt: {
    scan: "snapshot do core",
    frames: "frames",
    clients: "clientes",
    plcConn: "conexões no CLP",
    clp: ["Equipamento", "CLP", "Modbus TCP · aceita 1 conexão por vez"],
    hub: ["Dono do Modbus", "core-isa", "1 socket · 1 varredura · WS /stream"],
    web: ["Supervisório", "web-service", "Go · Gin · SQLite"],
    pid: ["Ajuste adaptativo", "pid-service", "Python · NumPy · scikit-learn"],
    slot: "slot",
    register: "registro",
    sample: "episódio",
    summary:
      "Diagrama animado: o CLP aceita uma única conexão Modbus TCP. O core-isa é o único dono dessa conexão, lê o CLP uma vez por segundo e publica a mesma leitura por WebSocket para dois consumidores: o web-service, supervisório em Go com Gin e SQLite, e o pid-service, que faz o ajuste adaptativo em Python. Mais navegadores abertos não geram tráfego extra no CLP.",
  },
  en: {
    scan: "core snapshot",
    frames: "frames",
    clients: "clients",
    plcConn: "PLC connections",
    clp: ["Equipment", "PLC", "Modbus TCP · one connection at a time"],
    hub: ["Modbus owner", "core-isa", "1 socket · 1 scan · WS /stream"],
    web: ["Supervisory UI", "web-service", "Go · Gin · SQLite"],
    pid: ["Adaptive tuning", "pid-service", "Python · NumPy · scikit-learn"],
    slot: "slot",
    register: "register",
    sample: "episode",
    summary:
      "Animated diagram: the PLC accepts a single Modbus TCP connection. core-isa is the only owner of that connection, reads the PLC once per second and streams the same reading over WebSocket to two consumers: web-service, the supervisory UI in Go with Gin and SQLite, and pid-service, which does adaptive tuning in Python. More open browsers add no extra traffic on the PLC.",
  },
};

// 4 sub-passos de 250 ms = 1 frame por segundo, como a varredura do core.
const SUB = [250, 250, 250, 250] as const;
// Centro do consumidor: (100% − gap) / 4, com gap 1rem (empilhado) ou .75rem (lado a lado).
// Linha do tempo do pacote dentro do frame (s): CLP → hub → bifurca → consumidores.
const T = { hub: 0.25, split: 0.35, branch: 0.45, arrive: 0.75 } as const;

// Valores ilustrativos e determinísticos (nada de dado real de planta).
const temp = (n: number) => 182 + 1.6 * Math.sin(n * 0.55) + 0.6 * Math.sin(n * 1.9);
const hz = (n: number) => Math.round(46 + 2.5 * Math.sin(n * 0.35));
const sample = (n: number) => ((213 + n) % 300) + 1;

const ICON = {
  plc: ["11111111", "10000001", "10110101", "10000001", "11111111", "01000010", "01000010", "11111111"],
  hub: ["00011000", "00100100", "01011010", "10111101", "10111101", "01011010", "00100100", "00011000"],
  web: ["11111111", "10000001", "10110001", "10011001", "10000001", "11111111", "00011000", "00111100"],
  pid: ["00100100", "01111110", "11000011", "01011010", "01011010", "11000011", "01111110", "00100100"],
};

const LABEL = "font-mono text-[10px] uppercase leading-none tracking-[0.12em] text-fg-subtle";

export function FanOut({ lang }: { lang: Locale }) {
  const t = content[lang];
  const { ref, tick, still } = useLoop<HTMLDivElement>(SUB, 7);
  const frame = Math.floor(tick / 4);
  const shown = Math.max(tick % 4 === 3 ? frame : frame - 1, 0); // o valor só muda quando o pacote chega
  const run = !still;

  const fmt = (v: number, d = 1) => v.toLocaleString(lang === "pt" ? "pt-BR" : "en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  const spark = Array.from({ length: 24 }, (_, i) => temp(shown - 23 + i));
  const lo = Math.min(...spark);
  const hi = Math.max(...spark);
  const points = spark.map((v, i) => `${(i / 23) * 100},${22 - ((v - lo) / (hi - lo || 1)) * 20}`).join(" ");

  const clp = (
    <Node icon={ICON.plc} meta={t.clp}>
      <Row k={t.register} v={`HR 40001 = ${Math.round(temp(shown) * 10)}`} />
      <Row k={t.slot} v="1 / 1" />
    </Node>
  );
  const hub = (
    <Node icon={ICON.hub} meta={t.hub} accent flash={run && <Flash key={frame} at={T.hub} dur={0.45} />}>
      <Row k={t.frames} v={String(shown + 1)} strong />
      <Row k={t.clients} v="2" />
    </Node>
  );
  const web = (
    <Node icon={ICON.web} meta={t.web} flash={run && <Flash key={frame} at={T.arrive} dur={0.4} />}>
      <div className="flex items-end justify-between gap-2">
        <p className="font-pixel text-xl leading-none text-fg tabular-nums sm:text-2xl">
          {fmt(temp(shown))}
          <span className="ml-1 font-mono text-[11px] text-fg-subtle">°C</span>
        </p>
        <p className="font-mono text-[11px] text-blue-300 tabular-nums">{hz(shown)} Hz</p>
      </div>
      <svg viewBox="0 0 100 24" preserveAspectRatio="none" className="h-6 w-full" aria-hidden>
        <polyline points={points} fill="none" stroke="var(--color-blue-400)" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
      </svg>
    </Node>
  );
  const pid = (
    <Node icon={ICON.pid} meta={t.pid} flash={run && <Flash key={frame} at={T.arrive} dur={0.4} />}>
      <Row k={t.sample} v={`${sample(shown)}/300`} />
      <div className="flex h-2.5 gap-px" aria-hidden>
        {Array.from({ length: 20 }, (_, i) => (
          <span key={i} className={`flex-1 transition-colors duration-300 ${i < Math.ceil((sample(shown) / 300) * 20) ? "bg-blue-400" : "bg-ink-800"}`} />
        ))}
      </div>
    </Node>
  );

  // Pacote de um trecho, remontado a cada frame pela `key`.
  const p = (at: number, dur: number, rev = false) => run && <Packet key={frame} at={at} dur={dur} rev={rev} />;

  return (
    <div ref={ref} className="flex h-full flex-col gap-5">
      <p className="sr-only">{t.summary}</p>

      <div aria-hidden className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex items-center gap-2.5">
          <Badge tone="blue">1 Hz</Badge>
          <span className={LABEL}>{t.scan}</span>
        </div>
        <p className="font-mono text-[11px] text-fg-subtle">
          {t.clients} <span className="text-fg">2</span> · {t.plcConn} <span className="text-fg">1</span>
        </p>
      </div>

      {/* md+: horizontal, CLP → core → bifurca em dois */}
      <div
        aria-hidden
        className="relative hidden flex-1 items-stretch md:grid md:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1.15fr)_4rem_minmax(0,1.3fr)] lg:grid-cols-[minmax(0,1fr)_5rem_minmax(0,1.1fr)_6rem_minmax(0,1.3fr)]"
      >
        <div className="self-center">{clp}</div>
        <div className="relative">
          <Line cls="inset-x-0 top-1/2 h-0 border-t" lit={still}>{p(0, T.hub)}</Line>
        </div>
        <div className="self-center">{hub}</div>
        <div className="relative">
          <Line cls="left-0 right-1/2 top-1/2 h-0 border-t" lit={still}>{p(T.hub, T.split - T.hub)}</Line>
          <Line cls="left-1/2 w-0 border-l top-[calc((100%_-_1rem)/4)] bottom-1/2" lit={still}>{p(T.split, T.branch - T.split, true)}</Line>
          <Line cls="left-1/2 w-0 border-l top-1/2 bottom-[calc((100%_-_1rem)/4)]" lit={still}>{p(T.split, T.branch - T.split)}</Line>
          <Line cls="left-1/2 right-0 h-0 border-t top-[calc((100%_-_1rem)/4)]" lit={still}>{p(T.branch, T.arrive - T.branch)}</Line>
          <Line cls="left-1/2 right-0 h-0 border-t bottom-[calc((100%_-_1rem)/4)]" lit={still}>{p(T.branch, T.arrive - T.branch)}</Line>
          <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 bg-blue-400" />
        </div>
        <div className="grid grid-rows-2 gap-4">
          {web}
          {pid}
        </div>
      </div>

      {/* < md: vertical, CLP em cima e consumidores lado a lado embaixo */}
      <div aria-hidden className="flex flex-col md:hidden">
        {clp}
        <div className="relative h-8">
          <Line cls="inset-y-0 left-1/2 w-0 border-l" lit={still}>{p(0, T.hub)}</Line>
        </div>
        {hub}
        <div className="relative h-10">
          <Line cls="top-0 bottom-1/2 left-1/2 w-0 border-l" lit={still}>{p(T.hub, T.split - T.hub)}</Line>
          <Line cls="top-1/2 h-0 border-t left-[calc((100%_-_0.75rem)/4)] right-1/2" lit={still}>{p(T.split, T.branch - T.split, true)}</Line>
          <Line cls="top-1/2 h-0 border-t left-1/2 right-[calc((100%_-_0.75rem)/4)]" lit={still}>{p(T.split, T.branch - T.split)}</Line>
          <Line cls="top-1/2 bottom-0 w-0 border-l left-[calc((100%_-_0.75rem)/4)]" lit={still}>{p(T.branch, T.arrive - T.branch)}</Line>
          <Line cls="top-1/2 bottom-0 w-0 border-l right-[calc((100%_-_0.75rem)/4)]" lit={still}>{p(T.branch, T.arrive - T.branch)}</Line>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {web}
          {pid}
        </div>
      </div>
    </div>
  );
}

function Node({ icon, meta: [label, name, sub], accent, flash, children }: {
  icon: string[];
  meta: [string, string, string];
  accent?: boolean;
  flash?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative flex h-full flex-col gap-2.5 border bg-ink-850 p-3 sm:p-4 ${
        accent ? "border-blue-400/50 shadow-[0_0_36px_-14px_var(--color-blue-400)]" : "border-line"
      }`}
    >
      {accent && <CropMarks size={8} inset={4} />}
      {flash}
      <div className="flex items-center gap-2.5">
        <span className="hidden size-8 shrink-0 place-items-center bg-blue-950 text-blue-300 sm:grid">
          <Pixels map={icon} px={2} />
        </span>
        <div className="min-w-0">
          <p className={`${LABEL} leading-tight`}>{label}</p>
          <p className="mt-1 truncate font-pixel text-base leading-tight text-fg sm:text-lg">{name}</p>
        </div>
      </div>
      <p className="font-mono text-[11px] leading-snug text-fg-subtle">{sub}</p>
      <div className="mt-auto flex flex-col gap-1.5 border-t border-line pt-2.5">{children}</div>
    </div>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <p className="flex items-baseline justify-between gap-2 font-mono text-[11px] leading-none">
      <span className="truncate uppercase tracking-wider text-fg-subtle">{k}</span>
      <span className={`whitespace-nowrap tabular-nums ${strong ? "text-blue-300" : "text-fg-muted"}`}>{v}</span>
    </p>
  );
}
