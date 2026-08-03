"use client";

import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { radiusTokens } from "@/lib/theme/designSystem";

export interface SubdomainQuotaMeterProps {
  /** Active subdomains the account currently holds. */
  count: number;
  /** `MAX_SUBDOMAINS_PER_USER` — the account-wide cap. */
  max: number;
  /** True while the underlying list query is still resolving. */
  loading: boolean;
}

/**
 * Quota anchor at the top of the addresses column — the redesign's fix for
 * the "2 de 3 endereços em uso" line that used to live as a plain caption
 * under the page title. Reworked as a compact metric: the claimed count in
 * the app's Space Grotesk display face (`variant="h2"`, same face as
 * {@link OverviewMetricRow}'s values, just scaled down to fit a column
 * instead of a full-width row — it doesn't need `OverviewMetricRow` itself,
 * which is built for 3+ metrics side by side, not a single anchor), a muted
 * `/ max` beside it, a caption below, and a `max`-segment fill strip that
 * gives the quota a visual shape instead of only a sentence.
 *
 * Accessibility: the visual split (digit + "/ max" + caption) reads awkwardly
 * to a screen reader ("2 slash 3, addresses in use" vs. one sentence), so the
 * decorative pieces are `aria-hidden` and the wrapping `role="group"` carries
 * a single `aria-label` built from the same `subtitle`/`subtitleLoading`
 * i18n keys the old inline caption used — no meaning is lost, just
 * re-attached to the group instead of read piecemeal.
 *
 * @param props.count Active subdomains the account currently holds.
 * @param props.max `MAX_SUBDOMAINS_PER_USER` — the account-wide cap.
 * @param props.loading True while the underlying list query is still resolving.
 * @returns The compact quota metric, or a matching skeleton while loading.
 */
export function SubdomainQuotaMeter({
  count,
  max,
  loading,
}: SubdomainQuotaMeterProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslation("subdomains");

  if (loading) {
    return (
      <Box aria-label={t("subtitleLoading")} role="group">
        <Skeleton
          variant="text"
          width={64}
          height={44}
          sx={{ fontSize: "2rem" }}
        />
        <Skeleton variant="text" width={120} height={20} />
      </Box>
    );
  }

  const segments = Array.from({ length: Math.max(max, 1) });
  const emptySegmentColor = alpha(
    theme.palette.text.primary,
    isDark ? 0.12 : 0.1,
  );

  return (
    <Box role="group" aria-label={t("subtitle", { count, max })}>
      <Typography
        aria-hidden
        variant="h2"
        component="p"
        sx={{
          display: "inline-flex",
          alignItems: "baseline",
          gap: 0.5,
          fontSize: "2rem",
          lineHeight: 1.1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {count}
        <Box
          component="span"
          sx={{ fontSize: "0.55em", fontWeight: 500, color: "text.secondary" }}
        >
          {`/ ${max}`}
        </Box>
      </Typography>
      <Typography
        aria-hidden
        variant="body2"
        sx={{ color: "text.secondary", mt: 0.25 }}
      >
        {t("quota.caption")}
      </Typography>
      <Stack
        aria-hidden
        direction="row"
        spacing={0.5}
        sx={{ mt: 1.25, maxWidth: 168 }}
      >
        {segments.map((_, index) => (
          <Box
            key={index}
            sx={{
              flex: 1,
              height: 4,
              borderRadius: `${radiusTokens.full}px`,
              backgroundColor:
                index < count ? theme.palette.primary.main : emptySegmentColor,
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}

export default SubdomainQuotaMeter;
