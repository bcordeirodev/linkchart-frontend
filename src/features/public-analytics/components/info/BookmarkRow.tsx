"use client";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { radiusTokens } from "@/lib/theme/designSystem";
import { getPublicInsetSx } from "@/lib/theme/publicPageStyles";

import { CopyIconButton } from "./CopyIconButton";

interface BookmarkRowProps {
  /**
   * The current page's analytics URL.
   * Empty string while `window.location.href` is not yet hydrated (SSR guard).
   */
  analyticsUrl: string;
  /** Whether the analytics URL was recently copied. */
  copied: boolean;
  /** Triggers clipboard write for the analytics URL. */
  onCopy: () => void;
  /**
   * Id for the section heading — enables `aria-labelledby` on the
   * wrapping `<section>` element.
   */
  headingId: string;
}

/**
 * Bookmark row: title, description, and a bordered copy button for the
 * public analytics page URL.
 *
 * Encourages users to save or share this analytics page URL. The analytics
 * URL is set client-side by the parent (`LinkHeroCard`) on mount, so this
 * component is purely presentational — it renders a placeholder (`—`) until
 * the URL is available.
 *
 * @remarks
 * Uses the same `CopyIconButton` pattern as `ShortUrlRow` for a consistent
 * copy affordance throughout the hero card.
 */
export function BookmarkRow({
  analyticsUrl,
  copied,
  onCopy,
  headingId,
}: BookmarkRowProps) {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const isDark = theme.palette.mode === "dark";

  return (
    <Box component="section" aria-labelledby={headingId}>
      <Typography
        id={headingId}
        component="h3"
        variant="subtitle2"
        fontWeight={700}
        sx={{
          mb: 0.5,
          fontSize: "0.9375rem",
          letterSpacing: "-0.01em",
          color: theme.palette.text.primary,
        }}
      >
        {t("publicAnalytics.saveUrlBanner.title")}
      </Typography>
      <Typography
        component="p"
        variant="body2"
        color="text.secondary"
        sx={{ mb: 1.5, lineHeight: 1.55 }}
      >
        {t("publicAnalytics.saveUrlBanner.desc")}
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        gap={0.75}
        role="group"
        aria-label={t("publicAnalytics.linkInfo.analyticsPageUrl")}
        sx={{
          ...getPublicInsetSx(theme),
          p: { xs: 1, sm: 1.1 },
          borderRadius: `${radiusTokens.sm}px`,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            component="span"
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              mb: 0.35,
            }}
          >
            {t("publicAnalytics.linkInfo.analyticsPageUrl")}
          </Typography>
          <Typography
            component="code"
            sx={{
              display: "block",
              minWidth: 0,
              fontFamily: "monospace",
              fontSize: { xs: "0.75rem", sm: "0.8125rem" },
              color: alpha(theme.palette.text.primary, isDark ? 0.8 : 0.84),
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              bgcolor: "transparent",
            }}
          >
            {analyticsUrl || "—"}
          </Typography>
        </Box>
        <CopyIconButton
          copied={copied}
          onClick={onCopy}
          ariaLabel={t("publicAnalytics.linkInfo.copyAnalyticsUrl")}
          disabled={!analyticsUrl}
        />
      </Stack>
    </Box>
  );
}
