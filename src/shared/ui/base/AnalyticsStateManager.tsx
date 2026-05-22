"use client";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { createPresetAnimations } from "@/lib/theme";

import type { ReactNode } from "react";

interface AnalyticsStateManagerProps {
  /** True while the underlying query is loading — shows the spinner block. */
  loading: boolean;
  /** Non-null error message — shows the error block (overrides empty + success). */
  error: string | null;
  /** Whether the loaded payload has renderable data — false shows the empty block. */
  hasData: boolean;
  /** Renderable content for the success state. */
  children: ReactNode;
  /** Optional retry handler; when provided in the error state, renders a "Tentar Novamente" button. */
  onRetry?: () => void;
  /** Override for the loading-state message (default: `t("common:loading.data")`). */
  loadingMessage?: string;
  /** Override for the error description (default: the raw `error` string). */
  errorMessage?: string;
  /** Override for the empty-state message (default: `t("common:status.noData")`). */
  emptyMessage?: string;
  /** Min height of the state container in px (default `300`; halved when `compact`). */
  minHeight?: number;
  /** Compact density — shrinks padding, font sizes and `minHeight`. */
  compact?: boolean;
  /** Node rendered while loading=true. Falls back to the spinner when omitted (backward-compatible). */
  skeleton?: ReactNode;
}

/**
 * Renders one of four mutually exclusive blocks (loading / error / empty / children) for analytics widgets.
 *
 * Priority order: `loading` → `error` → `!hasData` → `children`. Uses `createPresetAnimations(theme).fadeIn` for transitions and the `common` i18n namespace for default messages.
 */
export function AnalyticsStateManager({
  loading,
  error,
  hasData,
  children,
  onRetry,
  loadingMessage,
  errorMessage,
  emptyMessage,
  minHeight = 300,
  compact = false,
  skeleton,
}: AnalyticsStateManagerProps) {
  const theme = useTheme();
  const { t } = useTranslation("common");
  const animations = createPresetAnimations(theme);

  const resolvedLoadingMessage = loadingMessage ?? t("loading.data");
  const resolvedEmptyMessage = emptyMessage ?? t("status.noData");

  // Estado de Loading
  if (loading) {
    if (skeleton) {
      return <>{skeleton}</>;
    }
    return (
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: compact ? minHeight / 2 : minHeight,
          textAlign: "center",
          gap: 2,
          p: compact ? 2 : 3,
          ...animations.fadeIn,
        }}
      >
        <CircularProgress size={compact ? 24 : 32} />
        <Typography
          variant={compact ? "body2" : "h6"}
          sx={{
            color: "text.primary",
            fontWeight: 500,
          }}
        >
          {resolvedLoadingMessage}
        </Typography>
      </Box>
    );
  }

  // Estado de Error
  if (error) {
    return (
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: compact ? minHeight / 2 : minHeight,
          textAlign: "center",
          gap: 2,
          p: compact ? 2 : 3,
          borderColor: "error.main",
          ...animations.fadeIn,
        }}
      >
        <Typography
          variant={compact ? "body2" : "h6"}
          sx={{
            color: "error.main",
            fontWeight: 600,
          }}
        >
          {t("status.error")}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: onRetry ? 1 : 0,
            maxWidth: 400,
          }}
        >
          {errorMessage || error}
        </Typography>
        {onRetry ? (
          <Button
            variant="outlined"
            size={compact ? "small" : "medium"}
            onClick={onRetry}
            sx={{
              ...animations.buttonHover,
              borderColor: "error.main",
              color: "error.main",
              "&:hover": {
                borderColor: "error.dark",
                backgroundColor: "error.light",
              },
            }}
          >
            Tentar Novamente
          </Button>
        ) : null}
      </Box>
    );
  }

  // Estado Empty (sem dados)
  if (!hasData) {
    return (
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: compact ? minHeight / 2 : minHeight,
          textAlign: "center",
          gap: 2,
          p: compact ? 2 : 3,
          ...animations.fadeIn,
        }}
      >
        <Typography
          variant={compact ? "body2" : "h6"}
          sx={{
            color: "text.secondary",
            fontWeight: 500,
          }}
        >
          {resolvedEmptyMessage}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 400 }}
        >
          Compartilhe seus links para ver dados aqui!
        </Typography>
      </Box>
    );
  }

  // Estado Success - renderizar children com animação de entrada
  return (
    <Box
      sx={{
        "@keyframes analyticsContentIn": {
          from: { opacity: 0, transform: "translateY(6px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        animation: "analyticsContentIn 200ms ease-out",
      }}
    >
      {children}
    </Box>
  );
}

export default AnalyticsStateManager;
