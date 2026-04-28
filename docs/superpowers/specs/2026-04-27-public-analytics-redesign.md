# Spec: Redesign da Página Pública de Analytics

**Data:** 2026-04-27
**Rota:** `/public-analytics/:slug`
**Componente principal:** `src/pages/public/PublicAnalyticsPage.tsx`

---

## Contexto

A página pública de analytics é exibida automaticamente após o usuário encurtar um link em `/shorter`. O objetivo do redesign é alinhar a identidade visual com o Dark Premium estabelecido em `/shorter` e simplificar o conteúdo — removendo gráficos e o UpgradeCTA completo, mantendo apenas o essencial: informações do link e métricas básicas, com um CTA discreto para criação de conta.

---

## Decisões de Design

| Dimensão | Decisão |
|---|---|
| Estética | **Dark Premium** — mesmos tokens de `/shorter`: fundo `#060610`, glows radiais, glassmorphism, paleta índigo `#6366f1`/`#8b5cf6` e esmeralda `#10b981` |
| Seções exibidas | Link card + 4 métricas + CTA strip |
| Removido | Gráficos (dispositivos e países), `UpgradeCTA` com lista de benefícios, badge pulsante |
| CTA | Faixa discreta e estática com texto direto e botão "Criar conta grátis" |
| Header | Idêntico ao `/shorter`: logo + botões Entrar/Criar conta grátis (já implementado em `PublicLayout`) |
| Animações | Fade-in sequencial mantido, sem pulsações ou animações chamativas |

---

## Arquitetura

Nenhuma nova rota, hook ou serviço. Todas as alterações são visuais nos componentes existentes. `PublicCharts` deixa de ser renderizado na página (o componente pode permanecer no código mas não é importado).

```
PublicAnalyticsPage
├── PublicLayout (variant='shorter', showHeader, showFooter) — sem alteração
├── [label estático "Analytics do link"]   ← inline na página
├── LinkInfoCard                            ← redesenhado
├── PublicMetrics                           ← redesenhado
├── PublicAnalyticsCtaStrip                ← novo componente (substitui AnalyticsInfo)
└── PublicCharts                            ← removido da renderização
```

---

## Componentes

### 1. `PublicAnalyticsPage` (modificado)

**Arquivo:** `src/pages/public/PublicAnalyticsPage.tsx`

Remove `PublicAnalyticsHeader`, `PublicCharts` e `AnalyticsInfo` da renderização. Adiciona um label `<Typography>` estático "Analytics do link" acima do `LinkInfoCard`. Estrutura resultante:

```
<PublicLayout variant='shorter' showHeader showFooter>
  <Box dark background + glows>      ← novo wrapper dark premium
    <Container maxWidth='md'>        ← centrado, espaço suficiente para o grid 4 colunas
      <Typography label>             ← "Analytics do link" (uppercase, muted)
      <LinkInfoCard />
      <PublicMetrics />
      <PublicAnalyticsCtaStrip />
    </Container>
  </Box>
</PublicLayout>
```

O `Container` usa `maxWidth='sm'` (600px) para manter o layout compacto e centrado — sem grid lateral.

### 2. `LinkInfoCard` (redesenhado)

**Arquivo:** `src/features/public-analytics/components/info/LinkInfoCard.tsx`

Estrutura do card:

```
Card (glassmorphism dark: rgba(255,255,255,0.04), border rgba(255,255,255,0.09), borderRadius 16px)
├── URL box (background rgba(#6366f1,0.08), border rgba(#6366f1,0.2))
│   ├── short_url em monospace, fontWeight 800, color #a5b4fc
│   └── Botão "Copiar" (ghost indigo)
├── original_url em monospace, color rgba(255,255,255,0.3), truncada
└── Ações (2 botões em linha)
    ├── "Encurtar outro link" → navigate('/shorter')
    └── "Visitar destino" → window.open(original_url)
```

Remove: título do link, domain field, data de criação inline, status chip, grid de 4 campos, botões grandes com ícones. O card foca exclusivamente na URL e nas ações principais.

### 3. `PublicMetrics` (redesenhado)

**Arquivo:** `src/features/public-analytics/components/metrics/PublicMetrics.tsx`

Grid `2fr 1fr 1fr 1fr` com 4 cards:

| Card | Valor | Destaque visual |
|---|---|---|
| Total de cliques | `total_clicks` formatado (`toLocaleString('pt-BR')`) | `font-size: 40px`, `color: #818cf8` |
| Status | Chip "Ativo" (verde esmeralda) ou "Inativo" (vermelho) | chip sem border-radius circular |
| Criado em | Data `dd/MM/yyyy` + hora `às HH:mm` | texto médio, color `rgba(255,255,255,0.7)` |
| Analytics | Chip "Disponível" (indigo) ou "Sem dados" (muted) | baseado em `has_analytics` |

Todos os cards: `background: rgba(255,255,255,0.04)`, `border: 1px solid rgba(255,255,255,0.07)`, `borderRadius: 12px`.

Card de cliques tem `border-color: rgba(99,102,241,0.15)` para leve destaque.

### 4. `PublicAnalyticsCtaStrip` (novo)

**Arquivo:** `src/features/public-analytics/components/info/PublicAnalyticsCtaStrip.tsx`

Substitui `AnalyticsInfo`. Componente simples, sem props — navegação via `useNavigate`.

```
Box (background rgba(255,255,255,0.03), border rgba(255,255,255,0.07), borderRadius 12px, padding 18px 22px)
├── Typography (texto)
│   "Ver analytics completos."  ← fontWeight 600, color rgba(255,255,255,0.7)
│   "Crie uma conta grátis para acessar dispositivos, países, horários de pico e histórico de cliques."
│   color: rgba(255,255,255,0.4)
└── Button "Criar conta grátis" → navigate('/sign-up')
    (gradient #6366f1→#8b5cf6, fontWeight 700)
```

### 5. Background Dark Premium (em `PublicAnalyticsPage`)

Mesmo padrão de `/shorter` — dois `Box` com `position: fixed` e `pointerEvents: none`:

```tsx
// Glow índigo — top right
sx={{ position:'fixed', top:'-20%', right:'-10%', width:500, height:500,
      borderRadius:'50%', background:'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 65%)' }}

// Glow esmeralda — bottom left
sx={{ position:'fixed', bottom:'-20%', left:'-10%', width:400, height:400,
      borderRadius:'50%', background:'radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 65%)' }}
```

---

## O que NÃO muda

- Hook `usePublicAnalytics` — sem alteração (dados continuam sendo buscados)
- Tipos `PublicLinkData`, `PublicAnalyticsData` — sem alteração
- `PublicAnalyticsPage` skeleton de loading — sem alteração
- `ErrorState` — sem alteração
- `PublicCharts` — permanece no código mas não é importado na página
- Rota `/public-analytics/:slug` — sem alteração

---

## Arquivos a criar

| Arquivo | Ação |
|---|---|
| `src/features/public-analytics/components/info/PublicAnalyticsCtaStrip.tsx` | Criar |

## Arquivos a modificar

| Arquivo | Mudança |
|---|---|
| `src/pages/public/PublicAnalyticsPage.tsx` | Novo layout dark, remove charts/header/AnalyticsInfo, adiciona label e CtaStrip |
| `src/features/public-analytics/components/info/LinkInfoCard.tsx` | Redesenho completo — card glassmorphism dark |
| `src/features/public-analytics/components/metrics/PublicMetrics.tsx` | Redesenho — grid 2fr 1fr 1fr 1fr, dark premium |
| `src/features/public-analytics/components/index.ts` | Exportar `PublicAnalyticsCtaStrip` |
