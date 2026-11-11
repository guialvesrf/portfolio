import type { Bilingual, Locale } from "@/lib/i18n";
import { Badge } from "@/components/ui/Badge";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CommissionDiagram, IsaDiagram } from "./projects/diagrams";

type Project = {
  index: string;
  name: string;
  period: string;
  role: string;
  summary: string;
  highlights: string[];
  metrics: { value: number; suffix?: string; label: string }[];
  stack: string[];
  diagram: string;
};

const content: Bilingual<{ eyebrow: string; title: string[]; description: string; status: string; projects: [Project, Project] }> = {
  pt: {
    eyebrow: "Projetos",
    title: ["Do chão de fábrica", "ao financeiro"],
    description:
      "Os dois sistemas que construo na Comber: um roda ao lado do equipamento, na planta do cliente; o outro fecha as comissões do comercial. São produtos confidenciais, então aqui entram só arquitetura e engenharia.",
    status: "em produção",
    projects: [
      {
        index: "01",
        name: "ISA",
        period: "2026 — atual",
        role: "Back-end · Comber",
        summary:
          "Supervisão e controle adaptativo para equipamento industrial. Lê o CLP via Modbus, ajusta o PID episódio a episódio e entrega um supervisório web na rede da planta, tudo em contêineres que rodam de um Raspberry Pi 5 a um PC industrial.",
        highlights: [
          "Um único dono da conexão Modbus: o CLP aceita um cliente por vez, então o core-isa faz uma varredura por segundo e todos os serviços consomem a mesma leitura. Agrupar faixas contíguas reduziu 64 leituras a 27 requisições por ciclo.",
          "Cada valor carrega sua qualidade (good, bad, stale, unmapped). Falha de leitura devolve o último valor bom marcado como ruim, nunca um 0.0 que se passe por medição.",
          "Back-end do supervisório em Go/Gin com SQLite sem CGO: binário estático em imagem distroless e cross-compile direto para arm64. Sessão por JWT de 15 min com refresh rotativo em cookie HttpOnly.",
          "Entrega em frota: cada tag roda os testes e só então publica imagens amd64 + arm64 no GHCR. Provisionamento por script, canais beta e stable, rollback e bundle offline para plantas sem internet.",
        ],
        metrics: [
          { value: 4, label: "serviços em contêiner" },
          { value: 2, label: "arquiteturas: amd64 e arm64" },
          { value: 830, suffix: "+", label: "testes automatizados" },
          { value: 1, label: "porta exposta na planta" },
        ],
        stack: ["Go", "Gin", "SQLite", "Python", "FastAPI", "Modbus TCP", "React", "Docker", "GitHub Actions"],
        diagram:
          "Arquitetura da ISA: o CLP do equipamento conversa por Modbus TCP só com o core-isa, que repassa as leituras por HTTP ao pid-service e por WebSocket ao web-backend em Go. O web-backend grava em SQLite e é publicado pelo nginx do web-frontend, a única porta aberta para o navegador do operador. Tudo roda em Docker Compose num Raspberry Pi 5 ou num PC industrial.",
      },
      {
        index: "02",
        name: "Comissões",
        period: "2026 — atual",
        role: "Back-end · Comber",
        summary:
          "Sistema interno que lança vendas e recebimentos e calcula as comissões do comercial, com cadastros, dashboard e relatórios em PDF e Excel. Uma API em TypeScript sobre PostgreSQL que também serve o front-end.",
        highlights: [
          "PRD com 51 requisitos escrito antes da primeira linha de código. Features novas seguem spec com critérios rastreáveis e verificação independente, inclusive com testes de mutação.",
          "API Express 5 em camadas (rota, controller, service, repository), entrada validada com Zod e identidade sempre extraída do token, nunca do corpo da requisição.",
          "A API serve o build do React na mesma origem: uma porta, nenhum IP fixo em arquivo e o mesmo build no PC e no servidor. Cookie HttpOnly, CSP com Helmet e rate limit no login.",
          "524 testes com Vitest e Supertest. As 43 suítes de rota rodam num Postgres de teste isolado, e a config se recusa a rodar sem ele, porque os testes limpam as tabelas. O CI repete tudo a cada PR, com lint, typecheck e migrations.",
        ],
        metrics: [
          { value: 51, label: "requisitos no PRD" },
          { value: 524, label: "testes automatizados" },
          { value: 43, label: "suítes de integração" },
          { value: 1, label: "porta para API e front" },
        ],
        stack: ["TypeScript", "Node 24", "Express", "Prisma", "PostgreSQL", "Zod", "React", "Vite", "Vitest", "Docker"],
        diagram:
          "Arquitetura do Comissões: o navegador chama /api na mesma origem; a API Express serve o build do React e acessa o PostgreSQL pelo Prisma, tudo em um contêiner e uma porta. No CI, o GitHub Actions roda lint, typecheck, migrations e testes contra um Postgres de teste isolado.",
      },
    ],
  },
  en: {
    eyebrow: "Projects",
    title: ["From the plant floor", "to finance"],
    description:
      "The two systems I build at Comber: one runs next to the equipment at the customer's plant, the other settles sales commissions. Both are confidential, so this is architecture and engineering only.",
    status: "in production",
    projects: [
      {
        index: "01",
        name: "ISA",
        period: "2026 — present",
        role: "Back-end · Comber",
        summary:
          "Supervision and adaptive control for industrial equipment. It reads the PLC over Modbus, tunes the PID episode by episode and serves a web HMI on the plant network, all in containers that run on anything from a Raspberry Pi 5 to an industrial PC.",
        highlights: [
          "One owner for the Modbus connection: the PLC accepts a single client at a time, so core-isa scans once per second and every service reads the same snapshot. Merging contiguous ranges cut 64 reads down to 27 requests per cycle.",
          "Every value carries its quality (good, bad, stale, unmapped). A failed read returns the last good value flagged as bad, never a 0.0 that passes for a measurement.",
          "Supervisory back-end in Go/Gin with CGO-free SQLite: a static binary on a distroless image and a straight cross-compile to arm64. Sessions use 15-minute JWTs with rotating refresh tokens in HttpOnly cookies.",
          "Shipped as a fleet: each version tag runs the tests and only then publishes amd64 + arm64 images to GHCR. Scripted provisioning, beta and stable channels, rollback and an offline bundle for plants without internet.",
        ],
        metrics: [
          { value: 4, label: "containerized services" },
          { value: 2, label: "architectures: amd64 and arm64" },
          { value: 830, suffix: "+", label: "automated tests" },
          { value: 1, label: "port exposed to the plant" },
        ],
        stack: ["Go", "Gin", "SQLite", "Python", "FastAPI", "Modbus TCP", "React", "Docker", "GitHub Actions"],
        diagram:
          "ISA architecture: the equipment's PLC talks Modbus TCP only to core-isa, which relays readings over HTTP to pid-service and over WebSocket to the Go web-backend. The web-backend stores data in SQLite and is published by the web-frontend's nginx, the only port open to the operator's browser. Everything runs on Docker Compose on a Raspberry Pi 5 or an industrial PC.",
      },
      {
        index: "02",
        name: "Commissions",
        period: "2026 — present",
        role: "Back-end · Comber",
        summary:
          "Internal system that records sales and receipts and calculates sales commissions, with registries, a dashboard and PDF and Excel reports. A TypeScript API on PostgreSQL that also serves the front-end.",
        highlights: [
          "A 51-requirement PRD written before the first line of code. New features follow a spec with traceable criteria and independent verification, mutation testing included.",
          "Layered Express 5 API (route, controller, service, repository), Zod-validated input, and identity always taken from the token, never from the request body.",
          "The API serves the React build from the same origin: one port, no hard-coded IP and the same build on a laptop or the server. HttpOnly cookies, a Helmet CSP and rate limiting on login.",
          "524 tests with Vitest and Supertest. The 43 route suites run against an isolated test Postgres, and the config refuses to start without it because the tests wipe tables. CI repeats it all on every PR, with lint, typecheck and migrations.",
        ],
        metrics: [
          { value: 51, label: "PRD requirements" },
          { value: 524, label: "automated tests" },
          { value: 43, label: "integration suites" },
          { value: 1, label: "port for API and front-end" },
        ],
        stack: ["TypeScript", "Node 24", "Express", "Prisma", "PostgreSQL", "Zod", "React", "Vite", "Vitest", "Docker"],
        diagram:
          "Commissions architecture: the browser calls /api on the same origin; the Express API serves the React build and reaches PostgreSQL through Prisma, all in one container on one port. In CI, GitHub Actions runs lint, typecheck, migrations and tests against an isolated test Postgres.",
      },
    ],
  },
};

const diagrams = [IsaDiagram, CommissionDiagram];

export function Projects({ lang }: { lang: Locale }) {
  const t = content[lang];
  return (
    <Section id="projetos">
      <SectionHeader eyebrow={t.eyebrow} title={t.title} description={t.description} />
      <div className="mt-12 flex flex-col gap-4 sm:mt-16 sm:gap-5">
        {t.projects.map((p, i) => {
          const Diagram = diagrams[i];
          return (
            <Reveal key={p.index}>
              <article className="grid border border-line bg-ink-900 transition-colors duration-300 hover:border-line-strong lg:grid-cols-[45fr_55fr]">
                <div className="flex min-w-0 flex-col gap-6 p-5 sm:p-7 lg:p-8">
                  <div className="flex items-center justify-between gap-3">
                    <span className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle">
                      {p.index} <span className="text-blue-400">■</span> {p.name}
                    </span>
                    <Badge>{t.status}</Badge>
                  </div>

                  <div className="flex flex-col gap-3">
                    <h3 className="font-pixel text-[40px] leading-none text-fg sm:text-5xl">{p.name}</h3>
                    <p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle">
                      <span className="whitespace-nowrap">{p.period}</span>
                      <span aria-hidden className="text-fg-faint">/</span>
                      <span className="whitespace-nowrap">{p.role}</span>
                    </p>
                  </div>

                  <p className="text-pretty text-[15px] leading-relaxed text-fg-muted sm:text-base">{p.summary}</p>

                  <ul className="flex flex-col gap-3">
                    {p.highlights.map((h) => (
                      <li key={h} className="flex gap-3 text-pretty text-sm leading-relaxed text-fg-muted">
                        <span aria-hidden className="mt-[0.55em] size-1.5 shrink-0 bg-blue-400" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <dl className="grid grid-cols-2 border-l border-t border-line sm:grid-cols-4 lg:grid-cols-2">
                    {p.metrics.map((m) => (
                      <div key={m.label} className="flex flex-col gap-2 border-b border-r border-line p-3">
                        <dt className="order-2 text-balance font-mono text-[11px] uppercase leading-snug tracking-[0.08em] text-fg-subtle">
                          {m.label}
                        </dt>
                        <dd className="order-1 font-pixel text-2xl leading-none text-blue-400">
                          <Counter to={m.value} suffix={m.suffix} locale={lang === "pt" ? "pt-BR" : "en-US"} />
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <ul className="mt-auto flex flex-wrap gap-1.5" aria-label="Stack">
                    {p.stack.map((c) => (
                      <li key={c} className="whitespace-nowrap border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative flex min-w-0 items-center border-t border-line bg-ink-925 p-4 sm:p-6 lg:border-l lg:border-t-0 lg:p-5">
                  <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 opacity-50" />
                  <Diagram lang={lang} />
                  <p className="sr-only">{p.diagram}</p>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
