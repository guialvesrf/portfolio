import type { Bilingual, Locale } from "@/lib/i18n";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DiagramCard } from "./engineering/DiagramCard";
import { FanOut } from "./engineering/FanOut";
import { PidRules } from "./engineering/PidRules";
import { RandomForest } from "./engineering/RandomForest";
import { Guardian } from "./engineering/Guardian";

type Card = { tag: string; title: string; description: string; chips: string[] };

const content: Bilingual<{ eyebrow: string; title: string[]; description: string; cards: Record<"fanout" | "pid" | "rf" | "guardian", Card> }> = {
  pt: {
    eyebrow: "Engenharia",
    title: ["Por dentro do que", "eu construí"],
    description: "Os sistemas por trás dos números, animados a partir do código real. Nomes de planta e valores de calibração ficam de fora.",
    cards: {
      fanout: {
        tag: "Tempo real",
        title: "Fan-out do CLP via WebSocket",
        description: "Um único dono da conexão Modbus lê o CLP uma vez por segundo e distribui a mesma leitura para o supervisório e para o serviço de ajuste adaptativo.",
        chips: ["Modbus TCP", "WebSocket", "Go · Gin", "Python", "1 socket · N clientes"],
      },
      pid: {
        tag: "pid-service · determinístico",
        title: "Sintonia por regras e trilhos",
        description: "Cada episódio mede overshoot, oscilação, offset e saturação. A primeira regra que casa ajusta P, I e D, sempre dentro de ±30% e dos limites.",
        chips: ["Python", "NumPy", "Portas e adaptadores", "Episódios de 5 min"],
      },
      rf: {
        tag: "pid-service · machine learning",
        title: "Random Forest sobre o histórico",
        description: "Depois de 20 episódios de regime, uma floresta de 80 árvores prevê o score de 125 combinações de P, I e D ao redor do atual e escolhe a menor.",
        chips: ["scikit-learn", "RandomForestRegressor", "argmin", "off · shadow · drive"],
      },
      guardian: {
        tag: "Projeto pessoal · Go",
        title: "Guardian, cofre zero-knowledge",
        description: "A senha mestre nunca sai da máquina. O cliente deriva as chaves e cifra cada item; o servidor só guarda blobs opacos que não consegue ler.",
        chips: ["Go", "Argon2id", "HKDF-SHA256", "AES-256-GCM", "TOTP", "PostgreSQL"],
      },
    },
  },
  en: {
    eyebrow: "Engineering",
    title: ["Inside what", "I built"],
    description: "The systems behind the numbers, animated from the real code. Plant names and calibration values are left out.",
    cards: {
      fanout: {
        tag: "Real time",
        title: "PLC fan-out over WebSocket",
        description: "A single owner of the Modbus connection reads the PLC once per second and streams the same reading to the supervisory UI and the adaptive tuning service.",
        chips: ["Modbus TCP", "WebSocket", "Go · Gin", "Python", "1 socket · N clients"],
      },
      pid: {
        tag: "pid-service · deterministic",
        title: "Tuning by rules and rails",
        description: "Each episode measures overshoot, oscillation, offset and saturation. The first matching rule adjusts P, I and D, always within ±30% and the bounds.",
        chips: ["Python", "NumPy", "Ports and adapters", "5-min episodes"],
      },
      rf: {
        tag: "pid-service · machine learning",
        title: "Random Forest over history",
        description: "After 20 steady-state episodes, an 80-tree forest predicts the score of 125 P, I, D combinations around the current one and picks the lowest.",
        chips: ["scikit-learn", "RandomForestRegressor", "argmin", "off · shadow · drive"],
      },
      guardian: {
        tag: "Side project · Go",
        title: "Guardian, a zero-knowledge vault",
        description: "The master password never leaves the machine. The client derives the keys and encrypts every item; the server only stores opaque blobs it cannot read.",
        chips: ["Go", "Argon2id", "HKDF-SHA256", "AES-256-GCM", "TOTP", "PostgreSQL"],
      },
    },
  },
};

export function Engineering({ lang }: { lang: Locale }) {
  const t = content[lang];
  const c = t.cards;
  return (
    <Section id="engenharia">
      <SectionHeader eyebrow={t.eyebrow} title={t.title} description={t.description} />
      <div className="mt-12 grid gap-4 sm:mt-16 sm:gap-5 lg:grid-cols-2">
        <DiagramCard index="01" wide {...c.fanout}>
          <FanOut lang={lang} />
        </DiagramCard>
        <DiagramCard index="02" {...c.pid}>
          <PidRules lang={lang} />
        </DiagramCard>
        <DiagramCard index="03" {...c.rf}>
          <RandomForest lang={lang} />
        </DiagramCard>
        <DiagramCard index="04" wide {...c.guardian}>
          <Guardian lang={lang} />
        </DiagramCard>
      </div>
    </Section>
  );
}
