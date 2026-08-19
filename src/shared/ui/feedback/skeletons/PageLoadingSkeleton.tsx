"use client";

// "use client" é obrigatório aqui: este arquivo é importado por `loading.tsx`
// (Server Component) e usa `sx` em forma de função — sem a diretiva, o módulo
// vira Server Component e a função não serializa na fronteira RSC→client
// ("Functions cannot be passed directly to Client Components").
import { Box, Stack, Skeleton } from "@mui/material";

import { radiusTokens } from "@/lib/theme/designSystem";
import { ResponsiveContainer } from "@/shared/ui/base";
import { getCardSurfaceSx } from "@/shared/ui/base/cardSurface";

/**
 * Skeleton para carregamento de páginas via Suspense (`loading.tsx` de rotas
 * do grupo `(app)`) — simula a estrutura básica de uma página da aplicação.
 *
 * Renderiza **só o conteúdo**, sem `MainLayout`: todo `loading.tsx` sob
 * `app/(app)/**` já é montado dentro do `<MainLayout>` persistente de
 * `app/(app)/layout.tsx` (sidebar + navbar + footer). Envolver em outro
 * `MainLayout` aqui duplicava essa casca inteira — sidebar, navbar e footer
 * todos renderizando duas vezes, aninhados — durante a janela de loading de
 * qualquer navegação para uma rota que use este skeleton (ex.: `/links/analytics/[id]`).
 *
 * Usa `ResponsiveContainer variant="page"` (mesmo componente que as páginas
 * reais usam) em vez de um `Container` cru para não introduzir um salto de
 * largura/padding quando o skeleton é substituído pelo conteúdo real.
 */
export function PageLoadingSkeleton() {
  return (
    <ResponsiveContainer variant="page">
      <Stack spacing={3}>
        {/* Header da página */}
        <Box>
          <Skeleton variant="text" width={240} height={48} sx={{ mb: 1 }} />
          <Skeleton variant="text" width={380} height={28} />
        </Box>

        {/* Fileira de métricas — alinhada ao `OverviewMetricRow` (4 métricas,
            solto na página) desde o redesenho de tiles (2026-08-17): grid de
            2 colunas no `xs`, 4 tiles de largura igual a partir de `sm`,
            `gap: 1.5`, e a superfície de card in-page dentro da hairline.
            Este skeleton já desenhava caixas com borda quando a fileira real
            eram números soltos; agora as duas formas coincidem de fato. */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(4, minmax(0, 1fr))",
            },
            gap: 1.5,
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <Box
              key={i}
              // `sx` como função (e não `useTheme()`): este arquivo é
              // importado por um `loading.tsx` — um Server Component — então
              // não pode chamar hooks. O `Box` do MUI é client e resolve a
              // função no próprio render.
              sx={(theme) => ({
                p: 2,
                ...getCardSurfaceSx(theme),
                border: 1,
                borderColor: "divider",
                borderRadius: `${radiusTokens.md}px`,
              })}
            >
              <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" height={40} />
            </Box>
          ))}
        </Box>

        {/* Conteúdo principal */}
        <Box
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: `${radiusTokens.md}px`,
            p: 3,
          }}
        >
          <Stack spacing={2}>
            <Skeleton variant="text" width={200} height={32} />
            <Skeleton variant="rounded" height={300} />
          </Stack>
        </Box>
      </Stack>
    </ResponsiveContainer>
  );
}

export default PageLoadingSkeleton;
