"use client";

import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { radiusTokens } from "@/lib/theme/designSystem";

export interface ApiKeyQuotaMeterProps {
  /** Active API keys the account currently holds. */
  count: number;
  /** `MAX_API_KEYS_PER_USER` — the account-wide cap. */
  max: number;
  /** True while the underlying list query is still resolving. */
  loading: boolean;
}

/**
 * Quota anchor at the top of the keys section — gives the page a compact
 * metric to orient on instead of only a sentence, matching the pattern
 * established by `SubdomainQuotaMeter` for `/subdomains`. The claimed count
 * renders in the app's Space Grotesk display face (`variant="h2"`, scaled
 * down to `2rem` to fit a single anchor rather than `OverviewMetricRow`'s
 * multi-metric row), a muted `/ max` beside it, a caption below, and a
 * `max`-segment fill strip that gives the quota a visual shape at a glance.
 *
 * Accessibility: the visual split (digit + "/ max" + caption) reads awkwardly
 * to a screen reader ("2 slash 5, keys in use" vs. one sentence), so the
 * decorative pieces are `aria-hidden` and the wrapping `role="group"` carries
 * a single `aria-label` built from the existing `subtitle`/`subtitleLoading`
 * i18n keys the page used to render as a plain caption — no meaning is lost,
 * just re-attached to the group instead of read piecemeal.
 *
 * @param props.count Active API keys the account currently holds.
 * @param props.max `MAX_API_KEYS_PER_USER` — the account-wide cap.
 * @param props.loading True while the underlying list query is still resolving.
 * @returns The compact quota metric, or a matching skeleton while loading.
 */
export function ApiKeyQuotaMeter({
  count,
  max,
  loading,
}: ApiKeyQuotaMeterProps) {
  const theme = useTheme();
  const { t } = useTranslation("apiKeys");

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
  // Trilha dos slots vazios = hairline do tema. Os alphas locais anteriores
  // (0.12 dark / 0.10 light sobre `text.primary`) ficaram ABAIXO do
  // `divider` depois do bump de bordas de 2026-08-17 (0.14 dark / 0.13
  // light): a barra vazia lia mais fraca que qualquer borda da página nos
  // dois temas. Amarrar ao token faz a trilha acompanhar futuros ajustes.
  const emptySegmentColor = theme.palette.divider;

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

export default ApiKeyQuotaMeter;
