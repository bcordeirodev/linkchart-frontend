"use client";

import {
  alpha,
  Box,
  Divider,
  Stack,
  FormControlLabel,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { format, parse, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";

import {
  EnhancedPaper,
  getCardSurfaceSx,
  getSegmentedControlSx,
} from "@/shared/ui/base";

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

/** Period presets shown as the segmented control's pills. */
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
 * Global analytics filter bar rendered above the tab strip in
 * `LinkAnalyticsTabsOptimized`.
 *
 * Post-cycle alignment (2026-08-04): rebuilt onto the `/links` instrument-strip
 * standard (`LinksFilters.tsx`) — the analytics screen was gate-approved
 * before that pattern shipped and never received it. One defined card
 * (`EnhancedPaper` + {@link getCardSurfaceSx}, same translucent-veil +
 * hairline as every other in-page card) holding, in one row from `md` up:
 * the period segmented control (`getSegmentedControlSx` — the same attached
 * pill track as `/links`' STATUS control), the compact custom date range
 * beside it, and the bot-exclusion switch pinned to the right edge. Below
 * `md` everything wraps, same as `LinksFilters`.
 *
 * The caps "PERÍODO"/"PERSONALIZADO" captions from the old chip-row
 * composition are gone — the segmented control speaks for itself (its
 * selected pill *is* the period), and the date-range group carries the same
 * text as an `aria-label`/`role="group"` instead of visible copy. Zero
 * behavior change: `period`/`dateFrom`/`dateTo`/`excludeBots` and their
 * `onChange` callbacks are unchanged in shape and semantics.
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
      height: 40,
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

  /**
   * Ignores the `null` MUI emits when the user clicks the already-active
   * segment of an `exclusive` `ToggleButtonGroup` — the period control always
   * has zero or one active segment (none when `period === "custom"`), so a
   * click on the current one is a no-op (same guard `LinksFilters`' STATUS
   * control uses).
   */
  const handlePeriodChange = (
    _event: React.MouseEvent<HTMLElement>,
    next: Period | null,
  ) => {
    if (next !== null) onPeriodChange(next);
  };

  return (
    <EnhancedPaper
      variant="outlined"
      animated={false}
      sx={{ p: 2, mb: 2, ...getCardSurfaceSx(theme) }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        {/* Period — segmented control, same attached-pill language as /links'
            STATUS control. No segment is active when period === "custom". */}
        <ToggleButtonGroup
          value={period}
          exclusive
          onChange={handlePeriodChange}
          aria-label={t("filters.period")}
          sx={getSegmentedControlSx(theme)}
        >
          {PRESET_PERIODS.map((p) => (
            <ToggleButton key={p} value={p}>
              {t(`filters.periods.${p}`)}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ display: { xs: "none", sm: "block" } }}
        />

        {/* Custom datetime range — the soft primary outline (above) is the
            only cue that it's the active filter; the old "PERSONALIZADO"
            caption moved to an aria-label/role="group" here. */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          role="group"
          aria-label={t("filters.periods.custom")}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
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

        {/* Spacer — pins the bots switch to the right edge from `md` up;
            collapses to nothing below `md`, where the switch just wraps. */}
        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "block" } }} />

        {/* Bot exclusion toggle — label is part of the tap target. Below
            `md` the spacer above collapses, so this just wraps onto its own
            line like every other instrument, left-aligned same as the rest
            (no special mobile alignment — "right-aligned" only applies
            once the spacer is active, at `md`+). */}
        <FormControlLabel
          sx={{ ml: 0, mr: 0 }}
          control={
            <Switch
              size="small"
              checked={excludeBots}
              onChange={(e) => onExcludeBotsChange(e.target.checked)}
              color="success"
            />
          }
          label={
            <Typography
              variant="caption"
              color={excludeBots ? "success.main" : "text.secondary"}
              sx={{ fontWeight: excludeBots ? 600 : 400 }}
            >
              {t("filters.excludeBots")}
            </Typography>
          }
        />
      </Box>
    </EnhancedPaper>
  );
}

export default AnalyticsFilterBar;
