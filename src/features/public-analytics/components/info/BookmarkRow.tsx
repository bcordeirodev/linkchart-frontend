"use client";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { typographyScale } from "@/lib/theme";
import { publicHairline } from "@/lib/theme/publicPageStyles";

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
 * "Save this page" footer of the hero card: the one-line reminder that this
 * URL is the only way back to the analytics, the URL itself in mono, and a
 * copy button.
 *
 * It is a footer row closed by a hairline, not a box: it used to be a bordered
 * tinted strip carrying a circular `Bookmark` glyph, which made it a third
 * surface competing with the short-URL inset right above it while saying
 * something quieter. The warning and its copy affordance are unchanged — only
 * the packaging is.
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

  return (
    <Stack
      component="section"
      aria-labelledby={headingId}
      direction="row"
      alignItems="center"
      gap={1.25}
      sx={{
        pt: { xs: 1.75, sm: 2 },
        borderTop: `1px solid ${publicHairline(theme, "inset")}`,
      }}
    >
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
            fontFamily: typographyScale.code.fontFamily,
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
