# Referência de Design — "Arclo Home" (vídeo 18,5s, 2880×2160 @60fps)

Landing page de SaaS de agentes de IA. Estética **"pixel-tech / terminal"**: tipografia pixelada em títulos, labels monoespaçadas entre colchetes, grids, cantos de mira (crop marks), alternância de seções **escura → clara → azul → clara → escura**.

---

## 1. Design tokens

### Cores (amostradas dos frames)
| Token | Hex | Uso |
|---|---|---|
| `--ink-950` | `#05090A` | Fundo das seções escuras (hero, problema, CTA) |
| `--ink-900` | `#191C1D` – `#212526` | Cards no escuro |
| `--ink-800` | `#2F3032` | Bordas / input do hero |
| `--white` | `#FFFFFF` | Fundo das seções claras, texto no escuro |
| `--gray-50` | `#F7F7F9` | Grid sutil / fundos de ícone no claro |
| `--gray-200` | `#E4E4E7` | Bordas de card no claro |
| `--gray-500` | `#6B6F76` | Texto secundário |
| `--blue-600` | `#054AB2` | **Cor de marca**: seção "How it works", card do gráfico, botão primário, ícones |
| `--blue-500` | `#2761A9` / `#0C52B3` | Painéis sobre o azul, barras do gráfico |
| `--blue-300` | `#93ABD2` | Texto secundário sobre azul |
| `--yellow` | `#F4F1A0` (aprox.) | Label "FROM INTENT TO EXECUTION" e topo das barras do gráfico |
| `--green` | `#0D6753` bg / `#2BB673` texto | Badges "ACTIVE" / "CONNECTED" |
| Log colors | roxo `#683BBA`, magenta `#9F3AA9`, verde `#2BB673` | Tags `[RESEARCH AGENT]` etc. no terminal |

### Tipografia (3 famílias)
1. **Display pixel** — todos os H1/H2, números de KPI, títulos de card. Bitmap/pixel monoespaçada.
   Candidatas: **Geist Pixel** (Vercel), **Departure Mono**, **PP NeueBit**. Peso único.
   - H1 hero: ~80px / lh 1.05, centralizado
   - H2 seção: ~56px / lh 1.15, 2 linhas
   - H3 card: ~32px
2. **Mono** — labels/eyebrows em CAPS, tabs, logs, metadados (`Model  Claude 3.5 Sonet`).
   Candidatas: **JetBrains Mono / IBM Plex Mono / Geist Mono**. 12–14px, tracking +0.05em.
3. **Sans** — parágrafos, botões, nav, itens de lista. Candidatas: **Inter / Geist Sans**. 16–18px, peso 400.

### Espaçamento / grid
- Container ~1200px, gutter lateral 120px (no frame de 1440).
- Seções com ~120–160px de padding vertical.
- Grid de cards: 3 colunas, gap ~24px.
- **Raio de borda = 0** em tudo (cantos retos). Bordas 1px.

---

## 2. Componentes-assinatura (o que dá identidade)

| Componente | Descrição |
|---|---|
| **Eyebrow com colchetes** | `[ THE PROBLEM ]` — texto mono caps, colchetes desenhados como bordas L (só cantos esquerdo/direito). Azul no claro, branco no escuro, amarelo no azul. |
| **Crop marks** | Quatro cantos em L (azul) ao redor de ícones e do logo central. |
| **Cantos pixelados (notch)** | Cards do "Problema" têm um canto cortado em degraus de 2–3 quadradinhos pretos (pixel stair). |
| **Divisor em degraus** | Transição entre seções = 4–5 faixas horizontais de ~14px com cor interpolada (ex.: preto→cinza→branco, azul→azul claro→branco). Substitui gradiente suave. |
| **Botões** | Retos. Primário: azul sólido `#054AB2` com leve gradiente/brilho interno. Secundário: borda 1px + fundo transparente. Variante com seta `→ Get Started`. No CTA final: branco sólido + outline. |
| **Badges de status** | `■ ACTIVE` (verde), `■ DISABLED` (cinza), `■ CONNECTED`, `■ AGENT` — mono 10–11px, quadradinho como bullet. |
| **Cards de dados** | Borda 1px, sem sombra, ícone pixel 20px no canto superior direito, número grande em pixel azul, label sans cinza. |
| **Fundo pontilhado** | Dot-grid em painéis (plano de execução, gráfico, rodapé). |
| **Ícones** | Estilo pixel/bitmap (robô, cubo, gráfico, relógio). Logo: invader pixel azul. |

---

## 3. Estrutura da página (ordem e conteúdo)

### 3.1 Nav (fixa, sobre o hero escuro)
Logo (ícone empilhado + "Arclo") · links centralizados `Products Resources Pricing Company` · botão outline `Get Started` à direita.

### 3.2 Hero (escuro `#05090A`, vinheta radial mais clara no topo + ruído/grain)
- H1 pixel 2 linhas centralizado + subtítulo sans cinza.
- 2 CTAs (primário azul + outline).
- **Marquee de logos** em cinza (Medium, Mailchimp, Evernote, Twitch, Dropbox, Microsoft) com fade nas bordas.
- **Fundo de quadrados rotacionados** (outline cinza, ângulos aleatórios) formando uma "nuvem" atrás do mock.
- **Mock de produto** em 3 colunas:
  - Esq: *Connected Tools* (Figma/Github/Slack + badge CONNECTED + botão "View all integrations").
  - Centro: caixa de prompt (borda dupla/glow) com `+`, `Web search ▾`, `Auto ▾`, botão enviar azul; abaixo *Agent Execution* = terminal com timestamps e tags coloridas.
  - Dir: *Agent Config* (Design Agent, Model/Tools/Temperature, Related Agents com ícones coloridos).

### 3.3 Problema (escuro)
Eyebrow + H2 "AI is powerful. / Managing it shouldn't be" alinhado à esquerda + parágrafo. 3 cards (`#191C1D`) altos com ícone em crop marks no topo, título pixel e texto no rodapé, canto pixel-notch.

### 3.4 Specialized Intelligence (branco)
Eyebrow + H2 centralizado. **Diagrama hub-and-spoke**: logo central em card com crop marks, círculos concêntricos + grid de fundo, 6 cards de agente (3 por lado) ligados por linhas tracejadas em cotovelo; cards ACTIVE têm borda azul e ícone azul sólido, DISABLED ficam esmaecidos.

### 3.5 From Intent to Execution (azul `#054AB2`)
H2 branco à esquerda. **Tabs** horizontais mono `01 ■ DEFINE · 02 ■ PLAN · 03 ■ ORCHESTRATE · 04 ■ EXECUTE · 05 ■ REVIEW & DELIVER` (aba ativa = fundo azul mais claro + borda). Painel abaixo: esquerda título + texto + botão `→ Get Started`; direita prompt + timeline vertical de steps (Research ✓, Plan, Design, Develop com spinner e badge AGENT) sobre dot-grid.

### 3.6 Analytics (branco)
H2 centralizado. Bento: card grande azul com **gráfico de barras em degrau** (barras translúcidas com linha amarela no topo, dot-grid) + 4 KPIs 2×2 (94.8%, 32h, 1,284, 18).

### 3.7 Integrations (branco)
H2 esquerda + botão `→ View All Integrations` à direita. Chips de integração (Linear, Notion, HubSpot, Teams, GitHub, Salesforce) espalhados em alturas diferentes, conectados por uma "onda" de barras verticais finas (estilo waveform) que entra no logo central e sai expandindo à direita.

### 3.8 CTA final (escuro, entre divisores em degrau cinza)
H2 esquerda "Stop managing tools. / Start orchestrating intelligence" + subtítulo; botões à direita embaixo (branco sólido + outline).

### 3.9 Footer (branco, tudo em azul)
Logo + tagline à esquerda, 4 colunas de links (labels mono caps azul claro, links sans azul), ícones sociais em quadrados azul-claro, faixa de dot-grid, linha final `© 2026 …` + Terms / Privacy.

---

## 4. Motion / UX (observado nos frames a cada 0,25s)

| Elemento | Animação |
|---|---|
| **Títulos (todos)** | Reveal **palavra por palavra**: cada palavra entra de opacidade ~0.2 → 1 em cascata (stagger ~80–120ms), com leve efeito "pixel decode". Disparado ao entrar na viewport. |
| **Parágrafos / botões** | Fade-in logo após o título (~200ms de atraso). |
| **Load do hero** | Tela escura → nav aparece → H1 escreve → mock aparece de baixo; **prompt digita letra a letra** (typewriter com cursor). |
| **Terminal de execução** | Linhas de log entram uma a uma (streaming), texto digitado. |
| **Painéis laterais do mock** | Fade + leve slide após o prompt; itens em stagger. |
| **Marquee de logos** | Scroll horizontal infinito contínuo. |
| **Cards do Problema** | Fade escalonado (esq→dir), conteúdo esmaecido → nítido. |
| **Diagrama de agentes** | Logo central aparece primeiro → linhas tracejadas "desenham" → cards fazem fade; **pulsos azuis** (traços curtos) percorrem as linhas; partículas quadradas flutuam lentamente nos círculos. |
| **Tabs (How it works)** | Painel troca com fade; timeline: steps aparecem em sequência, check/spinner. Provável auto-avanço entre tabs. |
| **Analytics** | Card azul sai de azul claro → saturado; **barras crescem** de baixo; **KPIs contam** (7% → 46.9% → 86.8% → 94.8%; 391 → 949 → 1,284; 7 → 15 → 18). |
| **Integrations** | Chips fazem fade em stagger e flutuam; waveform animada (barras oscilando). |
| **Footer** | Colunas de links aparecem em cascata de cima pra baixo (opacidade). |
| Scroll | Suave (estilo Lenis); sem parallax pesado. |

---

## 5. Mapeamento para portfólio (sugestão)
| Seção Arclo | Vira no portfólio |
|---|---|
| Hero + mock | Nome/título + "terminal" com sua apresentação digitando, stack conectada, card de "config" com seus dados |
| Problema (3 cards) | O que você resolve / serviços / valores |
| Hub-and-spoke | Você no centro + habilidades/stack ao redor |
| Tabs azul | Processo de trabalho ou experiências (timeline) |
| Analytics | Números (anos, projetos, clientes, commits) + gráfico |
| Integrations | Ferramentas/tecnologias |
| CTA + Footer | Contato + redes |
