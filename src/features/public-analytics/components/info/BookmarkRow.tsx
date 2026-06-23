"use client";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import { Bookmark } from "lucide-react";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { radiusTokens } from "@/lib/theme/designSystem";

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
 * Discreet "save this page" callout: a bookmark icon, a one-line reminder that
 * this URL is the only way back to the analytics, the (muted) URL itself, and a
 * copy button.
 *
 * Demoted from a full titled section to a quiet info strip so it supports —
 * rather than competes with — the hero short-URL row above it. The reminder text
 * still carries the important "only access" warning, just at a lighter weight.
 *
 * The analytics URL is set client-side by the parent (`LinkHeroCard`) on mount,
 * so this component is purely presentational — it renders a placeholder (`—`)
 * until the URL is available.
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
  const iconColor = alpha(theme.palette.primary.main, isDark ? 0.95 : 0.85);

  return (
    <Stack
      component="section"
      aria-labelledby={headingId}
      direction="row"
      alignItems="center"
      gap={1.25}
      sx={{
        p: { xs: 1.25, sm: 1.4 },
        borderRadius: `${radiusTokens.md}px`,
        border: `1px solid ${alpha(theme.palette.primary.main, isDark ? 0.18 : 0.16)}`,
        bgcolor: alpha(theme.palette.primary.main, isDark ? 0.06 : 0.05),
      }}
    >
      <Box
        aria-hidden
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          width: 30,
          height: 30,
          borderRadius: "50%",
          color: iconColor,
          bgcolor: alpha(theme.palette.primary.main, isDark ? 0.16 : 0.12),
        }}
      >
        <Bookmark size={15} strokeWidth={2} />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          id={headingId}
          component="p"
          sx={{
            m: 0,
            fontSize: "0.8125rem",
            fontWeight: 600,
            lineHeight: 1.35,
            color: theme.palette.text.primary,
          }}
        >
          {t("publicAnalytics.saveUrlBanner.descShort")}
        </Typography>
        <Typography
          component="code"
          sx={{
            display: "block",
            mt: 0.25,
            minWidth: 0,
            fontFamily: "monospace",
            fontSize: { xs: "0.7rem", sm: "0.75rem" },
            color: alpha(theme.palette.text.primary, isDark ? 0.55 : 0.6),
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
  );
}
