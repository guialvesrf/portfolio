// Episódios ilustrativos do pid-service. Curvas inventadas, mas avaliadas com as
// mesmas fórmulas de src/domain/evaluation.py e decididas pelas mesmas regras e
// trilhos de src/domain/adjustment.py. Nenhum valor de calibração real.

export type Gains = [p: number, i: number, d: number];

export const N = 300; // amostras por episódio (1 Hz ≈ 5 min)
export const VIEW = { w: 400, h: 130 };
const E_MAX = 6; // faixa do eixo y, em °C de erro (temperatura − setpoint)
const E_MIN = -11;
const PAD = 8;

// tolerâncias resolvidas para um setpoint ilustrativo (os mínimos absolutos vencem)
const TOL = { overshoot: 2, undershoot: 2, regime: 1, oscillation: 0.5 };
const HZ = { saturation: 0.2, gap: 0.9 };
const W = { overshoot: 3, undershoot: 3, regime: 1.5, oscillation: 1, abs: 0.5, sat: 20, gap: 5 };
export const STEP = 0.15;
export const STEP_LIMIT = 0.3;
const SEEDS = [null, 0.02, 0.02] as const;
export const BOUNDS: [number, number][] = [[0.4, 2], [0.02, 0.25], [0.02, 0.33]];

/** Gerador determinístico (mulberry32): mesma curva no servidor e no cliente. */
export function prng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const mean = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length;
const med = (a: number, b: number, c: number) => Math.max(Math.min(a, b), Math.min(Math.max(a, b), c));

function median3(v: number[]) {
  const n = v.length;
  return v.map((x, i) =>
    i === 0 ? (v[0] + v[1]) / 2 : i === n - 1 ? (v[n - 2] + v[n - 1]) / 2 : med(v[i - 1], x, v[i + 1]),
  );
}

/** Rails.apply: passo limitado (±30%, semente ao sair de ~zero) e depois os bounds. */
export function rails(next: Gains, cur: Gains): Gains {
  return next.map((n, k) => {
    const a = cur[k];
    const [low, high] = a > 1e-6 ? [a * (1 - STEP_LIMIT), a * (1 + STEP_LIMIT)] : [0, SEEDS[k] ?? 0.1];
    const stepped = Math.min(Math.max(n, low), high);
    return Math.min(Math.max(stepped, BOUNDS[k][0]), BOUNDS[k][1]);
  }) as Gains;
}

type Metrics = { overshoot: number; undershoot: number; oscillation: number; offset: number; sat: number; gap: number };

/** AdjustmentPolicy.adjust: a primeira regra que casa decide. 5 = mantém. */
function adjust([p, i, d]: Gains, m: Metrics): { rule: number; raw: Gains } {
  if (m.overshoot > TOL.overshoot || m.undershoot > TOL.undershoot)
    return { rule: 0, raw: [p * (1 - STEP / 2), i, Math.max(d * (1 + STEP), 0.02)] };
  if (m.sat > HZ.saturation || m.gap > HZ.gap) return { rule: 1, raw: [p * (1 - STEP), i, Math.max(d * (1 + STEP), 0.02)] };
  if (m.oscillation > TOL.oscillation) return { rule: 2, raw: [p * (1 - STEP), i * (1 - STEP), d] };
  if (m.offset < -TOL.regime) return { rule: 3, raw: [p * (1 + STEP / 2), Math.max(i * (1 + STEP), 0.02), d] };
  if (m.offset > TOL.regime) return { rule: 4, raw: [p * (1 - STEP / 2), i * (1 - STEP / 2), d] };
  return { rule: 5, raw: [p, i, d] };
}

const x = (k: number) => (k / (N - 1)) * VIEW.w;
const y = (e: number) => PAD + ((E_MAX - e) / (E_MAX - E_MIN)) * (VIEW.h - 2 * PAD);
const path = (v: number[], every = 1) =>
  v
    .map((e, k) => (k % every && k !== v.length - 1 ? "" : `${k ? "L" : "M"}${x(k).toFixed(1)} ${y(e).toFixed(1)}`))
    .join("");

/** Resposta subamortecida a partir de 10 °C abaixo do setpoint + oscilação sustentada opcional. */
function simulate(spec: { decay: number; wobble: number; seed: number; sat: number; gap: number }, cur: Gains) {
  const r = prng(spec.seed);
  const raw = Array.from({ length: N }, (_, k) => {
    const t = k / (N - 1);
    const ramp = Math.min(1, Math.max(0, (t - 0.45) / 0.3));
    return (
      -10 * Math.exp(-spec.decay * t) * Math.cos(7.85 * t) +
      spec.wobble * Math.sin(2 * Math.PI * 6 * t) * ramp * ramp * (3 - 2 * ramp) +
      (r() - 0.5) * 0.6
    );
  });
  raw[165] += 4; // glitches de 1 amostra: o filtro de mediana-3 os descarta
  raw[250] -= 4;

  const f = median3(raw);
  const start = f.findIndex((e) => Math.sign(e) !== Math.sign(f[0])); // 1º cruzamento do setpoint
  const err = f.slice(start);
  const tailStart = start + Math.floor(err.length * 0.75);
  const tail = f.slice(tailStart);
  const offset = mean(tail);
  const peak = start + err.indexOf(Math.max(...err));
  const m: Metrics = {
    overshoot: Math.max(0, Math.max(...err)),
    undershoot: Math.max(0, -Math.min(...err)),
    oscillation: Math.sqrt(mean(tail.map((e) => (e - offset) ** 2))),
    offset,
    sat: spec.sat,
    gap: spec.gap,
  };
  const score =
    W.overshoot * m.overshoot + W.undershoot * m.undershoot + W.regime * Math.abs(offset) +
    W.oscillation * m.oscillation + W.abs * mean(err.map(Math.abs)) + W.sat * m.sat + W.gap * m.gap;
  const { rule, raw: proposed } = adjust(cur, m);

  return {
    m, score, rule, cur, proposed, next: rails(proposed, cur),
    rawPath: path(raw),
    path: path(f, 2),
    cross: x(start) / VIEW.w, // frações do eixo x, para sincronizar com o desenho
    tail: x(tailStart) / VIEW.w,
    peak: { x: x(peak) / VIEW.w, y: y(f[peak]) / VIEW.h },
  };
}

export const SP_Y = y(0) / VIEW.h;

// ep 1: overshoot → regra 1 · ep 2: oscilação → regra 3 · ep 3: dentro da tolerância
const SPECS = [
  { decay: 2, wobble: 0, seed: 7, sat: 0.12, gap: 0.62 },
  { decay: 5, wobble: 1.2, seed: 11, sat: 0.08, gap: 0.48 },
  { decay: 6, wobble: 0.15, seed: 23, sat: 0.03, gap: 0.3 },
];

export const EPISODES = SPECS.reduce<ReturnType<typeof simulate>[]>(
  (eps, spec) => [...eps, simulate(spec, eps.at(-1)?.next ?? [1.2, 0.1, 0.3])],
  [],
);
