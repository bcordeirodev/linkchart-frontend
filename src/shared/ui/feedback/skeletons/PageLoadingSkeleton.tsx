import { Box, Stack, Skeleton } from "@mui/material";

import { radiusTokens } from "@/lib/theme/designSystem";
import { ResponsiveContainer } from "@/shared/ui/base";

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

        {/* Cards de métricas ou conteúdo principal */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <Box
              key={i}
              sx={{
                p: 2,
                border: 1,
                borderColor: "divider",
                borderRadius: `${radiusTokens.md}px`,
              }}
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
