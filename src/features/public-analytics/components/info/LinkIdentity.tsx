"use client";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import { Link2 } from "lucide-react";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { PublicBlockIcon } from "@/shared/ui/base";

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
 * Identity header row for the hero card: icon shell + slug heading + optional title.
 *
 * When `title` is absent, a small availability note is shown instead.
 *
 * @remarks
 * The `domain` field present on `PublicLinkData` is intentionally NOT displayed
 * here — it has no corresponding i18n key and was dead/unused in the original
 * component. It remains available on the parent's `linkData` prop for future use.
 */
export function LinkIdentity({ slug, title, headingId }: LinkIdentityProps) {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const isDark = theme.palette.mode === "dark";
  const iconColor = alpha(theme.palette.common.white, isDark ? 0.95 : 0.92);

  return (
    <Stack
      component="header"
      direction="row"
      alignItems="flex-start"
      gap={1.25}
    >
      <PublicBlockIcon
        icon={Link2}
        sx={{
          color: iconColor,
          bgcolor: alpha(theme.palette.common.white, isDark ? 0.08 : 0.14),
          borderColor: alpha(theme.palette.common.white, isDark ? 0.22 : 0.3),
        }}
      />
      <Box sx={{ minWidth: 0 }}>
        <Typography
          component="h2"
          id={headingId}
          sx={{
            fontFamily: "monospace",
            fontSize: { xs: "1.125rem", md: "1.25rem" },
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            color: theme.palette.text.primary,
          }}
        >
          /{slug}
        </Typography>
        {title ? (
          <Typography
            component="p"
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5, lineHeight: 1.45 }}
            noWrap
          >
            {title}
          </Typography>
        ) : (
          <Typography
            component="p"
            variant="caption"
            sx={{
              mt: 0.5,
              color: alpha(theme.palette.text.primary, isDark ? 0.7 : 0.66),
              letterSpacing: "0.02em",
            }}
          >
            {t("publicAnalytics.linkInfo.publicAnalyticsAvailable")}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
