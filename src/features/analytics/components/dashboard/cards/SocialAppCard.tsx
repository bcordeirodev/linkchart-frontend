"use client";
/**
 * SocialAppCard — shows share of clicks from mobile in-app browsers.
 */
import { Alert, Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { radiusTokens } from "@/lib/theme/designSystem";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";

interface SocialIabStats {
  total: number;
  percentage: number;
  ios_pct: number;
  android_pct: number;
  /**
   * True when at least 20% of clicks in the filter window have a non-null
   * navigation_context value (Phase 1 field). When false the data predates
   * Phase 1 tracking and a disclaimer should be shown.
   */
  navigation_context_available: boolean;
}

interface Props {
  data?: SocialIabStats;
}

/**
 * Card showing share of clicks from mobile in-app browsers (Instagram, TikTok, WhatsApp…).
 *
 * When `navigation_context_available` is false, renders a MUI info Alert
 * explaining that IAB data is only available for recent clicks (Phase 1
 * tracking) instead of silently showing empty data.
 *
 * Renders nothing when `data` is undefined (hook has not resolved yet).
 *
 * Migrated off its own manual `Card` (with a hover `boxShadow`) onto the
 * shared {@link ChartCard} wrapper (refinamento visual 2026-08-08, §3.3) —
 * title/subtitle now come from `ChartCard`'s own slots, and the module has
 * one fewer ad hoc card shell to keep in sync with the "instrumento
 * técnico" hairline-only surface grammar.
 */
export function SocialAppCard({ data }: Props) {
  const { t } = useTranslation("analytics");

  if (!data) return null;

  // Phase 1 disclaimer: navigation_context field is not available for old clicks.
  // Show the card frame with an informational notice rather than hiding it entirely.
  if (!data.navigation_context_available) {
    return (
      <ChartCard
        title={t("dashboard.socialApp.title")}
        subtitle={t("dashboard.socialApp.description")}
      >
        <Alert severity="info">
          {t("dashboard.socialIab.phaseDisclaimer")}
        </Alert>
      </ChartCard>
    );
  }

  // No IAB traffic and data is available — nothing to display.
  if (data.total === 0) return null;

  const otherPct = Math.max(0, 100 - data.ios_pct - data.android_pct);

  return (
    <ChartCard
      title={t("dashboard.socialApp.title")}
      subtitle={t("dashboard.socialApp.description")}
    >
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
        {data.percentage.toFixed(0)}%
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 2, display: "block" }}
      >
        {t("dashboard.socialApp.subtitle")}
      </Typography>
      <Box
        sx={{
          display: "flex",
          borderRadius: `${radiusTokens.sm}px`,
          overflow: "hidden",
          height: 28,
          mb: 1,
        }}
      >
        {data.ios_pct > 0 && (
          <Box
            sx={{
              flex: data.ios_pct,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "primary.contrastText",
                fontWeight: 600,
                fontSize: 11,
              }}
            >
              iOS {data.ios_pct.toFixed(0)}%
            </Typography>
          </Box>
        )}
        {data.android_pct > 0 && (
          <Box
            sx={{
              flex: data.android_pct,
              bgcolor: "primary.dark",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "primary.contrastText",
                fontWeight: 600,
                fontSize: 11,
              }}
            >
              Android {data.android_pct.toFixed(0)}%
            </Typography>
          </Box>
        )}
        {otherPct > 0 && (
          <Box
            sx={{
              flex: otherPct,
              bgcolor: "action.disabledBackground",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 600, fontSize: 11 }}
            >
              {t("dashboard.socialApp.other")} {otherPct.toFixed(0)}%
            </Typography>
          </Box>
        )}
      </Box>
      <Typography variant="caption" color="text.secondary">
        {t("dashboard.socialApp.note")}
      </Typography>
    </ChartCard>
  );
}
