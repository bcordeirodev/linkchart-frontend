"use client";

import {
  Box,
  CircularProgress,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import {
  getLinkCardInnerBorderColor,
  getLinkCardShellSx,
  getLinksBorderColor,
  linkCardContentSx,
  linksRadius,
} from "./linksPanelStyles";

/**
 * Silhueta do link que está sendo criado — mesma anatomia do {@link LinkCardRich}:
 * thumb quadrada, título, URL, barra de ação e rodapé de métricas.
 *
 * É de propósito um esqueleto e não um spinner: o card real ocupa exatamente
 * esta pegada, então a chegada dele é uma dissolução no lugar, sem o salto de
 * layout que um spinner centralizado provocaria.
 */
function DemoLinkGhostCard() {
  const theme = useTheme();

  return (
    <Box aria-hidden sx={{ ...getLinkCardShellSx(theme), opacity: 0.85 }}>
      <Box sx={linkCardContentSx}>
        {/* Identidade: thumb + título + URL */}
        <Stack direction="row" alignItems="center" spacing={1.25}>
          <Skeleton
            variant="rounded"
            width={56}
            height={56}
            sx={{ flexShrink: 0, borderRadius: `${linksRadius.control}px` }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Skeleton variant="text" width="45%" height={20} />
            <Skeleton variant="text" width="70%" height={16} />
          </Box>
        </Stack>

        {/* Barra de ação: strip da URL curta + CTA */}
        <Box
          sx={{
            mt: 1.25,
            pt: 1.25,
            borderTop: `1px solid ${getLinkCardInnerBorderColor(theme)}`,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Skeleton variant="rounded" height={28} sx={{ flex: 1 }} />
          <Skeleton
            variant="rounded"
            width={104}
            height={28}
            sx={{ flexShrink: 0 }}
          />
        </Box>

        {/* Rodapé de métricas */}
        <Stack direction="row" spacing={1.5} sx={{ mt: 1.25 }}>
          <Skeleton variant="text" width={72} height={14} />
          <Skeleton variant="text" width={88} height={14} />
          <Skeleton variant="text" width={96} height={14} />
        </Stack>
      </Box>
    </Box>
  );
}

/**
 * Primeira execução da `/links`: o que o usuário recém-cadastrado vê enquanto o
 * `SeedDemoLinkJob` ainda está criando o link de exemplo dele.
 *
 * A espera é parte do onboarding, não uma interrupção dele. O tour guiado só
 * pode rodar quando existe um card na tela — os passos "veja o analytics" e
 * "ações do link" apontam para âncoras que vivem *dentro* de um card de link.
 * Por isso o tour fica armado esperando este estado terminar (ver
 * `useDemoLinkSeeding` e o gate em `LinkListPage`), e aqui a gente nomeia a
 * espera em vez de deixar um spinner sem explicação.
 */
export function LinksDemoSeedingState() {
  const theme = useTheme();
  const { t } = useTranslation("links");

  return (
    <Box sx={{ mt: 2 }}>
      <Stack
        direction="row"
        spacing={1.25}
        alignItems="flex-start"
        role="status"
        aria-live="polite"
        sx={{
          mb: 2,
          px: { xs: 1.5, sm: 2 },
          py: 1.5,
          borderRadius: `${linksRadius.control}px`,
          border: `1px dashed ${getLinksBorderColor(theme)}`,
        }}
      >
        <CircularProgress size={16} thickness={5} sx={{ mt: 0.25 }} />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
            {t("list.demo.seeding.title")}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", lineHeight: 1.5 }}
          >
            {t("list.demo.seeding.description")}
          </Typography>
        </Box>
      </Stack>

      <DemoLinkGhostCard />
    </Box>
  );
}

export default LinksDemoSeedingState;
