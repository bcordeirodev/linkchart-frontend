"use client";

import {
  Box,
  Chip,
  Divider,
  Stack,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import type {
  AnalyticsFilters,
  Period,
} from "@/features/links/hooks/useAnalyticsFilters";

/** Props for the global analytics filter bar. */
interface AnalyticsFilterBarProps {
  period: AnalyticsFilters["period"];
  /** ISO date string (yyyy-MM-dd) for the start of the active range, or null for "all time". */
  dateFrom: string | null;
  /** ISO date string (yyyy-MM-dd) for the end of the active range, or null for "all time". */
  dateTo: string | null;
  excludeBots: boolean;
  onPeriodChange: (v: Period) => void;
  onDateRangeChange: (from: string, to: string) => void;
  onExcludeBotsChange: (v: boolean) => void;
}

/** Period presets shown as shortcut chips. */
const PRESET_PERIODS: Period[] = ["1h", "24h", "7d", "30d", "90d", "all"];

/** Convert an ISO date string or null to a Date object (for the DatePicker). */
function toDate(iso: string | null): Date | null {
  if (!iso) return null;
  try {
    return parseISO(iso);
  } catch {
    return null;
  }
}

/**
 * Global analytics filter bar rendered above all tabs in LinkAnalyticsTabs.
 *
 * Displays:
 * - Two DatePicker inputs (from / to) — always visible for custom ranges
 * - Period preset shortcut chips (1h / 24h / 7d / 30d / 90d / Todo período)
 * - Bot-exclusion toggle
 *
 * Clicking a preset fills the date pickers with the resolved range and sets the
 * period. Editing the date pickers directly switches to period="custom" and calls
 * onDateRangeChange with the new ISO strings.
 */
export function AnalyticsFilterBar({
  period,
  dateFrom,
  dateTo,
  excludeBots,
  onPeriodChange,
  onDateRangeChange,
  onExcludeBotsChange,
}: AnalyticsFilterBarProps) {
  const { t } = useTranslation("analytics");
  const theme = useTheme();

  /** Called when the "from" picker changes. Keeps existing dateTo if set. */
  const handleFromChange = (date: Date | null) => {
    if (!date) return;
    const from = format(date, "yyyy-MM-dd");
    const to = dateTo ?? format(new Date(), "yyyy-MM-dd");
    onDateRangeChange(from, to);
  };

  /** Called when the "to" picker changes. Keeps existing dateFrom if set. */
  const handleToChange = (date: Date | null) => {
    if (!date) return;
    const from = dateFrom ?? format(new Date(), "yyyy-MM-dd");
    const to = format(date, "yyyy-MM-dd");
    onDateRangeChange(from, to);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 1.5,
        px: 2,
        py: 1.5,
        mb: 2,
        bgcolor: "background.paper",
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Date range pickers */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        flexWrap="wrap"
        useFlexGap
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {t("filters.dateFrom")}
        </Typography>
        <DatePicker
          value={toDate(dateFrom)}
          onChange={handleFromChange}
          maxDate={toDate(dateTo) ?? new Date()}
          slots={{ textField: TextField }}
          slotProps={{
            textField: {
              size: "small",
              sx: { width: 148 },
              inputProps: { "aria-label": t("filters.dateFrom") },
            },
          }}
        />
        <Typography variant="caption" color="text.disabled">
          →
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {t("filters.dateTo")}
        </Typography>
        <DatePicker
          value={toDate(dateTo)}
          onChange={handleToChange}
          minDate={toDate(dateFrom) ?? undefined}
          maxDate={new Date()}
          slots={{ textField: TextField }}
          slotProps={{
            textField: {
              size: "small",
              sx: { width: 148 },
              inputProps: { "aria-label": t("filters.dateTo") },
            },
          }}
        />
      </Stack>

      <Divider
        orientation="vertical"
        flexItem
        sx={{ display: { xs: "none", sm: "block" } }}
      />

      {/* Shortcut chips */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        flexWrap="wrap"
        useFlexGap
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {t("filters.period")}
        </Typography>
        {PRESET_PERIODS.map((p) => (
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

      <Divider
        orientation="vertical"
        flexItem
        sx={{ display: { xs: "none", sm: "block" } }}
      />

      {/* Bot exclusion toggle */}
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Switch
          size="small"
          checked={excludeBots}
          onChange={(e) => onExcludeBotsChange(e.target.checked)}
          color="success"
          inputProps={{ "aria-label": t("filters.excludeBots") }}
        />
        <Typography
          variant="caption"
          color={excludeBots ? "success.main" : "text.secondary"}
          sx={{ fontWeight: excludeBots ? 600 : 400 }}
        >
          {t("filters.excludeBots")}
        </Typography>
      </Stack>
    </Box>
  );
}

export default AnalyticsFilterBar;
