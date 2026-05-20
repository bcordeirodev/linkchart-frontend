"use client";

import { Box, Chip, Stack, Switch, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import type {
  Period,
  AnalyticsFilters,
} from "@/features/links/hooks/useAnalyticsFilters";

/** Props for the global analytics filter bar. */
interface AnalyticsFilterBarProps {
  period: AnalyticsFilters["period"];
  excludeBots: boolean;
  onPeriodChange: (v: Period) => void;
  onExcludeBotsChange: (v: boolean) => void;
}

const PERIODS: Period[] = ["1h", "24h", "7d", "30d", "90d", "all"];

/**
 * Global analytics filter bar rendered above all tabs in LinkAnalyticsTabs.
 *
 * Displays period preset chips and a bot-exclusion toggle. State changes are
 * surfaced via callback props — the bar is fully controlled.
 */
export function AnalyticsFilterBar({
  period,
  excludeBots,
  onPeriodChange,
  onExcludeBotsChange,
}: AnalyticsFilterBarProps) {
  const { t } = useTranslation("analytics");
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 1,
        px: 2,
        py: 1.5,
        mb: 2,
        bgcolor: "background.paper",
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          mr: 0.5,
        }}
      >
        {t("filters.period")}
      </Typography>

      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
        {PERIODS.map((p) => (
          <Chip
            key={p}
            label={t(`filters.periods.${p}`)}
            size="small"
            variant={period === p ? "filled" : "outlined"}
            color={period === p ? "primary" : "default"}
            onClick={() => onPeriodChange(p)}
            sx={{ cursor: "pointer" }}
          />
        ))}
      </Stack>

      <Box
        sx={{
          width: 1,
          height: 20,
          bgcolor: "divider",
          mx: 0.5,
          display: { xs: "none", sm: "block" },
        }}
      />

      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Switch
          size="small"
          checked={excludeBots}
          onChange={(e) => onExcludeBotsChange(e.target.checked)}
          inputProps={{ "aria-label": t("filters.excludeBots") }}
        />
        <Typography variant="caption" color="text.secondary">
          {t("filters.excludeBots")}
        </Typography>
      </Stack>
    </Box>
  );
}

export default AnalyticsFilterBar;
