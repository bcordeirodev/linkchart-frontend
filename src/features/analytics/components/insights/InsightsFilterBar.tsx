"use client";

import { Box, Chip, Stack, Switch, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { InsightPriority } from "@/features/links/hooks/useAnalyticsFilters";

/** Props for the Insights tab filter bar. */
interface InsightsFilterBarProps {
  priority: InsightPriority;
  insightCategories: string[];
  actionableOnly: boolean;
  onPriorityChange: (v: InsightPriority) => void;
  onCategoriesChange: (v: string[]) => void;
  onActionableOnlyChange: (v: boolean) => void;
}

const PRIORITY_OPTIONS: InsightPriority[] = ["all", "high", "medium"];
const CATEGORY_OPTIONS = [
  "geographic",
  "temporal",
  "audience",
  "performance",
  "security",
  "retention",
  "engagement",
] as const;

/**
 * Filter bar for the Insights analytics tab.
 *
 * Controls three dimensions:
 * - `priority`: "all" | "high" | "medium" — client-side filter
 * - `insightCategories`: multi-select array of type strings — client-side filter
 * - `actionableOnly`: boolean toggle — client-side filter
 */
export function InsightsFilterBar({
  priority,
  insightCategories,
  actionableOnly,
  onPriorityChange,
  onCategoriesChange,
  onActionableOnlyChange,
}: InsightsFilterBarProps) {
  const { t } = useTranslation("analytics");
  const theme = useTheme();

  /**
   * Toggles a single category in/out of the selected categories array.
   */
  const toggleCategory = (cat: string) => {
    if (insightCategories.includes(cat)) {
      onCategoriesChange(insightCategories.filter((c) => c !== cat));
    } else {
      onCategoriesChange([...insightCategories, cat]);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
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
        spacing={3}
        flexWrap="wrap"
        useFlexGap
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
              minWidth: 72,
            }}
          >
            {t("filters.priority")}
          </Typography>
          {PRIORITY_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              label={t(`filters.priorityOptions.${opt}`)}
              size="small"
              variant={priority === opt ? "filled" : "outlined"}
              color={priority === opt ? "primary" : "default"}
              onClick={() => onPriorityChange(opt)}
              sx={{ cursor: "pointer" }}
            />
          ))}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Switch
            size="small"
            checked={actionableOnly}
            onChange={(e) => onActionableOnlyChange(e.target.checked)}
            inputProps={{ "aria-label": t("filters.actionableOnly") }}
          />
          <Typography variant="caption" color="text.secondary">
            {t("filters.actionableOnly")}
          </Typography>
        </Stack>
      </Stack>

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
            minWidth: 72,
          }}
        >
          {t("filters.insightType")}
        </Typography>
        {CATEGORY_OPTIONS.map((cat) => (
          <Chip
            key={cat}
            label={t(`filters.insightTypeOptions.${cat}`)}
            size="small"
            variant={insightCategories.includes(cat) ? "filled" : "outlined"}
            color={insightCategories.includes(cat) ? "secondary" : "default"}
            onClick={() => toggleCategory(cat)}
            sx={{ cursor: "pointer" }}
          />
        ))}
      </Stack>
    </Box>
  );
}

export default InsightsFilterBar;
