"use client";

import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { Segment } from "@/features/links/hooks/useAnalyticsFilters";

/** Props for the Temporal tab filter bar. */
interface TemporalFilterBarProps {
  segment: Segment;
  onSegmentChange: (v: Segment) => void;
}

const SEGMENT_OPTIONS: Segment[] = ["all", "weekday", "weekend", "business"];

/**
 * Filter bar for the Temporal analytics tab.
 *
 * Controls the `segment` dimension — which click subset to include in charts.
 * The selection is passed to the backend, so charts reflect only matching clicks:
 * - `weekday`  → Mon–Fri only (is_weekend=false)
 * - `weekend`  → Sat–Sun only (is_weekend=true)
 * - `business` → business-hours clicks only (is_business_hours=true); weekend
 *                bars in the day-of-week chart will show 0 as expected
 */
export function TemporalFilterBar({
  segment,
  onSegmentChange,
}: TemporalFilterBarProps) {
  const { t } = useTranslation("analytics");
  const theme = useTheme();

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
          {t("filters.segment")}
        </Typography>
        {SEGMENT_OPTIONS.map((opt) => (
          <Chip
            key={opt}
            label={t(`filters.segmentOptions.${opt}`)}
            size="small"
            variant={segment === opt ? "filled" : "outlined"}
            color={segment === opt ? "primary" : "default"}
            onClick={() => onSegmentChange(opt)}
            sx={{ cursor: "pointer" }}
          />
        ))}
      </Stack>
    </Box>
  );
}

export default TemporalFilterBar;
