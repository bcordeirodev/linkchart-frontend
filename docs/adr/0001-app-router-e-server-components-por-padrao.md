# 0001 — App Router e Server Components por padrão

- Status: Accepted
- Data: 2026-05-10
- Autores: equipe Link Charts

## Contexto

Next.js 13+ introduziu o App Router (estável a partir do 13.4) e Server Components como padrão arquitetural para novas aplicações. O Pages Router continua suportado mas é tratado como legado pelo time do Next. Quando este frontend foi reescrito (saímos de uma versão Vite + React Router), precisávamos escolher entre manter Pages Router (familiar para o time) ou adotar App Router.

## Decisão

Adotamos **App Router**. Server Components são o **default**; `"use client"` só nas folhas que precisam de interatividade do cliente (formulários, charts, hooks com efeito, contextos React Provider). Layouts aninhados em `app/(app)/`, `app/(auth)/`, `app/(public)/` espelham os três modos de uso da aplicação. Streaming + RSC reduzem o bundle JavaScript no cliente. `generateMetadata` server-side é o que viabiliza Open Graph dinâmico no fluxo de redirect.

## Alternativas consideradas

- **Pages Router** — Familiar, mas tratado como legado pelo Next; não suporta `generateMetadata` nem RSC.
- **App Router 100% client** — Renunciaria os benefícios de SSR (SEO, OG dinâmico), tornando o redirect via domínio do front impossível de servir corretamente para bots.

## Consequências

### Positivas

- Streaming + RSC reduzem JS shipped ao browser.
- `generateMetadata` permite OG tags dinâmicas para `/r/[slug]` e `/public-analytics/[slug]`.
- Layouts aninhados encaixam naturalmente os grupos de rota.
- Roteamento file-system, sem necessidade de `react-router`.

### Negativas

- Curva de aprendizado para devs vindos de Pages Router (props/hooks server vs. client).
- Bibliotecas client-only (MUI, Redux, framer-motion) precisam de wrappers `"use client"`.
- `cookies()`/`headers()` API é nova; debugar sessão server-side requer atenção extra.
- Hot reload em alguns cenários (mudanças em layout) é mais lento que no Pages Router.
