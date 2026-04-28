# Spec: Redesign da Página Pública de Encurtamento

**Data:** 2026-04-27  
**Rota:** `/shorter`  
**Componente principal:** `src/pages/public/ShorterPage.tsx`

---

## Contexto

A página pública atual (`/shorter`) é funcional mas minimalista: um campo de URL, botão "Encurtar Agora", sidebar de upgrade e stats estáticos. O objetivo é elevar a percepção de qualidade do produto e melhorar a taxa de conversão de visitantes públicos em usuários cadastrados.

---

## Decisões de Design

| Dimensão | Decisão |
|---|---|
| Estética | **Dark Premium** — fundo `#060610`, acentos índigo/esmeralda, glassmorphism, brilhos radiais |
| Campos do formulário | URL (obrigatório) + Título (opcional) + Slug personalizado (opcional) |
| Pós-encurtamento | **Redirect + Preview melhorado** — tela de sucesso animada com link copiável, barra de progresso e redirect automático para analytics |

---

## Arquitetura

Nenhuma nova rota ou serviço. Todas as alterações ficam nos componentes existentes e em novos subcomponentes criados dentro de `features/shorter/components/` e `features/links/components/`.

```
ShorterPage
├── PublicLayout (variant='shorter') — sem alteração
├── ShorterHero          ← novo componente
├── URLShortenerForm     ← refatorado (novos campos)
│   ├── URLInput         ← sem alteração
│   ├── TitleInput       ← novo (opcional)
│   └── SlugInput        ← novo (opcional, prefixo lnk.ch/)
├── ShorterSuccessState  ← substitui RedirectingState
│   ├── link copiável
│   ├── barra de progresso animada
│   └── countdown para redirect
└── ShorterStats         ← sem alteração de lógica, estilo atualizado
```

---

## Componentes

### 1. `ShorterHero`
**Arquivo:** `src/features/shorter/components/ShorterHero.tsx`

Novo componente que substitui o bloco de título inline no `ShorterPage`. Exibe:
- Badge animado: ponto pulsante + "100% gratuito · sem cadastro"
- Headline `h1` em dois estados:
  - **Normal:** "Encurte. Analise. *Cresça.*" (gradient no último)
  - **Sucesso:** "Pronto para *compartilhar!*"
- Subtítulo descritivo adequado ao estado

Recebe prop `state: 'idle' | 'success'` para alternar o copy.

### 2. `URLShortenerForm` (refatorado)
**Arquivo:** `src/features/links/components/URLShortenerForm.tsx`

Mantém a lógica atual (`usePublicURLShortener`) e adiciona:
- Campo `title` (string, opcional) — `TextInput` com ícone lápis
- Campo `custom_slug` (string, opcional) — `TextInput` com prefixo `lnk.ch/` e validação de slug (`/^[a-z0-9-]+$/`)

Layout do card (glassmorphism dark):
```
[ 🌐  Cole a URL aqui...                          ]
[ ✏️  Título opcional    ]  [ lnk.ch/ slug-aqui   ]
[ ⚡ Encurtar Agora                                ]
```

A API pública já aceita `title` e `custom_slug` via `POST /api/public/shorten` — sem mudança no backend.

Validação do slug no frontend: apenas letras minúsculas, números e hífens, 3–50 chars. Erro inline abaixo do campo.

### 3. `ShorterSuccessState`
**Arquivo:** `src/features/shorter/components/ShorterSuccessState.tsx`

Substitui `RedirectingState`. Exibe:
- Ícone de check animado (fade + scale)
- Título "Link encurtado!" + subtítulo "Copie e compartilhe onde quiser"
- Box com a short URL em fonte monospace + botão "Copiar" (usa `useClipboard`)
- Barra de progresso CSS animada (3 segundos, `linear`)
- Texto "Redirecionando para analytics em 3s..."
- Badge "Encurtar outro link" (reseta o form)

Após 3 segundos, chama `navigate('/public-analytics/:slug')` — mesmo comportamento atual, só com mais feedback visual.

### 4. Visual — Tema Dark Premium

Aplicado via `sx` props do MUI, sem novo arquivo de tema:

| Token | Valor |
|---|---|
| Background page | `#060610` |
| Card background | `rgba(255,255,255,0.04)` |
| Card border | `rgba(255,255,255,0.09)` |
| Card border-radius | `18px` |
| Glow 1 (índigo) | `radial-gradient` fixed top-right, `rgba(99,102,241,0.18)` |
| Glow 2 (esmeralda) | `radial-gradient` fixed bottom-left, `rgba(16,185,129,0.12)` |
| Acento primário | `#6366f1` → `#8b5cf6` (gradient) |
| Acento sucesso | `#10b981` |
| Botão submit | `linear-gradient(90deg, #6366f1, #8b5cf6)` + shimmer animation |

Os brilhos radiais (`position: fixed`) ficam em `ShorterPage` como `Box` absolutas com `pointerEvents: none` e `zIndex: 0`.

### 5. Header (`PublicLayout`)
Adicionar dois botões no header existente:
- "Entrar" → `navigate('/sign-in')` (ghost button)
- "Criar conta grátis" → `navigate('/sign-up')` (botão primário pequeno)

O `PublicLayout` variant `shorter` já renderiza um header simples. Os botões serão adicionados diretamente dentro do bloco condicional `variant === 'shorter'` em `PublicLayout.tsx`, sem alterar os outros variants.

### 6. Benefits badges
Quatro chips abaixo do form card:
- ✓ Analytics em tempo real
- ✓ QR Code grátis
- ✓ Sem expiração
- ✓ Slug personalizado

No estado de sucesso, os chips mudam para:
- ✓ Link ativo e funcionando
- ✓ Analytics já coletando dados
- 🔗 Encurtar outro link (clicável, reseta o form)

---

## Fluxo de Estado

```
idle
  → usuário preenche URL (+ título/slug opcionais)
  → clica "Encurtar Agora"
  → loading (botão disabled, spinner)
  → success
      → ShorterHero muda para estado 'success'
      → ShorterSuccessState aparece (substitui o form card)
      → barra de progresso anima por 3s
      → navigate('/public-analytics/:slug')
  → error
      → Alert MUI com mensagem de erro
      → formulário permanece editável
```

---

## O que NÃO muda

- Hook `useShorter` — apenas adicionar handler para reset de form
- Hook `usePublicURLShortener` — adicionar `title` e `custom_slug` ao payload
- Serviço `publicLinkService.createPublicLink()` — já aceita os campos
- `ShorterStats` — lógica intacta, só ajuste visual de cores
- Sidebar `UpgradeCTA` — **removida** (substituída pelos benefit badges e pelos botões no header)
- Rota `/shorter` — sem alteração

---

## Arquivos a criar

| Arquivo | Ação |
|---|---|
| `src/features/shorter/components/ShorterHero.tsx` | Criar |
| `src/features/shorter/components/ShorterSuccessState.tsx` | Criar |

## Arquivos a modificar

| Arquivo | Mudança |
|---|---|
| `src/pages/public/ShorterPage.tsx` | Novo layout dark premium, glows, usa novos componentes |
| `src/features/links/components/URLShortenerForm.tsx` | Adiciona campos title e custom_slug |
| `src/features/links/hooks/usePublicURLShortener.ts` | Inclui title e custom_slug no payload |
| `src/shared/layout/PublicLayout.tsx` | Adiciona botões Entrar/Criar conta no header do variant 'shorter' |
