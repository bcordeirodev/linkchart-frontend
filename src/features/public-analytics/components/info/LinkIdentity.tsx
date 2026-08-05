"use client";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { typographyScale } from "@/lib/theme";

interface LinkIdentityProps {
  /** Short slug shown as the card heading (without leading slash). */
  slug: string;
  /** Optional human-readable title for the link. */
  title: string | null;
  /**
   * Id attribute to set on the `<h2>` element so parent can wire
   * `aria-labelledby` on the wrapping `<article>`.
   */
  headingId: string;
}

/**
 * Identity header for the hero card: the slug as `/slug` in JetBrains Mono,
 * with the optional link title underneath.
 *
 * The 36×36 rounded `Link2` icon shell that used to open this row is gone —
 * a glyph next to a title is the pattern the redesign removes, and here it was
 * also redundant: the heading already says "link" by being a slug. The `/` is
 * now `primary.main` and `aria-hidden`, the same prefix `SectionLabel` uses
 * across the app, so the product's own glyph is what marks the identity. The
 * rendered text is unchanged (`/` + slug); only the slash's colour and its
 * exclusion from the accessible name are new.
 *
 * When `title` is absent, a small availability note is shown instead.
 *
 * @remarks
 * The `domain` field present on `PublicLinkData` is intentionally NOT displayed
 * here — it has no corresponding i18n key. It remains available on the parent's
 * `linkData` prop for future use.
 */
export function LinkIdentity({ slug, title, headingId }: LinkIdentityProps) {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const isDark = theme.palette.mode === "dark";

  return (
    <Stack component="header" spacing={0.5} sx={{ minWidth: 0 }}>
      <Typography
        component="h2"
        id={headingId}
        noWrap
        sx={{
          fontFamily: typographyScale.code.fontFamily,
          fontSize: { xs: "1.125rem", md: "1.25rem" },
          fontWeight: 700,
          letterSpacing: "-0.01em",
          lineHeight: 1.2,
          color: theme.palette.text.primary,
        }}
      >
        <Box component="span" aria-hidden sx={{ color: "primary.main" }}>
          /
        </Box>
        {slug}
      </Typography>
      {title ? (
        <Typography
          component="p"
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.45 }}
          noWrap
        >
          {title}
        </Typography>
      ) : (
        <Typography
          component="p"
          variant="caption"
          sx={{
            color: alpha(theme.palette.text.primary, isDark ? 0.7 : 0.66),
            letterSpacing: "0.02em",
          }}
        >
          {t("publicAnalytics.linkInfo.publicAnalyticsAvailable")}
        </Typography>
      )}
    </Stack>
  );
}
