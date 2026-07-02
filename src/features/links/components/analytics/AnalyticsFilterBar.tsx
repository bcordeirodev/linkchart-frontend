"use client";

import {
  alpha,
  Box,
  Chip,
  Divider,
  Stack,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import { radiusTokens } from "@/lib/theme/designSystem";
import { getSoftSelectedChipSx } from "@/lib/theme/softChip";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { format, parse, parseISO } from "date-fns";
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

/**
 * Converts a stored datetime string or ISO date string to a Date object.
 * Handles both "yyyy-MM-dd HH:mm:ss" (new format) and "yyyy-MM-dd" (legacy).
 */
function toDate(iso: string | null): Date | null {
  if (!iso) return null;
  try {
    if (iso.includes(" ")) {
      return parse(iso, "yyyy-MM-dd HH:mm:ss", new Date());
    }
    return parseISO(iso);
  } catch {
    return null;
  }
}

/**
 * Global analytics filter bar rendered above all tabs in LinkAnalyticsTabs.
 *
 * Displays:
 * - Two DateTimePicker inputs (from / to) for custom datetime ranges
 * - Period preset shortcut chips (1h / 24h / 7d / 30d / 90d / Todo período)
 * - Bot-exclusion toggle
 *
 * Clicking a preset sets the period and resolves the datetime range.
 * Editing the pickers directly switches to period="custom" and stores
 * datetime strings in "yyyy-MM-dd HH:mm:ss" format.
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

  const fmtDt = (d: Date) => format(d, "yyyy-MM-dd HH:mm:ss");

  const isCustom = period === "custom";

  // Compact pickers; a soft primary outline marks the pair as the active
  // filter when a custom range is applied.
  const customPickerSx = {
    width: { xs: "100%", sm: 185 },
    "& .MuiOutlinedInput-root": {
      fontSize: "0.8125rem",
      ...(isCustom
        ? {
            "& fieldset": {
              borderColor: alpha(theme.palette.primary.main, 0.4),
            },
          }
        : {}),
    },
  };

  /** Called when the "from" picker changes. Keeps existing dateTo if set. */
  const handleFromChange = (date: Date | null) => {
    if (!date) return;
    const from = fmtDt(date);
    const to = dateTo ?? fmtDt(new Date());
    onDateRangeChange(from, to);
  };

  /** Called when the "to" picker changes. Keeps existing dateFrom if set. */
  const handleToChange = (date: Date | null) => {
    if (!date) return;
    const from = dateFrom ?? fmtDt(new Date());
    const to = fmtDt(date);
    onDateRangeChange(from, to);
  };

  return (
    <Box
      sx={{
        px: 2,
        py: 1.25,
        mb: 2,
        bgcolor: "background.paper",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: `${radiusTokens.md}px`,
      }}
    >
      {/* Controls row — presets first (the common case), custom range after */}
      <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1.5}>
        {/* Period preset chips */}
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
              variant="outlined"
              onClick={() => onPeriodChange(p)}
              sx={{
                cursor: "pointer",
                ...getSoftSelectedChipSx(theme, period === p),
              }}
            />
          ))}
        </Stack>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ display: { xs: "none", sm: "block" } }}
        />

        {/* Custom datetime range — lights up when it is the active filter */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: isCustom ? "primary.main" : "text.secondary",
            }}
          >
            {t("filters.periods.custom")}
          </Typography>
          <DateTimePicker
            value={toDate(dateFrom)}
            onChange={handleFromChange}
            maxDateTime={toDate(dateTo) ?? new Date()}
            ampm={false}
            slots={{ textField: TextField }}
            slotProps={{
              textField: {
                size: "small",
                sx: customPickerSx,
                inputProps: { "aria-label": t("filters.dateFrom") },
              },
              actionBar: { actions: [] },
            }}
          />
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            →
          </Typography>
          <DateTimePicker
            value={toDate(dateTo)}
            onChange={handleToChange}
            minDateTime={toDate(dateFrom) ?? undefined}
            maxDateTime={new Date()}
            ampm={false}
            slots={{ textField: TextField }}
            slotProps={{
              textField: {
                size: "small",
                sx: customPickerSx,
                inputProps: { "aria-label": t("filters.dateTo") },
              },
              actionBar: { actions: [] },
            }}
          />
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
      </Stack>
    </Box>
  );
}

export default AnalyticsFilterBar;
