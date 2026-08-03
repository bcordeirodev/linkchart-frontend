"use client";
/**
 * Portfolio-level "business insights" row for the `/reports` page — compact
 * callout cards computed across ALL of the user's links: best performing
 * link, fastest growing link, top-3 traffic concentration and overall
 * account growth. Distinct from the per-link insights on
 * `/links/analytics/[id]` (peak hour, top country, ...) — every value here
 * only makes sense aggregated across the whole portfolio, not for one link.
 */

import { Box, Card, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { radiusTokens } from "@/lib/theme/designSystem";
import { useNavigate } from "@/shared/hooks";
import { SectionLabel } from "@/shared/ui/base/SectionLabel";

import { formatSignedPct } from "@/features/reports/utils/variationPillStyles";

import type { Theme } from "@mui/material/styles";
import type {
  ReportsInsight,
  ReportsInsightKey,
} from "@/features/reports/types";

/** Props accepted by {@link InsightsPanel}. */
interface InsightsPanelProps {
  /** Portfolio insights for the selected period, in the backend's fixed order. */
  data: ReportsInsight[];
}

/**
 * Maps each dimension to its full i18n label key (avoids a template-literal
 * key, which the typed `t()` rejects) — same convention as
 * `BreakdownChart`'s `DIMENSION_LABEL_KEY`.
 */
const INSIGHT_LABEL_KEY: Record<
  ReportsInsightKey,
  | "insights.bestPerformingLink.label"
  | "insights.fastestGrowingLink.label"
  | "insights.top3Concentration.label"
  | "insights.accountGrowth.label"
> = {
  best_performing_link: "insights.bestPerformingLink.label",
  fastest_growing_link: "insights.fastestGrowingLink.label",
  top3_concentration: "insights.top3Concentration.label",
  account_growth: "insights.accountGrowth.label",
};

/** Accent color per insight `key`, used as the card's left-border stripe. */
function insightColor(theme: Theme, key: ReportsInsightKey): string {
  switch (key) {
    case "best_performing_link":
      return theme.palette.warning.main;
    case "fastest_growing_link":
      return theme.palette.success.main;
    case "top3_concentration":
      return theme.palette.info.main;
    case "account_growth":
    default:
      return theme.palette.primary.main;
  }
}

/** Reads a numeric field off an insight's opaque `meta` bag, or `null` if absent/non-numeric. */
function metaNumber(
  meta: ReportsInsight["meta"],
  field: string,
): number | null {
  const value = meta?.[field];

  return typeof value === "number" ? value : null;
}

/**
 * One compact insight card: localized label, headline value, a left-border
 * accent stripe (the one categorical color this card keeps — no icon-chip,
 * per the "instrumento técnico" redesign), and — for the two
 * link-identifying insights — a supporting caption pulled from `meta`
 * (clicks for the best link, trend for the fastest-growing one).
 */
function InsightCard({ insight }: { insight: ReportsInsight }) {
  const theme = useTheme();
  const { t } = useTranslation("reports");
  const navigate = useNavigate();
  const color = insightColor(theme, insight.key);
  const linkId = metaNumber(insight.meta, "link_id");
  const clickable = linkId !== null;

  let value: string;
  let caption: string | null = null;

  if (
    insight.key === "best_performing_link" ||
    insight.key === "fastest_growing_link"
  ) {
    value =
      insight.value !== null ? String(insight.value) : t("insights.noData");

    if (insight.key === "best_performing_link") {
      const clicks = metaNumber(insight.meta, "clicks");
      caption =
        clicks !== null ? t("topLinks.clicksCount", { count: clicks }) : null;
    } else {
      const pct = metaNumber(insight.meta, "variation_pct");
      caption = pct !== null ? formatSignedPct(pct) : null;
    }
  } else {
    const numericValue =
      typeof insight.value === "number" ? insight.value : null;

    value =
      insight.key === "account_growth"
        ? formatSignedPct(numericValue)
        : numericValue === null
          ? t("insights.noData")
          : `${numericValue}${insight.unit ?? ""}`;
  }

  return (
    <Card
      onClick={
        clickable ? () => navigate(`/links/analytics/${linkId}`) : undefined
      }
      role={clickable ? "button" : undefined}
      aria-label={clickable ? t("insights.viewLink") : undefined}
      sx={{
        p: 1.75,
        border: `1px solid ${theme.palette.divider}`,
        borderLeft: `3px solid ${color}`,
        borderRadius: `${radiusTokens.md}px`,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        minWidth: 0,
        ...(clickable && {
          cursor: "pointer",
          transition: "border-color 140ms ease",
          "&:hover": { borderColor: theme.palette.primary.main },
        }),
      }}
    >
      <Typography
        variant="caption"
        sx={{ color: "text.secondary", fontWeight: 500, lineHeight: 1.2 }}
      >
        {t(INSIGHT_LABEL_KEY[insight.key])}
      </Typography>

      <Typography
        variant="body1"
        sx={{ fontWeight: 700, lineHeight: 1.25 }}
        noWrap
        title={value}
      >
        {value}
      </Typography>

      {caption ? (
        <Typography variant="caption" color="text.secondary">
          {caption}
        </Typography>
      ) : null}
    </Card>
  );
}

/**
 * Renders the portfolio insights row — one card per entry the backend
 * returns, in its fixed order (best link, fastest-growing link, top-3
 * concentration, account growth). Renders nothing when `data` is empty —
 * the caller (`ReportsPage`) gates loading/error state and shows a skeleton
 * instead.
 */
export function InsightsPanel({ data }: InsightsPanelProps) {
  const { t } = useTranslation("reports");

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Box>
      <SectionLabel headingLevel={2}>{t("insights.title")}</SectionLabel>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 1.5, mt: { xs: 1.5, sm: 2 } }}
      >
        {t("insights.subtitle")}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 1.5,
        }}
      >
        {data.map((insight) => (
          <InsightCard key={insight.key} insight={insight} />
        ))}
      </Box>
    </Box>
  );
}

export default InsightsPanel;
