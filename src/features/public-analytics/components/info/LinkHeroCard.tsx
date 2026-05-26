"use client";

import { useState, useEffect, useId } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { ExternalLink, Copy, Check, Link2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import useClipboard from "@/hooks/useClipboard";
import { ICON_SM } from "@/lib/theme/iconDefaults";
import { radiusTokens } from "@/lib/theme/designSystem";
import {
  getPublicInsetSx,
  getPublicPanelSx,
  publicHairline,
} from "@/lib/theme/publicPageStyles";
import { alpha } from "@mui/material/styles";
import { getShortUrl } from "@/lib/utils/shortUrl";
import { PublicBlockIcon } from "@/shared/ui/base";

import type { PublicLinkData } from "../../types";

interface LinkHeroCardProps {
  linkData: PublicLinkData;
  onCreateLink: () => void;
}

/**
 * Hero card for /public-analytics/[slug]: short URL, destination, bookmark URL, CTA.
 */
export function LinkHeroCard({ linkData, onCreateLink }: LinkHeroCardProps) {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const isDark = theme.palette.mode === "dark";
  const shortUrlHeadingId = useId();
  const destinationHeadingId = useId();
  const saveHeadingId = useId();

  const shortUrl = getShortUrl(linkData.short_url);
  const { copy: copyShort, copied: copiedShort } = useClipboard({
    timeout: 1500,
  });
  const { copy: copyAnalytics, copied: copiedAnalytics } = useClipboard({
    timeout: 2000,
  });
  const [analyticsUrl, setAnalyticsUrl] = useState("");

  useEffect(() => {
    setAnalyticsUrl(window.location.href);
  }, []);

  const dividerColor = publicHairline(theme);
  const shortUrlColor = alpha(theme.palette.common.white, isDark ? 0.95 : 0.92);
  const ctaTextColor = isDark
    ? theme.palette.common.white
    : "rgba(255,255,255,0.96)";
  const sectionLabelSx = {
    display: "block",
    mb: 0.9,
    fontSize: "0.71875rem",
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: alpha(theme.palette.text.primary, isDark ? 0.76 : 0.72),
  };
  const inlineCopyButtonSx = {
    flexShrink: 0,
    borderRadius: `${radiusTokens.sm}px`,
    alignSelf: { xs: "stretch", sm: "center" } as const,
    minWidth: { xs: "100%", sm: 104 },
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "none" as const,
  };

  return (
    <Box
      component="article"
      aria-labelledby={shortUrlHeadingId}
      sx={getPublicPanelSx(theme)}
    >
      <Stack spacing={2.5} sx={{ p: { xs: 2.5, md: 3 } }}>
        {/* Identity */}
        <Stack
          component="header"
          direction="row"
          alignItems="flex-start"
          gap={1.25}
        >
          <PublicBlockIcon
            icon={Link2}
            sx={{
              color: shortUrlColor,
              bgcolor: alpha(theme.palette.common.white, isDark ? 0.08 : 0.14),
              borderColor: alpha(
                theme.palette.common.white,
                isDark ? 0.22 : 0.3,
              ),
            }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              component="h2"
              id={shortUrlHeadingId}
              sx={{
                fontFamily: "monospace",
                fontSize: { xs: "1.125rem", md: "1.25rem" },
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                color: theme.palette.text.primary,
              }}
            >
              /{linkData.slug}
            </Typography>
            {linkData.title ? (
              <Typography
                component="p"
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, lineHeight: 1.45 }}
                noWrap
              >
                {linkData.title}
              </Typography>
            ) : (
              <Typography
                component="p"
                variant="caption"
                sx={{
                  mt: 0.5,
                  display: "inline-flex",
                  alignItems: "center",
                  px: 0.75,
                  py: 0.25,
                  borderRadius: "999px",
                  bgcolor: alpha(
                    theme.palette.primary.main,
                    isDark ? 0.22 : 0.56,
                  ),
                  color: alpha(theme.palette.common.white, 0.95),
                  letterSpacing: "0.02em",
                }}
              >
                {t("publicAnalytics.linkInfo.publicAnalyticsAvailable")}
              </Typography>
            )}
          </Box>
        </Stack>

        {/* Short URL */}
        <Box component="section" aria-labelledby={`${shortUrlHeadingId}-label`}>
          <Typography
            id={`${shortUrlHeadingId}-label`}
            component="h3"
            variant="overline"
            color="text.secondary"
            sx={sectionLabelSx}
          >
            {t("publicAnalytics.linkInfo.shortenedLink")}
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ sm: "center" }}
            gap={1}
            sx={{
              ...getPublicInsetSx(theme, { primaryTint: true }),
              p: { xs: 1.25, sm: 1.5 },
            }}
          >
            <Typography
              component="p"
              sx={{
                flex: 1,
                minWidth: 0,
                m: 0,
                fontFamily: "monospace",
                fontSize: { xs: "0.9375rem", md: "1rem" },
                fontWeight: 600,
                color: shortUrlColor,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              <Link
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{ color: "inherit", fontWeight: "inherit" }}
              >
                {shortUrl}
              </Link>
            </Typography>
            <Button
              size="small"
              variant="contained"
              color={copiedShort ? "success" : "primary"}
              onClick={() => copyShort(shortUrl)}
              startIcon={
                copiedShort ? (
                  <Check size={14} aria-hidden />
                ) : (
                  <Copy size={14} aria-hidden />
                )
              }
              sx={inlineCopyButtonSx}
            >
              {copiedShort
                ? t("publicAnalytics.saveUrlBanner.copied")
                : t("publicAnalytics.linkInfo.copy")}
            </Button>
          </Stack>
        </Box>

        {/* Destination */}
        <Box component="section" aria-labelledby={destinationHeadingId}>
          <Typography
            id={destinationHeadingId}
            component="h3"
            variant="overline"
            color="text.secondary"
            sx={sectionLabelSx}
          >
            {t("publicAnalytics.linkInfo.destination")}
          </Typography>
          <Box
            sx={{
              ...getPublicInsetSx(theme),
              p: { xs: 1.15, sm: 1.25 },
              display: "flex",
              alignItems: "center",
              gap: 0.75,
            }}
          >
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                color: shortUrlColor,
                flexShrink: 0,
              }}
            >
              <ExternalLink size={14} strokeWidth={1.75} aria-hidden />
            </Box>
            <Link
              href={linkData.original_url}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: alpha(theme.palette.text.primary, isDark ? 0.74 : 0.78),
                fontFamily: "monospace",
                fontSize: "0.8125rem",
                "&:hover": { color: "text.primary" },
              }}
            >
              {linkData.original_url}
            </Link>
          </Box>
        </Box>

        <Divider sx={{ borderColor: dividerColor }} />

        {/* Bookmark this analytics page */}
        <Box component="section" aria-labelledby={saveHeadingId}>
          <Typography
            id={saveHeadingId}
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
            direction="row"
            alignItems="center"
            gap={0.75}
            role="group"
            aria-label={t("publicAnalytics.linkInfo.analyticsPageUrl")}
            sx={{
              ...getPublicInsetSx(theme),
              p: { xs: 1, sm: 1.1 },
              borderRadius: `${radiusTokens.sm}px`,
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
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
            <IconButton
              size="small"
              onClick={() => copyAnalytics(analyticsUrl)}
              aria-label={t("publicAnalytics.linkInfo.copyAnalyticsUrl")}
              color={copiedAnalytics ? "success" : "default"}
              disabled={!analyticsUrl}
              sx={{
                alignSelf: { xs: "flex-end", sm: "center" },
                flexShrink: 0,
                color: copiedAnalytics
                  ? theme.palette.success.main
                  : shortUrlColor,
                border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.35 : 0.4)}`,
                bgcolor: alpha(
                  theme.palette.background.paper,
                  isDark ? 0.5 : 0.86,
                ),
                "&:hover": {
                  bgcolor: alpha(
                    theme.palette.background.paper,
                    isDark ? 0.65 : 0.94,
                  ),
                },
              }}
            >
              {copiedAnalytics ? (
                <Check {...ICON_SM} aria-hidden />
              ) : (
                <Copy {...ICON_SM} aria-hidden />
              )}
            </IconButton>
          </Stack>
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={onCreateLink}
          sx={{
            py: 1.25,
            fontWeight: 600,
            borderRadius: `${radiusTokens.md}px`,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: ctaTextColor,
            boxShadow: `0 2px 14px rgba(0,0,0,${isDark ? 0.26 : 0.18})`,
            transition:
              "transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease",
            "&:hover": {
              boxShadow: `0 4px 20px rgba(0,0,0,${isDark ? 0.34 : 0.24})`,
              opacity: 0.93,
              transform: "translateY(-1px)",
            },
            "&:active": { transform: "translateY(0)" },
          }}
        >
          {t("publicAnalytics.linkInfo.shortenAnother")}
        </Button>
      </Stack>
    </Box>
  );
}
