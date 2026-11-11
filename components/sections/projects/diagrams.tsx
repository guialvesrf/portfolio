import type { CSSProperties, ReactNode } from "react";
import type { Bilingual, Locale } from "@/lib/i18n";
import { CropMarks } from "@/components/ui/CropMarks";
import { Live } from "./Live";
import s from "./diagrams.module.css";

function Node({ area, title, sub, core, children }: {
  area: string;
  title: string;
  sub?: string;
  core?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      style={{ gridArea: area }}
      className={`relative z-[1] flex min-w-0 flex-col justify-center gap-1 border px-2.5 py-2.5 sm:px-3 ${
        core ? "border-blue-400/50 bg-blue-950" : "border-line-strong bg-ink-850"
      }`}
    >
      {core && <CropMarks size={6} inset={3} />}
      <span className="font-mono text-xs leading-tight text-fg [overflow-wrap:anywhere]">{title}</span>
      {sub && <span className="font-mono text-[11px] leading-snug text-fg-subtle">{sub}</span>}
      {children}
    </div>
  );
}

/** `dir`: sentido no desktop (r → direita, l ← esquerda, d ↓). No mobile toda conexão desce. */
function Wire({ area, dir = "d", label, delay = 0, mobile = true }: {
  area: string;
  dir?: "r" | "l" | "d";
  label?: string;
  delay?: number;
  mobile?: boolean;
}) {
  return (
    <div
      className={s.wire}
      style={{ gridArea: area, "--delay": `${delay}s` } as CSSProperties}
      data-dir={dir}
      data-mobile={mobile ? undefined : "off"}
    >
      <span className={`${s.track} text-fg-faint`}>
        <span className={`${s.pulse} text-blue-400`} />
      </span>
      <span className={`${s.port} ${s.from} text-fg-faint`} />
      <span className={`${s.port} ${s.to} text-blue-400`} />
      {label && <span className={`${s.label} font-mono text-[11px] text-fg-subtle`}>{label}</span>}
    </div>
  );
}

/** Placa do host dentro da moldura. */
function Host({ items }: { items: string[] }) {
  return (
    <div
      style={{ gridArea: "host" }}
      className="relative z-[1] flex flex-wrap content-center gap-x-3 gap-y-1 px-1 py-2 font-mono text-[11px] uppercase leading-tight tracking-[0.08em] text-fg-subtle"
    >
      {items.map((it, i) => (
        <span key={it} className={`flex items-center gap-1.5 ${i === 0 ? "text-blue-300" : ""}`}>
          <span className="size-[5px] shrink-0 bg-current" />
          {it}
        </span>
      ))}
    </div>
  );
}

const isa: Bilingual<{ clp: string; core: string; pid: string; vol: string; nav: string; navSub: string; host: string[] }> = {
  pt: {
    clp: "equipamento industrial",
    core: "dono único do Modbus",
    pid: "sintonia do PID",
    vol: "histórico e app.db",
    nav: "navegador",
    navSub: "operador na LAN",
    host: ["Docker Compose", "Raspberry Pi 5", "PC industrial"],
  },
  en: {
    clp: "industrial equipment",
    core: "sole Modbus owner",
    pid: "PID tuning",
    vol: "history & app.db",
    nav: "browser",
    navSub: "operator on the LAN",
    host: ["Docker Compose", "Raspberry Pi 5", "Industrial PC"],
  },
};

export function IsaDiagram({ lang }: { lang: Locale }) {
  const t = isa[lang];
  return (
    <Live className={`${s.grid} ${s.isa}`}>
      <div className={`${s.frame} border border-line-strong bg-ink-950/60`} />
      <Node area="clp" title="CLP" sub={t.clp} />
      <Node area="core" title="core-isa" sub={t.core} core />
      <Node area="pid" title="pid-service" sub={t.pid} />
      <Node area="web" title="web-backend" sub="Go · Gin · JWT" />
      <Node area="vol" title="volumes" sub={t.vol} />
      <Node area="nginx" title="web-frontend" sub="nginx · React" />
      <Node area="nav" title={t.nav} sub={t.navSub} />
      <Host items={t.host} />
      <Wire area="w1" dir="r" label="Modbus" />
      <Wire area="w2" dir="r" label="HTTP" delay={1} />
      <Wire area="w3" label="WS" delay={1} />
      <Wire area="w4" label="CSV" delay={2} />
      <Wire area="w5" dir="r" label="SQLite" delay={2} mobile={false} />
      <Wire area="w6" label="proxy" delay={2} />
      <Wire area="w7" dir="l" label=":80" delay={3} />
    </Live>
  );
}

const com: Bilingual<{ nav: string; navSub: string; web: string; pg: string; host: string[]; lane: string; ci: string; test: string; testSub: string }> = {
  pt: {
    nav: "navegador",
    navSub: "mesma origem",
    web: "build servido pela API",
    pg: "produção",
    host: ["Docker", "Node 24", "1 porta"],
    lane: "CI · testes · Postgres isolado",
    ci: "a cada PR e push na main",
    test: "Postgres de teste",
    testSub: "isolado do banco de dev",
  },
  en: {
    nav: "browser",
    navSub: "same origin",
    web: "build served by the API",
    pg: "production",
    host: ["Docker", "Node 24", "1 port"],
    lane: "CI · tests · isolated Postgres",
    ci: "on every PR and push to main",
    test: "test Postgres",
    testSub: "isolated from dev data",
  },
};

export function CommissionDiagram({ lang }: { lang: Locale }) {
  const t = com[lang];
  return (
    <Live className={`${s.grid} ${s.com}`}>
      <div className={`${s.frame} border border-line-strong bg-ink-950/60`} />
      <Host items={t.host} />
      <Node area="nav" title={t.nav} sub={t.navSub} />
      <Node area="api" title="API Express" sub="TypeScript · Zod" core />
      <Node area="prisma" title="Prisma" sub="ORM · migrations" />
      <Node area="web" title="client React" sub={t.web} />
      <Node area="pg" title="PostgreSQL" sub={t.pg} />
      <div
        style={{ gridArea: "lane" }}
        className="flex min-w-0 items-end gap-3 pb-2 font-mono text-[11px] uppercase leading-tight tracking-[0.08em] text-fg-subtle"
      >
        <span className="flex items-center gap-1.5">
          <span className="size-[5px] shrink-0 bg-blue-400" />
          {t.lane}
        </span>
        <span className="mb-1.5 h-px min-w-4 flex-1 bg-line-strong" />
      </div>
      <Node area="ci" title="GitHub Actions" sub={t.ci}>
        <span className="mt-1 flex flex-wrap gap-1">
          {["lint", "typecheck", "migrate", "test"].map((step) => (
            <span key={step} className="border border-line-strong px-1.5 py-0.5 font-mono text-[11px] leading-tight text-fg-muted">
              <span className="text-green-500">✓</span> {step}
            </span>
          ))}
        </span>
      </Node>
      <Node area="test" title={t.test} sub={t.testSub} />
      <Wire area="w1" dir="r" label="/api" />
      <Wire area="w2" dir="r" delay={1} />
      <Wire area="w3" label="static" delay={1} />
      <Wire area="w4" label="SQL" delay={2} />
      <Wire area="w5" dir="r" delay={0.5} />
    </Live>
  );
}
