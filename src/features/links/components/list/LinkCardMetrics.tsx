"use client";
/**
 * @file LinkCardMetrics — shared metrics footer row for desktop and mobile link cards.
 *
 * Extracts the duplicated metrics row from `LinkCardRich` (variant="rich") and
 * `LinksMobileCards` (variant="compact") into a single source of truth. Reuses
 * all shared style helpers from `linksPanelStyles` and `formatCount` for consistent
 * number formatting with the active UI locale.
 */

import { Eye, Clock } from "lucide-react";
import { Box, Tooltip, Typography } from "@mui/material";
import { format } from "date-fns";
import { useTheme } from "@mui/material/styles";
import { Children, Fragment, isValidElement, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import {
  formatLastClickLabel,
  getDateFnsLocale,
} from "@/features/links/utils/formatLastClick";
import { formatCount } from "@/lib/utils";
import { ICON_SM } from "@/lib/theme/iconDefaults";
import type { LinkMeta, LinkResponse } from "@/types";

import { LinkHealthBadge } from "./LinkHealthBadge";
import { LinkSparkline } from "./LinkSparkline";
import { LinkTrendBadge } from "./LinkTrendBadge";
import {
  getLinkCardMetricDividerSx,
  getLinkCardMetricsRowSx,
  linkCardMetricInlineSx,
  linkCardMetricLabelSx,
  linkCardMetricSegmentSx,
  linkCardMetricValueSx,
} from "./linksPanelStyles";

/**
 * Minimum absolute percent-change required to surface the trend badge.
 * Applies to both variants — links with no recent activity stay quiet instead
 * of showing an alarming −100%.
 */
const TREND_MIN_ABS_PERCENT = 5;

/** Whether the trend carries a real signal worth surfacing on the card. */
function hasTrendSignal(trend?: LinkMeta["trend"]): boolean {
  return (
    !!trend &&
    trend.current > 0 &&
    Math.abs(trend.percent_change) >= TREND_MIN_ABS_PERCENT
  );
}

// ─── Local helpers ──────────────────────────────────────────────────────────

/**
 * Wraps a label + children pair on a single horizontal line.
 * Mirrors the `InlineMetric` pattern from `LinkCardRich` — kept local so that
 * each variant can pass its own children without prop gymnastics.
 */
function InlineMetric({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Box sx={linkCardMetricInlineSx}>
      <Typography variant="caption" component="span" sx={linkCardMetricLabelSx}>
        {label}
      </Typography>
      {children}
    </Box>
  );
}

/**
 * Renders metric segments with thin vertical dividers between each truthy child.
 * Falsy children (null, undefined, false) are filtered out so dividers never
 * appear at the edges or back-to-back.
 */
function MetricsRow({
  children,
  dividerSx,
}: {
  children: ReactNode;
  dividerSx: object;
}) {
  const items = Children.toArray(children).filter(
    (child) => child != null && typeof child !== "boolean",
  );

  return (
    <>
      {items.map((child, index) => (
        <Fragment
          key={isValidElement(child) && child.key != null ? child.key : index}
        >
          {index > 0 ? <Box aria-hidden sx={dividerSx} /> : null}
          <Box sx={linkCardMetricSegmentSx}>{child}</Box>
        </Fragment>
      ))}
    </>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

/** Controls which segment set is rendered. */
export type LinkCardMetricsVariant = "rich" | "compact";

export interface LinkCardMetricsProps {
  /** The link whose metrics are shown. */
  link: LinkResponse;
  /**
   * Optional batch-meta for this link (sparkline, trend, health, preview).
   * When absent all optional segments are hidden gracefully.
   */
  meta?: LinkMeta;
  /**
   * `"rich"` — full desktop set: sparkline · trend · last-click · health ·
   * clicks · created-at · limit (if set) · tag chips on their own line.
   *
   * `"compact"` — mobile subset: sparkline · trend · clicks · last-click ·
   * created-at · health. Tags are rendered separately by the mobile card
   * (under the destination line), not by this variant.
   *
   * @default "rich"
   */
  variant?: LinkCardMetricsVariant;
  /**
   * Additional `sx` forwarded to the outer metrics-row `Box`.
   * Typically used by mobile cards to add `mt`/`pt` overrides.
   */
  sx?: object;
}

/**
 * Shared metrics footer row for link cards.
 *
 * Renders different segment sets depending on `variant`:
 * - `"rich"` matches the former desktop inline MetricsRow (tags live in the
 *   card's title row, not here — see `LinkCardRich`).
 * - `"compact"` matches the former mobile hand-rolled row (no tags — the
 *   mobile card renders those separately under the destination line).
 *
 * Clicks (and the click-limit in the rich variant) are formatted via
 * `formatCount(value, i18n.language)` on both variants — fixing the previously
 * unformatted `{link.clicks || 0}` on mobile.
 */
export function LinkCardMetrics({
  link,
  meta,
  variant = "rich",
  sx,
}: LinkCardMetricsProps) {
  const theme = useTheme();
  const { t, i18n } = useTranslation("links");
  const dateLocale = getDateFnsLocale(i18n.language);

  const dividerSx = getLinkCardMetricDividerSx(theme);

  const lastClickAt = meta?.trend?.last_click_at;
  const lastClickLabel = formatLastClickLabel(lastClickAt, dateLocale, t);
  const hasLastClick = Boolean(lastClickAt);

  if (variant === "rich") {
    // ── Desktop (rich) segments ────────────────────────────────────────────
    const createdDate = link.created_at ? new Date(link.created_at) : null;
    const createdLabel =
      createdDate && !isNaN(createdDate.getTime())
        ? format(createdDate, "dd/MM/yyyy", { locale: dateLocale })
        : null;

    // A flat all-zero sparkline carries no information — hide it so quiet
    // links don't render a meaningless line.
    const hasSparklineSignal = Boolean(
      meta?.sparkline?.length && meta.sparkline.some((p) => p.clicks > 0),
    );

    return (
      <>
        <Box sx={{ ...getLinkCardMetricsRowSx(theme), ...sx }}>
          <MetricsRow dividerSx={dividerSx}>
            {hasSparklineSignal ? (
              <LinkSparkline data={meta!.sparkline!} height={20} width={72} />
            ) : null}

            {/* Clicks lead the row — it's the KPI the list is scanned for. */}
            <InlineMetric label={t("metrics.clicksShort")}>
              <Typography
                variant="caption"
                component="span"
                sx={linkCardMetricValueSx}
              >
                {formatCount(link.clicks, i18n.language)}
              </Typography>
            </InlineMetric>

            {hasTrendSignal(meta?.trend) ? (
              <LinkTrendBadge trend={meta!.trend} compact />
            ) : null}

            <InlineMetric label={t("metrics.lastClickShort")}>
              <Typography
                variant="caption"
                component="span"
                sx={{
                  ...linkCardMetricValueSx,
                  color: hasLastClick ? "text.primary" : "text.disabled",
                  fontWeight: hasLastClick ? 600 : 500,
                }}
              >
                {lastClickLabel}
              </Typography>
            </InlineMetric>

            {meta?.health?.status === "error" ? (
              <LinkHealthBadge health={meta.health} />
            ) : null}

            {createdLabel ? (
              <InlineMetric label={t("table.created")}>
                <Typography
                  variant="caption"
                  component="span"
                  sx={{
                    ...linkCardMetricValueSx,
                    color: "text.secondary",
                    fontWeight: 500,
                  }}
                >
                  {createdLabel}
                </Typography>
              </InlineMetric>
            ) : null}

            {link.click_limit ? (
              <Tooltip
                title={`${t("table.clickLimit")}: ${formatCount(link.click_limit, i18n.language)}`}
              >
                <InlineMetric label={t("table.clickLimit")}>
                  <Typography
                    variant="caption"
                    component="span"
                    sx={{
                      ...linkCardMetricValueSx,
                      color:
                        link.clicks >= link.click_limit
                          ? "error.main"
                          : "text.primary",
                    }}
                  >
                    {formatCount(link.clicks, i18n.language)}/
                    {formatCount(link.click_limit, i18n.language)}
                  </Typography>
                </InlineMetric>
              </Tooltip>
            ) : null}
          </MetricsRow>
        </Box>
      </>
    );
  }

  // ── Compact (mobile) segments ──────────────────────────────────────────────
  // Clean by default: clicks + last-click always; trend only when it carries a
  // real signal (health gates itself). Sparkline and created-date are
  // desktop-only.
  const showTrend = hasTrendSignal(meta?.trend);

  return (
    <Box sx={{ ...getLinkCardMetricsRowSx(theme), mt: 0.75, pt: 0.75, ...sx }}>
      <MetricsRow dividerSx={dividerSx}>
        <Box sx={linkCardMetricInlineSx}>
          <Eye {...ICON_SM} style={{ opacity: 0.4, flexShrink: 0 }} />
          <Typography
            variant="caption"
            component="span"
            sx={linkCardMetricValueSx}
          >
            {formatCount(link.clicks, i18n.language)}
          </Typography>
        </Box>

        <Box sx={linkCardMetricInlineSx}>
          <Clock {...ICON_SM} style={{ opacity: 0.4, flexShrink: 0 }} />
          <Typography
            variant="caption"
            component="span"
            sx={{
              ...linkCardMetricValueSx,
              color: hasLastClick ? "text.secondary" : "text.disabled",
              fontWeight: 500,
            }}
          >
            {hasLastClick ? lastClickLabel : t("metrics.noClicks")}
          </Typography>
        </Box>

        {showTrend ? <LinkTrendBadge trend={meta!.trend} compact /> : null}

        {meta?.health?.status === "error" ? (
          <LinkHealthBadge health={meta.health} />
        ) : null}
      </MetricsRow>
    </Box>
  );
}
