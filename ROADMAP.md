# Roteiro — Portfólio Guilherme Alves

Base visual: [DESIGN.md](DESIGN.md) (referência Arclo), com estas mudanças:
- **Tom único escuro do começo ao fim** (`#05090A`). Sem seção azul e sem seções brancas. O azul `#054AB2` vira só acento (botão primário, crop marks, pulsos, números).
- Divisores em degrau ficam como **escuro → cinza → escuro** (tom sobre tom), só para marcar o ritmo entre seções.
- Bilíngue **PT / EN**.

## Stack
| Item | Escolha | Motivo |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript | pedido |
| Estilo | Tailwind CSS v4 | tokens via `@theme` no CSS, sem config JS |
| Animação | Framer Motion (`motion/react`) | `whileInView`, `useInView`, `animate` para contadores |
| i18n | rotas `app/[lang]/` + `dictionaries/pt.json` e `en.json` | padrão oficial do Next, sem lib. `middleware` redireciona `/` pelo `Accept-Language` |
| Fontes | `geist` (Sans + Mono) e fonte pixel (**Geist Pixel**, ou **Departure Mono** como reserva) | auto-hospedadas via `next/font` |
| GitHub | `github-contributions-api.jogruber.de/v4/guialvesrf` no servidor, `revalidate: 86400` | sem token. Se a API cair, trocar pela GraphQL do GitHub com `GITHUB_TOKEN` |
| Deploy | Vercel | |

## Mapa da página

```
Nav ─ logo "GA" · Sobre · Experiência · Engenharia · Stack · Conquistas · Formação · [PT|EN] · Contato
01 Hero
02 Destaques (4 cards) + Contribuições GitHub
03 Experiência
04 Engenharia (diagramas animados)
05 Stack (cards + terminal)
06 Conquistas (certificado)
07 Formação
08 CTA + Footer
```

### 01 · Hero
- Eyebrow `[ BACK-END DEVELOPER ]`. H1 pixel "Guilherme Alves" e, embaixo, o subtítulo "Desenvolvedor Back-End · Go, TypeScript/Bun, Python".
- CTAs: `Ver projetos` (azul) e `Contato` (outline).
- Marquee das tecnologias no lugar dos logos: Go, Gin, TypeScript, Bun, Python, PostgreSQL, SQLite, Docker, GitHub Actions, WebSocket, Modbus, Raspberry Pi.
- Mock em 3 colunas, igual à referência:
  - Esq **Connected** com GitHub, LinkedIn e Instagram (`@guialvesrf`) e o badge `CONNECTED`.
  - Centro: um prompt que digita *"Construir um back-end em tempo real, testável sem o hardware ligado"*, seguido do terminal com logs `[GO] [WS] [PID] [CI]`.
  - Dir **Config**: `Role Back-End`, `Exp 1 ano`, `Base Rio Verde, GO`, `Stack Go · TS · Py`.
- Fundo com quadrados rotacionados e vinheta.

### 02 · Destaques + GitHub
4 cards lado a lado (2×2 no tablet, 1 coluna no mobile), com número pixel animado:
| Número | Legenda |
|---|---|
| **−74%** | Payload do painel no 1º acesso (4,75 MB para 1,26 MB) |
| **96 ms → 0,04 ms** | Paginação de eventos com índice, em 300 mil registros |
| **40 → 10** | Chamadas à API sobre conexões TCP, sem reconectar o WebSocket |
| **R$ 22 mil/mês** | Redução de custo na Cargill (Jataí-GO) com os algoritmos determinístico + random forest do pid-service |

Abaixo, o **heatmap de contribuições** (53 semanas × 7 dias) com quadrados retos em 5 níveis de azul, total de contribuições no canto e as células entrando em cascata por coluna.

### 03 · Experiência
Timeline vertical com linha tracejada e pontos quadrados. Cada item é um card com badge de status (`■ ATUAL` em verde, `■ ENCERRADO` em cinza), cargo, empresa, período, local, resumo e bullets.
1. **Desenvolvedor Back-End (Inovação/P&D)**, Comber Indústria LTDA, jun 2026 até o momento, Rio Verde-GO, presencial.
2. **Mentor de Programação & Gerente de Comunidade**, BeroLab, jul 2025 a jun 2026, remoto.

Os textos ficam no dicionário em PT e EN.

### 04 · Engenharia (o coração do portfólio)
Grid de cards. Cada card tem eyebrow, título, legenda curta e um **diagrama SVG animado** que roda quando o card entra na tela, com `prefers-reduced-motion` respeitado.

**A. Fan-out em tempo real**
```
[CLP] ──Modbus TCP──▶ [core / WebSocket] ──┬──▶ [web-service]  supervisório (Gin + SQLite)
                                           └──▶ [pid-service]  ajuste adaptativo
```
Pacotes quadrados azuis saem do CLP a cada ~600 ms, entram no hub e se duplicam em dois. Cada destino mostra um mini-valor que muda (temperatura e Hz).

**B. PID determinístico (regras + trilhos)**, baseado em `pid-service/src/domain/adjustment.py` e `evaluation.py`.
- Gráfico de temperatura × setpoint: a curva sobe pela rampa, cruza o setpoint e a janela de regulação acende.
- Métricas surgem: overshoot, oscilação, offset e Hz saturado.
- Lista de 5 regras **em ordem de prioridade**. A regra que casa acende e mostra `P ↓  D ↑`.
- Os "trilhos" (±30% e bounds) prendem o novo P/I/D. O episódio seguinte mostra a curva mais estável.

**C. Random Forest (camada ML)**, baseado em `infrastructure/ml_advisor.py`.
- Contador de episódios `0/20` enchendo. Antes de 20 aparece o texto "regras decidem".
- Em 20, uma grade de **5×5×5 = 125 candidatos** P/I/D surge em torno do PID atual.
- **80 árvores** votam e cada candidato recebe um score previsto (heatmap de cor).
- O `argmin` destaca o vencedor, que passa pelos **mesmos trilhos** da regra.
- Badge com os modos `off · shadow · drive`.

**D. Guardian, gerenciador de senhas zero-knowledge** (`password-manager`).
```
senha mestre ─Argon2id─▶ master key ─HKDF─┬─▶ auth hash ─────────▶ servidor
                                          └─▶ enc key ─AES-GCM─▶ vault key ─AES-GCM─▶ itens ─▶ blobs opacos
```
A senha vira bytes embaralhados a cada etapa, e só os blobs cifrados atravessam a linha "cliente | servidor". Na lateral fica um mini-terminal com o escudo braille girando e virando ✓.

**Projetos (seção própria, antes de Engenharia):** ISA (`~/Development/new-isa`) e Comissões (`~/Development/web-commission`), com diagrama de arquitetura/deploy.

> ⚠ Confidencialidade: os diagramas da Comber usam só nomes genéricos (CLP, WebSocket, web-service, pid-service). Nada de cliente, planta, "fornalha/secador" nem valores reais de calibração.

### 05 · Stack
3 cards: **Go**, **TypeScript / Bun**, **Python**. Cada card tem ícone pixel com crop marks, um parágrafo sobre a linguagem e como você a usa, chips das libs e, no rodapé, um **terminal** que digita e "executa":
| Card | Comando | Saída simulada |
|---|---|---|
| Go | `go mod init github.com/guialvesrf/app` | `go: creating new go.mod: module github.com/guialvesrf/app` |
| TS/Bun | `bun init -y` | `✓ Created package.json, tsconfig.json, index.ts` |
| Python | `python -m venv .venv && source .venv/bin/activate` | `(.venv) $` |

### 06 · Conquistas
Card largo (proporção 16:9) que imita o certificado:
- Fundo preto com brilho **verde** nos cantos inferiores. O verde é exceção local, porque é a identidade do certificado.
- Topo com `FIAP` à esquerda, `global solution` no centro e `FUTURE AT WORK` à direita, como texto e não como logos oficiais.
- Corpo em caps, fonte fina: "O CENTRO UNIVERSITÁRIO FIAP CERTIFICA QUE / GUILHERME ALVES RODRIGUES FERREIRA / GANHOU A **GLOBAL SOLUTION FUTURE AT WORK 2025**, REALIZADO NO DIA 11 DE NOVEMBRO".
- Detalhes de quadradinhos verdes e um selo `■ 1º LUGAR · HACKATHON`.
- Animação: o card faz um leve tilt 3D seguindo o mouse e um brilho atravessa ao entrar.
- Opcional: botão "ver certificado" abrindo a imagem original. Para isso, coloque o PNG em `public/`.

### 07 · Formação
2 cards com timeline:
| Curso | Instituição | Período | Status |
|---|---|---|---|
| Bacharelado em Engenharia de Software | UniRV | 2026 até o momento | `■ CURSANDO` |
| Bacharelado em Engenharia de Software | FIAP | 2024 a 2025 | `■ ENCERRADO` |

### 08 · CTA + Footer
- H2 "Vamos construir algo em tempo real?", com `guialves.garf50@hotmail.com` (copiar ao clicar) e botões para LinkedIn, GitHub e Instagram (`@guialvesrf`).
- Footer: logo, tagline, colunas de navegação, faixa de pontos e "© 2026 Guilherme Alves".

## Fases de desenvolvimento

| # | Fase | Entrega | Pronto quando |
|---|---|---|---|
| 0 | Setup | `create-next-app` (TS, Tailwind, App Router), `motion`, `geist`, fonte pixel, tokens no `globals.css` | `npm run dev` abre a página escura |
| 1 | i18n + layout | `app/[lang]/`, `dictionaries/`, middleware, Nav com toggle PT/EN, Footer | `/pt` e `/en` trocam todos os textos |
| 2 | Primitivos | `Eyebrow`, `CropMarks`, `Button`, `Badge`, `StepDivider`, `Reveal` (título palavra por palavra), `Counter`, `Typewriter` | página de teste com todos os primitivos |
| 3 | Hero | mock com 3 colunas, typewriter, logs, marquee e quadrados no fundo | igual à referência no desktop |
| 4 | Destaques + GitHub | 4 cards com contador e heatmap com dados reais | heatmap renderiza sem token |
| 5 | Experiência | timeline com 2 itens | |
| 6 | Engenharia | diagramas A, B, C e D animados | cada diagrama em loop, pausa fora da tela |
| 7 | Stack | 3 cards com terminal digitando | |
| 8 | Conquistas + Formação | certificado e timeline acadêmica | |
| 9 | CTA + polimento | responsivo (360 px+), `prefers-reduced-motion`, SEO/OG por idioma, Lighthouse ≥ 90, deploy na Vercel | URL pública |
| 10 | Projetos da empresa | E/F quando você enviar | |

## Pendências do seu lado
- [ ] Detalhes dos 2 projetos da empresa (fase 10)
- [ ] PNG do certificado em `public/certificado-fiap.png`, se quiser o botão "ver original"
- [ ] Foto, se quiser uma no hero (a referência não tem, então o plano é sem foto)
