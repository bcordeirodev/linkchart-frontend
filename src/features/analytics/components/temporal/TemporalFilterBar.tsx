"use client";

import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import type {
  GroupBy,
  Segment,
} from "@/features/links/hooks/useAnalyticsFilters";

/** Props for the Temporal tab filter bar. */
interface TemporalFilterBarProps {
  groupBy: GroupBy;
  segment: Segment;
  onGroupByChange: (v: GroupBy) => void;
  onSegmentChange: (v: Segment) => void;
}

const GROUP_BY_OPTIONS: GroupBy[] = ["hour", "day", "month"];
const SEGMENT_OPTIONS: Segment[] = ["all", "weekday", "weekend", "business"];

/**
 * Filter bar for the Temporal analytics tab.
 *
 * Controls two filter dimensions:
 * - `groupBy`: which chart granularity to display (hour / day / month) — frontend-only
 * - `segment`: which click subset to include in the charts — passed to the backend
 */
export function TemporalFilterBar({
  groupBy,
  segment,
  onGroupByChange,
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
          {t("filters.groupBy")}
        </Typography>
        {GROUP_BY_OPTIONS.map((opt) => (
          <Chip
            key={opt}
            label={t(`filters.groupByOptions.${opt}`)}
            size="small"
            variant={groupBy === opt ? "filled" : "outlined"}
            color={groupBy === opt ? "primary" : "default"}
            onClick={() => onGroupByChange(opt)}
            sx={{ cursor: "pointer" }}
          />
        ))}
      </Stack>

      <Box
        sx={{
          width: 1,
          height: 20,
          bgcolor: "divider",
          display: { xs: "none", sm: "block" },
        }}
      />

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
