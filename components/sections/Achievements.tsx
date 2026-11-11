import type { Bilingual, Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CertificateDialog } from "./achievements/CertificateDialog";
import { TiltCard } from "./achievements/TiltCard";

const content: Bilingual<{
  eyebrow: string;
  title: string[];
  description: string;
  cert: { certifies: string; won: string; rest: string; seal: string };
  context: string;
  open: string;
  dialogTitle: string;
  close: string;
  alt: string;
}> = {
  pt: {
    eyebrow: "Conquistas",
    title: ["Vencedor do", "Hackathon FIAP"],
    description: "1º lugar na Global Solution Future at Work 2025, o hackathon da FIAP realizado em 11 de novembro de 2025.",
    cert: {
      certifies: "O Centro Universitário FIAP certifica que",
      won: "Ganhou a",
      rest: ", realizado no dia 11 de novembro, com uma carga horária de 2 horas.",
      seal: "1º lugar · Hackathon",
    },
    context:
      "Desafio da FIAP com o tema Future at Work: pensar, construir e apresentar, contra o relógio, uma solução de tecnologia para o futuro do trabalho. O projeto ficou com o 1º lugar da edição 2025.",
    open: "Ver certificado original",
    dialogTitle: "Certificado original · FIAP",
    close: "Fechar",
    alt: "Certificado da FIAP: Guilherme Alves Rodrigues Ferreira ganhou a Global Solution Future at Work 2025, realizada em 11 de novembro, com carga horária de 2 horas.",
  },
  en: {
    eyebrow: "Awards",
    title: ["FIAP Hackathon", "winner"],
    description: "First place at Global Solution Future at Work 2025, the FIAP hackathon held on November 11, 2025.",
    cert: {
      certifies: "FIAP University Center certifies that",
      won: "Won the",
      rest: ", held on November 11, with a workload of 2 hours.",
      seal: "1st place · Hackathon",
    },
    context:
      "A FIAP challenge themed Future at Work: think up, build and pitch a tech solution for the future of work, against the clock. The project took first place in the 2025 edition.",
    open: "View original certificate",
    dialogTitle: "Original certificate · FIAP",
    close: "Close",
    alt: "FIAP certificate: Guilherme Alves Rodrigues Ferreira won Global Solution Future at Work 2025, held on November 11, with a workload of 2 hours.",
  },
};

const EVENT = "Global Solution Future at Work 2025";
const CHIPS = ["Hackathon", "FIAP", "Future at Work", "2025"];

// Verde é exceção local: identidade visual do certificado.
const GLOW = [
  "radial-gradient(ellipse 55% 60% at 0% 100%, rgb(29 122 82 / 0.42), transparent 70%)",
  "radial-gradient(ellipse 50% 55% at 100% 100%, rgb(29 122 82 / 0.3), transparent 70%)",
  "radial-gradient(ellipse 70% 40% at 50% 120%, #0f3d2a, transparent 70%)",
  "radial-gradient(ellipse 35% 45% at 6% 42%, rgb(20 96 104 / 0.16), transparent 70%)",
  "radial-gradient(ellipse 30% 40% at 94% 40%, rgb(20 96 104 / 0.1), transparent 70%)",
].join(",");

const DECO_CLASS = {
  fill: "size-[max(4px,0.55cqw)] bg-green-500",
  hollow: "size-[max(4px,0.55cqw)] border border-green-500",
  dash: "h-px w-[max(6px,0.6cqw)] bg-green-500",
  x: "text-[max(9px,0.8cqw)] leading-none text-green-500",
};
// Detalhes espalhados como no original: [left %, top %, tipo, só a partir do sm].
const DECO: [number, number, keyof typeof DECO_CLASS, boolean?][] = [
  [7.6, 17, "dash"],
  [7.6, 19.3, "dash"],
  [31.6, 19.6, "hollow", true],
  [31.6, 21.2, "hollow", true],
  [80.6, 24.6, "fill", true],
  [94.5, 49.3, "dash", true],
  [94.5, 51.4, "dash", true],
  [7.8, 70.4, "fill", true],
  [7.8, 73.3, "hollow", true],
  [23.2, 81.4, "x", true],
  [78.8, 80.5, "hollow"],
  [85.4, 80.5, "hollow"],
  [87.8, 80.5, "hollow"],
];

export function Achievements({ lang }: { lang: Locale }) {
  const t = content[lang];
  return (
    <Section id="conquistas">
      <SectionHeader eyebrow={t.eyebrow} title={t.title} description={t.description} />

      <TiltCard className="noise @container relative mt-12 flex aspect-[4/5] flex-col overflow-clip border border-line bg-[#040706] text-white transition-colors duration-300 hover:border-line-strong sm:mt-16 sm:aspect-video">
        <div aria-hidden className="absolute inset-0" style={{ background: GLOW }} />
        {DECO.map(([x, y, kind, smOnly], i) => (
          <span
            key={i}
            aria-hidden
            className={`absolute ${smOnly ? "hidden sm:block" : ""} ${DECO_CLASS[kind]}`}
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            {kind === "x" && "×"}
          </span>
        ))}

        {/* Fonte base = 1% da largura do card (2,35% no mobile, que é mais alto); filhos em `em`. */}
        <div className="relative flex flex-1 flex-col p-[6cqw] text-[2.35cqw] sm:px-[5cqw] sm:py-[4.5cqw] sm:text-[1cqw]">
          <div className="grid grid-cols-2 items-start gap-y-[2.4em] sm:grid-cols-3">
            <span className="col-start-1 row-start-1 text-[2.2em] font-extralight leading-none tracking-[0.3em]">FIAP</span>
            <span className="col-span-2 row-start-2 justify-self-center whitespace-nowrap text-[1.9em] leading-none tracking-[-0.01em] sm:col-span-1 sm:col-start-2 sm:row-start-1">
              <span className="font-light">global</span> <span className="font-semibold">solution</span>
            </span>
            <span className="col-start-2 row-start-1 flex flex-col justify-self-end text-[max(10px,1.5em)] font-extralight uppercase leading-[1.05] tracking-[0.08em] sm:col-start-3">
              <span>Future</span>
              <span className="text-white/55">At</span>
              <span>Work</span>
            </span>
          </div>

          <div className="my-auto flex flex-col items-center gap-[2.2em] py-[2.5em] text-center uppercase">
            <p className="text-balance text-[max(10px,1.4em)] font-light tracking-[0.08em] text-white/80">{t.cert.certifies}</p>
            <p className="text-balance text-[2.3em] font-normal leading-tight tracking-[0.06em]">{site.fullName}</p>
            <p className="max-w-[30em] text-balance text-[max(10px,1.4em)] font-light leading-[1.6] tracking-[0.08em] text-white/80">
              {t.cert.won} <strong className="font-semibold text-white">{EVENT}</strong>
              {t.cert.rest}
            </p>
          </div>

          <div className="flex flex-col items-center gap-[1.1em]">
            <span className="inline-flex items-center gap-[0.6em] whitespace-nowrap border border-green-500/40 bg-green-950/70 px-[0.9em] py-[0.55em] font-pixel text-[max(10px,1.3em)] uppercase leading-none tracking-[0.06em] text-green-500">
              <span aria-hidden className="size-[0.55em] bg-current" />
              {t.cert.seal}
            </span>
            <span className="font-mono text-[max(10px,1em)] tracking-[0.2em] text-white/55">11.11.2025</span>
          </div>
        </div>
      </TiltCard>

      <Reveal delay={0.15} className="mt-4 sm:mt-5">
        <div className="flex flex-col gap-6 border border-line bg-ink-900 p-5 sm:p-7 md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="flex max-w-2xl flex-col gap-4">
            <p className="text-pretty text-sm leading-relaxed text-fg-muted sm:text-[15px]">{t.context}</p>
            <ul className="flex flex-wrap gap-1.5">
              {CHIPS.map((c) => (
                <li key={c} className="whitespace-nowrap border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <CertificateDialog label={t.open} title={t.dialogTitle} close={t.close} alt={t.alt} />
        </div>
      </Reveal>
    </Section>
  );
}
