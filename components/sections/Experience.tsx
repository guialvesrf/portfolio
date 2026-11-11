import type { Bilingual, Locale } from "@/lib/i18n";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

type Job = {
  role: string;
  company: string;
  type: string;
  period: string;
  duration: string;
  place?: string;
  mode: string;
  current?: boolean;
  summary: string;
  /** Trechos entre `**` viram destaque mono (números/métricas). */
  bullets: string[];
  chips: string[];
};

const comberChips = ["Go", "Gin", "SQLite", "React", "nginx", "Python", "Modbus TCP", "WebSocket", "scikit-learn", "Docker", "GitHub Actions", "TypeScript", "Express", "Prisma", "PostgreSQL"];

const content: Bilingual<{
  eyebrow: string;
  title: string[];
  description: string;
  status: { current: string; ended: string };
  chipsLabel: string;
  jobs: Job[];
}> = {
  pt: {
    eyebrow: "Experiência",
    title: ["Onde eu coloco", "código em produção"],
    description: "Back-end que roda dentro da planta do cliente e, antes disso, um ano mentorando uma comunidade de programação.",
    status: { current: "atual", ended: "encerrado" },
    chipsLabel: "Stack e competências",
    jobs: [
      {
        role: "Desenvolvedor Back-End (Inovação/P&D)",
        company: "Comber Indústria LTDA",
        type: "Tempo integral",
        period: "jun. de 2026 – o momento",
        duration: "6 meses",
        place: "Rio Verde, Goiás, Brasil",
        mode: "Presencial",
        current: true,
        summary:
          "Back-end de dois produtos: uma plataforma em tempo real que roda embarcada em Raspberry Pi 5 e PCs industriais dentro da planta do cliente, e a aplicação web do administrativo para a comissão dos representantes. Os produtos são confidenciais. Aqui fica o lado de engenharia.",
        bullets: [
          "Fan-out em tempo real: um serviço lê o CLP via Modbus TCP e publica os dados por WebSocket para dois consumidores, o serviço de ajuste adaptativo e o supervisório web.",
          "Supervisório em Go (Gin) e SQLite, com front em React atrás do nginx. Operador e supervisor acompanham a operação ao vivo e exportam XLSX e CSV. Auth com JWT, refresh token rotacionado, três níveis de permissão e rate limit no login.",
          "Patch de performance do supervisório (**v1.16**): o painel principal caiu de **4,75 MB** para **1,26 MB** no primeiro acesso (**−74%**). A paginação de eventos foi de **96 ms** para **0,04 ms** com um índice, em teste com **300 mil registros**. **40 chamadas** à API passaram a usar **10 conexões TCP**, e trocar de tela não reconecta mais nenhum WebSocket.",
          "Serviço de ajuste adaptativo de parâmetros de controle: começa com um algoritmo determinístico e, depois de juntar dados suficientes, passa a usar random forest. Fica em portas e adaptadores, então eu testo tudo sem o equipamento ligado.",
          "Release no GitHub Actions com imagens Docker para **arm64** e **amd64**. Quando uma versão passou nos testes e não subiu na Pi 5 por causa das páginas de memória de **16 KB**, achei a causa por SSH e publiquei a correção no mesmo dia.",
          "Aplicação de comissões em TypeScript, Express, Prisma e PostgreSQL. PRD de **51 requisitos** antes de codar, **524 testes automatizados**, integração num Postgres isolado e CI.",
        ],
        chips: comberChips,
      },
      {
        role: "Mentor de Programação & Gerente de Comunidade",
        company: "BeroLab",
        type: "Meio período",
        period: "jul. de 2025 – jun. de 2026",
        duration: "1 ano",
        mode: "Remoto",
        summary: "Mentoria técnica e de carreira numa comunidade de programação.",
        bullets: [
          "Ofereci suporte contínuo em hard skills (tecnologia) e soft skills (comunicação e carreira), auxiliando no desenvolvimento dos membros da comunidade.",
          "Criei e conduzi mentorias de carreira e de apresentação profissional para membros da comunidade.",
          "Conduzi a iniciativa “Em busca do SaaS Automático”: encontros semanais que guiaram a comunidade na concepção e implementação de produtos SaaS com modelo de receita recorrente.",
          "Auxiliei na resolução de dúvidas técnicas e problemas práticos, promovendo autonomia e aprendizado constante.",
          "Participei de workshops e eventos, fortalecendo o engajamento e a troca de conhecimento entre membros.",
        ],
        chips: ["Mentoria", "Carreira", "SaaS", "Comunicação", "Comunidade"],
      },
    ],
  },
  en: {
    eyebrow: "Experience",
    title: ["Where I ship", "code to production"],
    description: "Back end that runs inside the client’s plant and, before that, a year mentoring a programming community.",
    status: { current: "current", ended: "ended" },
    chipsLabel: "Stack and skills",
    jobs: [
      {
        role: "Back-End Developer (Innovation/R&D)",
        company: "Comber Indústria LTDA",
        type: "Full-time",
        period: "Jun 2026 – Present",
        duration: "6 mos",
        place: "Rio Verde, Goiás, Brazil",
        mode: "On-site",
        current: true,
        summary:
          "Back end for two products: a real-time platform that runs embedded on Raspberry Pi 5 boards and industrial PCs inside the client’s plant, and the back-office web app that handles sales rep commissions. The products are confidential, so this is the engineering side.",
        bullets: [
          "Real-time fan-out: one service reads the PLC over Modbus TCP and publishes the data over WebSocket to two consumers, the adaptive tuning service and the web supervisory dashboard.",
          "Supervisory dashboard in Go (Gin) and SQLite, with a React front end behind nginx. Operators and supervisors follow the operation live and export XLSX and CSV. Auth with JWT, rotating refresh tokens, three permission levels and login rate limiting.",
          "Dashboard performance patch (**v1.16**): the main panel dropped from **4.75 MB** to **1.26 MB** on first load (**−74%**). Event pagination went from **96 ms** to **0.04 ms** with a single index, tested against **300k records**. **40 API calls** now share **10 TCP connections**, and switching screens no longer reconnects any WebSocket.",
          "Adaptive control-parameter tuning service: it starts with a deterministic algorithm and, once it has gathered enough data, switches to a random forest. Built on ports and adapters, so I test everything without the equipment powered on.",
          "Releases on GitHub Actions with Docker images for **arm64** and **amd64**. When a version passed the tests but wouldn’t start on the Pi 5 because of its **16 KB** memory pages, I tracked down the cause over SSH and shipped the fix the same day.",
          "Commissions app in TypeScript, Express, Prisma and PostgreSQL. A **51-requirement** PRD before writing code, **524 automated tests**, integration tests against an isolated Postgres, and CI.",
        ],
        chips: comberChips,
      },
      {
        role: "Programming Mentor & Community Manager",
        company: "BeroLab",
        type: "Part-time",
        period: "Jul 2025 – Jun 2026",
        duration: "1 yr",
        mode: "Remote",
        summary: "Technical and career mentoring in a programming community.",
        bullets: [
          "Gave ongoing support in hard skills (technology) and soft skills (communication and career), helping community members grow.",
          "Created and ran career and professional-presentation mentoring sessions for community members.",
          "Led the “Em busca do SaaS Automático” initiative (“In search of the automatic SaaS”): weekly sessions that guided the community through designing and building SaaS products with recurring revenue.",
          "Helped work through technical questions and hands-on problems, encouraging autonomy and continuous learning.",
          "Took part in workshops and events, strengthening engagement and knowledge sharing among members.",
        ],
        chips: ["Mentoring", "Career", "SaaS", "Communication", "Community"],
      },
    ],
  },
};

/** Marcador quadrado da timeline; o atual pulsa em azul. Usado também em Formação. */
export function TimelineMarker({ current, className = "" }: { current?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={`block size-[11px] ${current ? "bg-blue-400 shadow-[0_0_12px_rgba(63,127,232,.65)]" : "border border-fg-subtle bg-ink-950"} ${className}`}
    >
      {current && <span className="block size-full animate-ping bg-blue-400" />}
    </span>
  );
}

const dashY = "bg-size-[1px_8px] bg-[linear-gradient(to_bottom,var(--color-fg-faint)_50%,transparent_0)]";

export function Experience({ lang }: { lang: Locale }) {
  const t = content[lang];
  return (
    <Section id="experiencia">
      <SectionHeader eyebrow={t.eyebrow} title={t.title} description={t.description} />

      <ol className="relative mt-12 flex flex-col gap-5 sm:mt-16 sm:gap-6">
        {/* Linha tracejada: trecho azul no item atual, some em fade no fim. */}
        <span aria-hidden className={`absolute bottom-0 left-[5px] top-6 w-px sm:top-8 ${dashY} [mask-image:linear-gradient(to_bottom,#000_85%,transparent)]`} />
        <span aria-hidden className="absolute left-[5px] top-6 h-48 w-px bg-size-[1px_8px] bg-[linear-gradient(to_bottom,var(--color-blue-400)_50%,transparent_0)] [mask-image:linear-gradient(to_bottom,#000,transparent)] sm:top-8" />

        {t.jobs.map((job) => (
          <li key={job.company} className="relative pl-6 sm:pl-10">
            <TimelineMarker current={job.current} className="absolute left-0 top-6 sm:top-8" />
            <Reveal>
              <article className="grid border border-line bg-ink-900 transition-colors duration-300 hover:border-line-strong hover:bg-ink-850 lg:grid-cols-[17rem_minmax(0,1fr)]">
                {/* Metadados: em cima no mobile, coluna sticky no lg. */}
                <div className="border-b border-line p-5 sm:p-7 lg:border-b-0 lg:border-r">
                  <div className="flex flex-col gap-3 lg:sticky lg:top-24">
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 lg:flex-col lg:items-start">
                      <p className="font-mono text-[13px] uppercase leading-normal tracking-[0.08em] text-fg tabular-nums">{job.period}</p>
                      <Badge tone={job.current ? "green" : "gray"}>{job.current ? t.status.current : t.status.ended}</Badge>
                    </div>
                    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle lg:flex-col">
                      {[job.duration, job.place, job.mode].filter(Boolean).map((m) => (
                        <li key={m}>{m}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="min-w-0 p-5 sm:p-7">
                  <h3 className="text-balance font-pixel text-[22px] leading-[1.15] text-fg sm:text-[28px]">{job.role}</h3>
                  <p className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="font-medium text-fg">{job.company}</span>
                    <span aria-hidden className="text-fg-faint">·</span>
                    <span className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle">{job.type}</span>
                  </p>
                  <p className="mt-5 max-w-[68ch] text-pretty text-[15px] leading-relaxed text-fg-muted sm:text-base">{job.summary}</p>

                  <ul className="mt-6 flex max-w-[70ch] flex-col gap-3.5 border-t border-line pt-6">
                    {job.bullets.map((b, i) => (
                      <li key={i}>
                        <Reveal delay={0.08 + i * 0.06} y={10} className="flex gap-3 text-pretty text-sm leading-relaxed text-fg-muted sm:text-[15px]">
                          <span aria-hidden className="mt-[0.62em] size-[5px] shrink-0 bg-blue-400" />
                          <span>
                            {b.split("**").map((s, j) =>
                              j % 2 ? (
                                <span key={j} className="whitespace-nowrap font-mono text-[0.92em] text-fg tabular-nums">{s}</span>
                              ) : (
                                s
                              ),
                            )}
                          </span>
                        </Reveal>
                      </li>
                    ))}
                  </ul>

                  <ul aria-label={t.chipsLabel} className="mt-7 flex flex-wrap gap-1.5">
                    {job.chips.map((c) => (
                      <li key={c} className="border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
