"use client";

import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Info } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import {
  elevationLightTokens,
  elevationTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";
import type { FetchDestBreakdown } from "@/types/analytics/audience";

interface FetchDestChartProps {
  /** Fetch-dest breakdown data from the audience API. */
  fetchDestBreakdown: FetchDestBreakdown;
}

/** Accent colours mapped to common Sec-Fetch-Dest values. */
const FETCH_DEST_COLORS: Record<string, string> = {
  document: "#3b82f6",
  empty: "#22c55e",
  image: "#f59e0b",
  script: "#ef4444",
  style: "#a855f7",
  font: "#06b6d4",
  fetch: "#64748b",
  xhr: "#f97316",
  worker: "#84cc16",
};

/**
 * Renders a bar-chart-style breakdown of the Sec-Fetch-Dest header values
 * collected for a link (Phase 1 tracking).
 *
 * Displays a phase disclaimer chip when Phase 1 data is not yet meaningfully
 * available for this link (fewer than 5% of clicks have `fetch_dest` set).
 * The chart is always shown alongside the disclaimer so the user understands
 * why data may be empty.
 */
export function FetchDestChart({ fetchDestBreakdown }: FetchDestChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";
  const elevation = isDark ? elevationTokens : elevationLightTokens;

  const { data, phase1_available } = fetchDestBreakdown;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 0.75, fontWeight: 600 }}>
        {t("audience.fetchDest.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {t("audience.fetchDest.description")}
      </Typography>

      {!phase1_available && (
        <Alert
          severity="info"
          icon={<Info {...ICON_MD} />}
          sx={{ mb: 2, borderRadius: `${radiusTokens.md}px` }}
        >
          <Chip
            label={t("audience.fetchDest.phaseDisclaimer")}
            size="small"
            color="info"
            variant="outlined"
          />
        </Alert>
      )}

      <Card
        sx={{
          borderRadius: `${radiusTokens.lg}px`,
          boxShadow: elevation.xs,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent>
          {data.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ py: 2, textAlign: "center" }}
            >
              {t("audience.noData")}
            </Typography>
          ) : (
            <Stack spacing={2}>
              {data.map((entry) => {
                const color =
                  FETCH_DEST_COLORS[entry.fetch_dest] ??
                  theme.palette.primary.main;
                return (
                  <Box key={entry.fetch_dest}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="body2">
                        {entry.fetch_dest}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {entry.clicks} ({entry.percentage.toFixed(1)}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={entry.percentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: color,
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default FetchDestChart;
