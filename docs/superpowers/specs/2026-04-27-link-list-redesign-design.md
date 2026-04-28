> **Status:** ✅ IMPLEMENTADO — 2026-04-27/28

# Redesign da listagem `/link` — Cards ricos estilo Dub.co

**Data:** 2026-04-27
**Stack afetada:** frontend (React/Vite) + backend (Laravel)
**Escopo:** redesign visual da listagem de links com novos dados/endpoints

## 1. Motivação

A tela inicial `/link` é o primeiro contato do usuário autenticado com o produto. Hoje ela usa um `DataTable` (Material React Table) tradicional que entrega densidade alta, mas baixa percepção de valor — um tabelão genérico, indistinto de qualquer CRUD.

O mercado de encurtadores modernos (Dub.co, Bitly, Short.io) abandonou tabelas e adotou listas de cards ricos, com sparkline de tráfego, preview do destino e indicadores de saúde. Esse design comunica "isto é uma plataforma de analytics", não "isto é um cadastro".

## 2. Objetivo

Substituir a tabela atual por uma listagem de **cards verticais ricos** alinhados com o padrão de mercado, expondo no próprio card os sinais que hoje exigem ir até `/link/analytic/{id}`: tendência de tráfego, último clique, saúde do destino e preview da página apontada.

## 3. Não-objetivos

- Não mexer nos `LinkMetrics` (4 metric cards do topo).
- Não criar uma visão alternativa em grid/tile (rejeitado durante brainstorm).
- Não remodelar a tela `/link/analytic/{id}` (segue como destino do "ver detalhes").
- Não implementar agregação por país/device no card (rejeitado durante brainstorm).
- Não introduzir novo design para mobile do zero — mantém `LinksMobileCards` com adições.

## 4. Decisões consolidadas (do brainstorm)

| Decisão | Valor |
|---|---|
| Escopo de mudança | C — visual + recursos novos com novos endpoints |
| Recursos novos no card | sparkline, tendência %, último clique, preview OG, health |
| Perímetro do redesign | B — listagem + filtros (mantém metric cards do topo) |
| Mobile | manter cards atuais com adições |
| DetailDrawer | remover (card já é informativo; detalhes em `/link/analytic/{id}`) |

## 5. Design — Card desktop

Layout vertical em coluna única, full-width do container. Cada card composto de 3 linhas separadas por divider sutil.

```
┌──────────────────────────────────────────────────────────────────┐
│ [favicon] [Título]              [URL-curta-pill 📋]  [●Ativo] [⋯]│
├──────────────────────────────────────────────────────────────────┤
│ 🔗 https://exemplo.com/pagina-original-truncada...   [thumb OG] │
├──────────────────────────────────────────────────────────────────┤
│ ▁▂▄▃▅▇█  │  342 cliques ↑34%  │  há 2h  │  ● Saudável          │
└──────────────────────────────────────────────────────────────────┘
```

**Linha 1 — Header:** favicon (24px), título (16px bold), URL curta como pill clicável com botão de copy inline, chip de status (Ativo/Inativo/Agendado/Expirado), menu kebab (editar, QR, deletar).

**Linha 2 — Origem + preview:** URL original truncada com ícone external-link (clicável); à direita, thumb OG (80×60, lazy-load, fallback se ausente).

**Linha 3 — Métricas:** sparkline 7 dias (120×32, sem eixos), clicks total + tendência % colorida, último clique relativo (`há 2h`, `há 3 dias`, ou `nunca`), badge de health.

**Estilo:** padding 24px, border-radius 12px, divider entre linhas, hover eleva 1 nível na escala `elevationTokens`. Reusa `EnhancedPaper` se aplicável.

## 6. Design — Filtros (perímetro B)

Mantém:
- Busca textual (atual).
- Filtro de status (atual, mas convertido em **chips toggle** Ativo / Inativo / Agendado / Expirado em vez de select).

Adiciona:
- Ordenação: dropdown com `Mais clicks`, `Criado mais recente` (por `created_at`), `Maior tendência %`, `Última atividade` (por `last_click_at`).

## 7. Design — Mobile

Mantém `LinksMobileCards` atual com adições:
- Sparkline mini (60×24) abaixo da URL curta.
- Linha "+34% • há 2h • ● OK" antes da linha de ações.
- Preview OG só renderiza se houver thumb e tela ≥ sm; em xs fica oculto.

## 8. Backend — endpoints novos

| Endpoint | Método | Resposta | Cache |
|---|---|---|---|
| `/api/links/batch-meta` | POST | `{[id]: {sparkline, trend, preview, health}}` | derivado dos abaixo |
| `/api/links/{id}/sparkline?days=7` | GET | `[{date: 'YYYY-MM-DD', clicks: number}]` | Redis 5min |
| `/api/links/{id}/trend?window=7` | GET | `{current, previous, percent_change, last_click_at}` | Redis 5min |
| `/api/links/{id}/preview` | GET | `{favicon_url, og_title, og_image_url}` | DB 24h |
| `/api/links/{id}/health` | GET | `{status: 'ok' \| 'error' \| 'unknown', last_checked_at, http_code}` | DB |

**Regra crítica:** o frontend chama **apenas** `batch-meta` ao carregar a lista, com a array de IDs visíveis. Os endpoints unitários existem para a tela de analytics e para refresh manual. Isso evita N+1.

## 9. Backend — services e jobs

- **`LinkPreviewService`** + **`FetchLinkPreviewJob`** — scraper Open Graph com timeout 5s, cache 24h, fallback gracioso (retorna `null` se falhar). Disparado on-demand quando `link_previews` está stale ou ausente.
- **`LinkHealthCheckJob`** — cron horário (`schedule->everyHour()`), atualiza `links.health_status` e `links.health_checked_at`. HEAD request com timeout 5s; status 2xx/3xx → `ok`, 4xx/5xx → `error`, timeout/DNS → `error`.
- **Reuso de `MetricsService`** (já existente) para agregações de sparkline e trend — evita duplicar lógica de agregação.
- Cada service novo tem **interface em `app/Contracts/Services/`** + DTO de retorno em `app/DTOs/` (mapa direto pro NestJS na migração).

## 10. Backend — schema

Adições mínimas:

```sql
ALTER TABLE links ADD COLUMN health_status VARCHAR(20) DEFAULT 'unknown';
ALTER TABLE links ADD COLUMN health_checked_at TIMESTAMP NULL;

CREATE TABLE link_previews (
  link_id BIGINT PRIMARY KEY REFERENCES links(id) ON DELETE CASCADE,
  favicon_url VARCHAR(500) NULL,
  og_title VARCHAR(500) NULL,
  og_image_url VARCHAR(500) NULL,
  fetched_at TIMESTAMP NOT NULL,
  INDEX idx_link_previews_fetched (fetched_at)
);
```

## 11. Frontend — componentes

**Novos:**
- `LinkCardRich` — card desktop completo (substitui o `DataTable`).
- `LinkSparkline` — wrapper sobre `ApexChartWrapper` em modo sparkline (sem eixos, cor pelo trend).
- `LinkPreviewThumb` — favicon + thumb OG com fallback.
- `LinkTrendBadge` — chip com seta + cor (verde positivo, vermelho negativo, cinza neutro).
- `LinkHealthBadge` — chip pequeno (verde `ok`, vermelho `error`, cinza `unknown`).
- `useLinksMeta(ids: string[])` — hook que bate em `batch-meta` e cacheia o resultado por ID.

**Removidos:**
- `useLinksTableColumns` (sem `DataTable`).
- `LinkDetailDrawer` (card é o detail).
- Import de `DataTable` em `LinkListPage`.

**Evoluídos:**
- `LinksFilters` — passa a usar chips toggle + dropdown de ordenação (ver seção 6).

**Mantidos intactos:**
- `LinksHeader`, `LinkMetrics`, `useLinks`, `linkStatus` utils, `LinkActionsInline`, `LinkActionsMenu`.

## 12. Estrutura final de `LinkListPage`

```tsx
<MainLayout>
  <ResponsiveContainer variant='page'>
    <LinksHeader />
    <LinkMetrics linksData={links} showTitle={false} />
    <LinksFilters
      searchTerm={...}
      statusFilter={...}        // chips toggle
      sortBy={...}                // novo: dropdown ordenação
    />
    {filtered.length === 0
      ? <LinksEmptyState />
      : isMobile
        ? <LinksMobileCards data={filtered} meta={meta} />
        : <Stack spacing={2}>
            {filtered.map(link => (
              <LinkCardRich key={link.id} link={link} meta={meta[link.id]} />
            ))}
          </Stack>}
  </ResponsiveContainer>
</MainLayout>
```

A página continua respeitando o limite de < 100 linhas (regra do `.cursorrules`).

## 13. Riscos e mitigações

| Risco | Mitigação |
|---|---|
| Backend Laravel será migrado pra NestJS+Prisma | Tudo novo em contract + DTO + service + job (mapa 1:1). Migração documentada no CLAUDE.md. |
| Cron de health-check exige worker rodando | Se worker não rodar, `health_status` fica `unknown`. Frontend trata `unknown` com badge cinza neutro (degradação graciosa). |
| Scraper OG bate em sites externos (lentidão, bloqueios) | Timeout 5s, cache 24h, fallback `null`. Frontend não bloqueia render se preview ausente. |
| Endpoint `batch-meta` pode crescer e ficar pesado | Limitar IDs por request (ex: max 50). Front pagina/virtualiza se lista crescer. |
| Sparkline em todas as linhas pode pesar render | `ApexChartWrapper` já é o componente reutilizado; testar com 50+ cards e virtualizar se necessário. |

## 14. Critérios de aceitação

- [ ] Tela `/link` desktop não usa mais `DataTable`.
- [ ] Cada link aparece como `LinkCardRich` mostrando: favicon, título, URL curta com copy, status, sparkline 7 dias, clicks, tendência %, último clique, health badge, preview OG.
- [ ] Carregamento da lista faz uma única chamada `POST /api/links/batch-meta` para os meta-dados.
- [ ] Filtros agora têm chips toggle de status + dropdown de ordenação.
- [ ] Mobile preserva `LinksMobileCards` com sparkline mini + linha de tendência.
- [ ] `LinkDetailDrawer` removido — clicar em "ver analytics" no menu leva pra `/link/analytic/{id}`.
- [ ] `LinkMetrics` (4 cards do topo) e `LinksHeader` permanecem inalterados.
- [ ] Backend roda `npm run quality` (frontend) e `./vendor/bin/phpunit` (backend) sem regressão.
- [ ] Página principal continua < 100 linhas; cada componente novo < 200 linhas.

## 15. Plano de fases (alto nível)

1. **Backend — schema + endpoints unitários** (sparkline, trend, preview, health) com testes.
2. **Backend — `batch-meta` + jobs** (preview scraper, health cron).
3. **Frontend — componentes atômicos** (`LinkSparkline`, `LinkPreviewThumb`, `LinkTrendBadge`, `LinkHealthBadge`, hook `useLinksMeta`).
4. **Frontend — `LinkCardRich`** + integração na `LinkListPage`, remoção do `DataTable` e `LinkDetailDrawer`.
5. **Frontend — filtros evoluídos** (chips toggle + dropdown ordenação).
6. **Frontend — adições no mobile** (`LinksMobileCards`).
7. **Validação manual no browser** + `npm run quality`.

Detalhamento por fase fica para o plano de implementação (próximo skill).
