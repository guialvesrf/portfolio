"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Bilingual, Locale } from "@/lib/i18n";
import { Badge } from "@/components/ui/Badge";
import { CropMarks } from "@/components/ui/CropMarks";
import { Line, Packet } from "./fanout/parts";
import { useLoop } from "./useLoop";
import s from "./guardian/guardian.module.css";

type Stage = { op: string; out: string; note?: string };

const content: Bilingual<{
  client: string;
  server: string;
  stages: Stage[];
  toServer: string;
  serverCaption: string;
  verifier: [title: string, waiting: string, checking: string, ok: string];
  db: [title: string, name: string, waiting: string, opaque: string];
  status: string[];
  chips: string[];
  summary: string;
}> = {
  pt: {
    client: "cliente · sua máquina",
    server: "servidor",
    stages: [
      { op: "entrada", out: "senha mestre", note: "nunca sai do dispositivo" },
      { op: "Argon2id · t=3 · 64 MiB · 4 threads", out: "master key" },
      { op: "HKDF-SHA256 · pm/auth/v1", out: "auth hash" },
      { op: "HKDF-SHA256 · pm/enc/v1", out: "enc key", note: "fica no cliente" },
      { op: "AES-256-GCM · unwrap", out: "vault key" },
      { op: "AES-256-GCM · AAD pm/item/v1|user|item", out: "item cifrado" },
    ],
    toServer: "→ servidor",
    serverCaption: "Só o que cruza a linha chega aqui. Nada disso abre o cofre.",
    verifier: ["login", "aguardando", "verificando…", "✓ hash confere"],
    db: ["PostgreSQL · itens", "nome: ilegível", "aguardando…", "opaco"],
    status: [
      "senha mestre digitada",
      "derivando chave · Argon2id",
      "HKDF → auth hash",
      "login · enviando só o auth hash",
      "HKDF → enc key (local)",
      "abrindo a vault key",
      "cifrando item com AAD",
      "cofre aberto · 3 itens",
    ],
    chips: ["2FA TOTP", "5 erros → bloqueio 15 min", "sessão 30 min", "token só como SHA-256"],
    summary:
      "Diagrama animado do Guardian, gerenciador de senhas zero-knowledge. A senha mestre passa por Argon2id e vira a master key, que o HKDF-SHA256 divide em auth hash e enc key. Só o auth hash vai ao servidor, que guarda um Argon2id dele. A enc key nunca sai do cliente: ela abre a vault key com AES-256-GCM, e a vault key cifra cada item, inclusive o nome, com AES-256-GCM e AAD ligada ao usuário e ao item. O servidor recebe e guarda apenas blobs opacos no PostgreSQL.",
  },
  en: {
    client: "client · your machine",
    server: "server",
    stages: [
      { op: "input", out: "master password", note: "never leaves the device" },
      { op: "Argon2id · t=3 · 64 MiB · 4 threads", out: "master key" },
      { op: "HKDF-SHA256 · pm/auth/v1", out: "auth hash" },
      { op: "HKDF-SHA256 · pm/enc/v1", out: "enc key", note: "stays on the client" },
      { op: "AES-256-GCM · unwrap", out: "vault key" },
      { op: "AES-256-GCM · AAD pm/item/v1|user|item", out: "sealed item" },
    ],
    toServer: "→ server",
    serverCaption: "Only what crosses the line gets here. None of it opens the vault.",
    verifier: ["login", "waiting", "checking…", "✓ hash matches"],
    db: ["PostgreSQL · items", "name: unreadable", "waiting…", "opaque"],
    status: [
      "master password typed",
      "deriving key · Argon2id",
      "HKDF → auth hash",
      "login · sending only the auth hash",
      "HKDF → enc key (local)",
      "opening the vault key",
      "sealing item with AAD",
      "vault open · 3 items",
    ],
    chips: ["TOTP 2FA", "5 misses → 15 min lock", "30 min session", "token stored as SHA-256"],
    summary:
      "Animated diagram of Guardian, a zero-knowledge password manager. The master password goes through Argon2id into the master key, which HKDF-SHA256 splits into an auth hash and an enc key. Only the auth hash goes to the server, which stores an Argon2id of it. The enc key never leaves the client: it opens the vault key with AES-256-GCM, and the vault key seals every item, name included, with AES-256-GCM and AAD bound to the user and the item. The server only receives and stores opaque blobs in PostgreSQL.",
  },
};

// Passos: 0 senha · 1 Argon2id · 2 auth hash · 3 envia auth · 4 enc key · 5 vault key · 6 cifra e envia · 7 pronto
const STEPS = [800, 1100, 1000, 1300, 1000, 1000, 1500, 2400] as const;
const ACTIVE_AT = [0, 1, 2, 4, 5, 6]; // em que passo cada estágio calcula
const DONE = STEPS.length - 1;

// Valores ilustrativos fixos (não são chaves reais).
const VALUES = ["••••••••••••", "7c1e9a04d2b85f3e6a90c4d1", "e3b04291fa6cd8775b1e2c09", "5a8f13c7e9024db6a17f3e58", "c2d94e1b07a35f86e2a1d940"];
const ITEMS = ["GitHub", "Gmail", "Amazon"];
const BLOBS = ["9f3ac1e0477bd2a6c1", "1b84e6f2a90c5d37e4", "d07a5c3e18f94b6208"];
const BRAILLE = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";

// Linha de grade de cada estágio no md+ (classes literais para o Tailwind enxergar).
const ROW = ["md:row-start-1", "md:row-start-2", "md:row-start-3", "md:row-start-4", "md:row-start-5", "md:row-start-6"];

const LABEL = "font-mono text-[10px] uppercase leading-none tracking-[0.12em] text-fg-subtle";
const mod = (n: number, m: number) => ((n % m) + m) % m;

export function Guardian({ lang }: { lang: Locale }) {
  const t = content[lang];
  const { ref, step, cycle, still } = useLoop<HTMLDivElement>(STEPS, DONE);
  const run = !still;
  const item = mod(cycle, ITEMS.length);
  const sent = step === DONE; // o blob novo chega no fim do passo 6

  const value = (i: number) => (i === 5 ? `${ITEMS[item]} → ${BLOBS[item]}` : VALUES[i]);

  return (
    <div ref={ref} className="flex h-full flex-col gap-5">
      <p className="sr-only">{t.summary}</p>

      <div aria-hidden className="flex flex-col gap-4">
        <div className="hidden grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,15rem)] items-end md:grid lg:grid-cols-[minmax(0,1fr)_5rem_minmax(0,17rem)]">
          <p className={LABEL}>{t.client}</p>
          <p className={`${LABEL} text-center`}>|</p>
          <p className={LABEL}>{t.server}</p>
        </div>
        <p className={`${LABEL} md:hidden`}>{t.client}</p>

        <div className="grid gap-2 md:auto-rows-fr md:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,15rem)] lg:grid-cols-[minmax(0,1fr)_5rem_minmax(0,17rem)]">
          {t.stages.map((st, i) => {
            const at = ACTIVE_AT[i];
            const active = run && step === at;
            const done = i === 0 || step > at;
            const crosses = i === 2 || i === 5;
            const crossed = i === 2 ? step >= 3 : sent;
            return (
              <div
                key={i}
                className={`relative flex min-w-0 flex-col justify-center gap-1.5 border px-3 py-2.5 transition-colors duration-300 md:col-start-1 ${ROW[i]} ${
                  active ? "border-blue-400/60 bg-blue-950/40" : "border-line bg-ink-850"
                }`}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="font-mono text-[10px] text-fg-faint">{String(i + 1).padStart(2, "0")}</span>
                  <span className="truncate font-mono text-[10px] uppercase tracking-wider text-fg-subtle">{st.op}</span>
                </div>
                <div className="flex min-w-0 items-baseline gap-2">
                  <span className={`shrink-0 font-mono text-[11px] ${i === 3 ? "text-yellow-300" : "text-fg"}`}>
                    {st.out}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-blue-300">
                    {active && i > 0 ? <Scramble key={`${cycle}-${i}`} text={value(i)} seed={cycle * 7 + i} /> : done ? value(i) : "· · · ·"}
                  </span>
                  {st.note && <span className="hidden shrink-0 font-mono text-[10px] text-fg-subtle sm:inline">{st.note}</span>}
                  {crosses && (
                    <span className={`shrink-0 font-mono text-[10px] transition-colors md:hidden ${crossed ? "text-blue-300" : "text-fg-faint"}`}>
                      {t.toServer}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Fronteira cliente | servidor */}
          <div className="relative my-2 h-px md:hidden">
            <Line cls="inset-x-0 top-0 h-0 border-t" lit />
            <span className={`${LABEL} absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-ink-900 px-2`}>{t.server}</span>
          </div>
          <div className="relative hidden md:col-start-2 md:row-span-6 md:row-start-1 md:block">
            <Line cls="inset-y-0 left-1/2 w-0 border-l" lit />
          </div>

          {/* Cruzamentos (md+) */}
          <div className="relative hidden md:col-start-2 md:row-start-3 md:block">
            <Line cls="inset-x-0 top-1/2 h-0 border-t" lit={step >= 3}>
              {run && step === 3 && <Packet key={cycle} at={0.15} dur={0.55} />}
            </Line>
          </div>
          <div className="relative hidden md:col-start-2 md:row-start-6 md:block">
            <Line cls="inset-x-0 top-1/2 h-0 border-t" lit={sent}>
              {run && step === 6 && <Packet key={cycle} at={0.7} dur={0.6} />}
            </Line>
          </div>

          <p className="hidden self-center text-pretty text-xs leading-relaxed text-fg-subtle md:col-start-3 md:row-span-2 md:row-start-1 md:block">
            {t.serverCaption}
          </p>

          {/* Verificador de login */}
          <div className="flex flex-col justify-center gap-1.5 border border-line bg-ink-850 px-3 py-2.5 md:col-start-3 md:row-start-3">
            <p className={LABEL}>{t.verifier[0]}</p>
            <p className="truncate font-mono text-[11px] text-fg-muted">Argon2id(authHash, serverSalt)</p>
            <p className={`font-mono text-[11px] ${step >= 4 ? "text-green-500" : "text-fg-subtle"}`}>
              {step >= 4 ? t.verifier[3] : step === 3 ? t.verifier[2] : t.verifier[1]}
            </p>
          </div>

          {/* Banco: só blobs opacos */}
          <div className="relative flex flex-col gap-2 border border-line bg-ink-850 px-3 py-2.5 md:col-start-3 md:row-span-2 md:row-start-5">
            <CropMarks size={6} inset={3} className="border-fg-faint" />
            <div className="flex items-center justify-between gap-2">
              <p className={LABEL}>{t.db[0]}</p>
              <Badge tone="gray">{t.db[3]}</Badge>
            </div>
            {[-2, -1, 0].map((k) => {
              const n = mod(cycle + k, BLOBS.length);
              const fresh = k === 0;
              return (
                <motion.p
                  key={`${cycle + k}`}
                  initial={fresh && run ? { opacity: 0, x: -6 } : false}
                  animate={{ opacity: fresh && !sent ? 0.35 : 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`flex min-w-0 items-baseline justify-between gap-2 border-t border-line pt-1.5 font-mono text-[11px] ${fresh && sent ? "text-blue-300" : "text-fg-muted"}`}
                >
                  <span className="truncate">{fresh && !sent ? t.db[2] : `blob ${BLOBS[n].slice(0, 6)}…${BLOBS[n].slice(-2)}`}</span>
                  <span className="shrink-0 text-[10px] text-fg-subtle">{t.db[1]}</span>
                </motion.p>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mini terminal do TUI + garantias de segurança */}
      <div aria-hidden className="mt-auto flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex min-w-0 items-center gap-2 font-mono text-xs text-fg-muted">
          <span className="text-fg-subtle">guardian ›</span>
          {step === DONE ? (
            <span className="text-green-500">✓</span>
          ) : (
            <span className={`${s.spin} text-blue-300`}>
              <span>
                {[...BRAILLE].map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </span>
            </span>
          )}
          <span className="truncate">{t.status[step]}</span>
        </p>
        <ul className="flex flex-wrap gap-1.5">
          {t.chips.map((c) => (
            <li key={c} className="border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const HEX = "0123456789abcdef";

/** Embaralha e resolve da esquerda para a direita (~0,5 s). Determinístico pela seed. */
function Scramble({ text, seed }: { text: string; seed: number }) {
  const FRAMES = 12;
  const [f, setF] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setF((x) => (x < FRAMES ? x + 1 : x)), 45);
    return () => clearInterval(id);
  }, []);
  const solved = Math.floor((f / FRAMES) * text.length);
  let r = seed * 9301 + f * 49297;
  const out = [...text]
    .map((c, i) => {
      if (i < solved || c === " " || c === "→") return c;
      r = (r * 9301 + 49297) % 233280;
      return HEX[r % 16];
    })
    .join("");
  return <>{out}</>;
}
