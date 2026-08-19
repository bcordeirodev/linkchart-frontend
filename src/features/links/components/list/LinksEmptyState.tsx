"use client";
import { Link2, FilterX, SearchX } from "lucide-react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@/shared/hooks";

import { keyframes } from "@mui/material/styles";

import { darkNeutral, lightNeutral } from "@/lib/theme/colors";
import { linksRadius } from "./linksPanelStyles";
import { motionTokens, radiusTokens } from "@/lib/theme/designSystem";
import { getLinksBorderColor } from "./linksPanelStyles";

/** Fade + leve subida na troca lista→vazio (espelha a entrada dos cards). */
const emptyStateEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: none;
  }
`;

interface LinksEmptyStateProps {
  /** Há filtros ativos? Muda o copy + CTA. */
  hasActiveFilters: boolean;
  /** Limpa filtros (search + status). Obrigatório se hasActiveFilters. */
  onClearFilters?: () => void;
}

/**
 * Empty state da listagem de links.
 * Duas variantes:
 *  - sem links: convida a criar o primeiro
 *  - sem resultados: oferece limpar os filtros
 */
export function LinksEmptyState({
  hasActiveFilters,
  onClearFilters,
}: LinksEmptyStateProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslation("links");

  const Icon = hasActiveFilters ? SearchX : Link2;
  const title = hasActiveFilters ? t("table.noResults") : t("list.empty.title");
  const description = hasActiveFilters
    ? t("table.noFilterResultsDesc")
    : t("list.empty.description");

  return (
    <Box
      sx={{
        // Entrada suave: a troca lista→vazio ganha o mesmo fade dos cards,
        // para o sumiço da lista não parecer um corte seco.
        animation: `${emptyStateEnter} 240ms ${motionTokens.easing.default} backwards`,
        "@media (prefers-reduced-motion: reduce)": { animation: "none" },
        mt: 2,
        py: { xs: 6, sm: 8 },
        px: { xs: 3, sm: 5 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: theme.palette.background.paper,
        border: `1px dashed ${getLinksBorderColor(theme)}`,
        borderRadius: `${linksRadius.panel}px`,
        transition: `border-color ${motionTokens.duration.base} ${motionTokens.easing.default}`,
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: `${radiusTokens.full}px`,
          // `lightNeutral.bg` (canvas), não `surface`: o painel atrás é
          // `background.paper` = `lightNeutral.surface`, então `surface` aqui
          // deixava o círculo sem preenchimento visível no light — mesmo
          // defeito já documentado e corrigido em ApiKeyList.
          backgroundColor: isDark ? darkNeutral.elevated : lightNeutral.bg,
          border: `1px solid ${getLinksBorderColor(theme)}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          color: "text.secondary",
        }}
      >
        <Icon size={28} strokeWidth={1.5} />
      </Box>

      <Typography
        variant="h6"
        sx={{ fontWeight: 600, mb: 0.5, letterSpacing: "-0.01em" }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 420, mb: 3, lineHeight: 1.55 }}
      >
        {description}
      </Typography>

      {hasActiveFilters ? (
        <Button
          variant="outlined"
          startIcon={<FilterX size={18} strokeWidth={1.5} />}
          onClick={onClearFilters}
        >
          {t("filters.clearFilters")}
        </Button>
      ) : (
        <Button
          variant="contained"
          startIcon={<Link2 size={18} strokeWidth={1.5} />}
          onClick={() => navigate("/links/create")}
        >
          {t("list.empty.createButton")}
        </Button>
      )}
    </Box>
  );
}

export default LinksEmptyState;
