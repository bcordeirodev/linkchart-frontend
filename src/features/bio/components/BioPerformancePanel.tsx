"use client";

import { useState } from "react";
import {
  Box,
  Skeleton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { typographyScale, radiusTokens } from "@/lib/theme";
import {
  getFilterSegmentSx,
  OverviewMetricRow,
  SectionLabel,
} from "@/shared/ui/base";
import { SocialPlatformIcon } from "@/shared/ui/icons";

import { useBioPerformance } from "../hooks/useBioPerformance";

import type { BioPerformancePeriod } from "../types";

/** Every selectable value of the panel's period control, in display order. */
const PERIODS: BioPerformancePeriod[] = ["7d", "30d", "90d", "all"];

/**
 * `/ DESEMPENHO` panel of the bio editor: total clicks across every item on
 * the page, a period filter, and the items ranked by clicks within that
 * period — consumes `GET /api/bio/performance` via `useBioPerformance`.
 *
 * No card wraps the whole section, matching `BioItemsSection`'s own
 * level-0-then-level-1 rhythm right above it in `BioEditor`: the
 * `SectionLabel` and `OverviewMetricRow` stay bare numbers, the period
 * control is its own trackless L3 strip, and only the ranked list itself
 * gets one hairline card — the same "no card inside a card" rule the items
 * list already follows.
 *
 * The period control is deliberately NEVER part of the loading/skeleton
 * swap below — each period is its own cache entry
 * (`queryKeys.bio.performance(period)`), so picking a period the panel
 * hasn't fetched yet flips `isLoading` back to `true`. Gating the control on
 * that flag would make it vanish behind a skeleton for the exact segment
 * the person just clicked. Only the total metric and the ranked list swap to
 * skeletons; the control they sit under stays put and interactive the whole
 * time — the same "controls stay, data beneath streams in" split
 * `ReportsOverviewHero`'s metric toggle already uses.
 *
 * Two non-loading, non-error states, deliberately different from each other:
 * - Genuinely zero clicks (a real `{totalClicks: 0, items: []}` response) —
 *   a friendly, expected-feeling empty line; nothing is broken.
 * - `isError` (including this endpoint 404ing while its backend branch is
 *   still unmerged) — a quiet, low-key fallback line replacing the ENTIRE
 *   section body (metric, period control and list all omitted), so it never
 *   reads as "you have zero clicks, try another period" when the truth is
 *   "this couldn't be checked right now".
 */
export function BioPerformancePanel() {
  const { t } = useTranslation("bio");
  const theme = useTheme();
  const [period, setPeriod] = useState<BioPerformancePeriod>("30d");
  const { performance, isLoading, isError } = useBioPerformance(period);

  return (
    <Stack spacing={1.5}>
      <SectionLabel headingLevel={2}>{t("performance.heading")}</SectionLabel>

      {isError ? (
        <Typography variant="body2" color="text.secondary">
          {t("performance.unavailable")}
        </Typography>
      ) : (
        <>
          {isLoading ? (
            <Skeleton variant="rounded" height={56} />
          ) : (
            <OverviewMetricRow
              size="md"
              metrics={[
                {
                  label: t("performance.totalClicksLabel"),
                  value: (performance?.totalClicks ?? 0).toLocaleString(),
                },
              ]}
            />
          )}

          <ToggleButtonGroup
            size="small"
            exclusive
            value={period}
            aria-label={t("performance.periodLabel")}
            sx={getFilterSegmentSx(theme, 32)}
            onChange={(_, next: BioPerformancePeriod | null) => {
              if (next) setPeriod(next);
            }}
          >
            {PERIODS.map((value) => (
              <ToggleButton key={value} value={value}>
                {t(`performance.periods.${value}`)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          {isLoading ? (
            <Skeleton variant="rounded" height={132} />
          ) : !performance || performance.items.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {t("performance.empty")}
            </Typography>
          ) : (
            <Box
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: `${radiusTokens.sm}px`,
                overflow: "hidden",
              }}
            >
              {performance.items.map((item, index) => (
                <Box
                  key={item.itemId}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 1.5,
                    py: 1,
                    borderBottom:
                      index < performance.items.length - 1
                        ? `1px solid ${theme.palette.divider}`
                        : "none",
                  }}
                >
                  {item.display === "icon" && item.socialPlatform ? (
                    <Box
                      sx={{
                        display: "flex",
                        color: "text.secondary",
                        flexShrink: 0,
                      }}
                    >
                      <SocialPlatformIcon
                        platform={item.socialPlatform}
                        size={16}
                      />
                    </Box>
                  ) : null}
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      flexShrink: 0,
                      fontFamily: typographyScale.code.fontFamily,
                      fontVariantNumeric: "tabular-nums",
                      fontWeight: 600,
                    }}
                  >
                    {item.clicks.toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </>
      )}
    </Stack>
  );
}

export default BioPerformancePanel;
