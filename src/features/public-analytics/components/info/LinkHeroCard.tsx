"use client";
import { useState, useEffect } from "react";
import { Box, Divider, Typography, useTheme, alpha } from "@mui/material";
import { ExternalLink, Copy, Check, Link2, BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";

import useClipboard from "@/hooks/useClipboard";
import { ICON_SM } from "@/lib/theme/iconDefaults";

import type { PublicLinkData } from "../../types";

interface LinkHeroCardProps {
  linkData: PublicLinkData;
  onCreateLink: () => void;
}

export function LinkHeroCard({ linkData, onCreateLink }: LinkHeroCardProps) {
  const theme = useTheme();
  const { copy: copyShort, copied: copiedShort } = useClipboard({
    timeout: 1500,
  });
  const { copy: copyAnalytics, copied: copiedAnalytics } = useClipboard({
    timeout: 2000,
  });
  const { t } = useTranslation("public");
  const [analyticsUrl, setAnalyticsUrl] = useState("");

  useEffect(() => {
    setAnalyticsUrl(window.location.href);
  }, []);

  return (
    <Box
      sx={{
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "16px",
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(90deg, transparent 0%, ${alpha(theme.palette.primary.main, 0.6)} 50%, transparent 100%)`,
        },
      }}
    >
      {/* Header — identity */}
      <Box
        sx={{ p: { xs: "24px", md: "28px" }, pb: { xs: "20px", md: "24px" } }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: alpha(theme.palette.primary.main, 0.12),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
              flexShrink: 0,
            }}
          >
            <Link2
              size={16}
              strokeWidth={2}
              color={theme.palette.primary.light}
            />
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: theme.palette.text.primary,
                lineHeight: 1.2,
              }}
            >
              {t("publicAnalytics.linkInfo.shortenedLink")}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: theme.palette.text.secondary,
                lineHeight: 1.3,
                mt: 0.25,
              }}
            >
              {t("publicAnalytics.linkInfo.publicAnalyticsAvailable")}
            </Typography>
          </Box>
        </Box>

        {/* Short URL — hero element */}
        <Box
          sx={{
            background: alpha(theme.palette.primary.main, 0.08),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.28)}`,
            borderRadius: "12px",
            p: "14px 16px 14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            mb: 2,
            boxShadow: `0 2px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
          }}
        >
          <Typography
            sx={{
              fontFamily: "monospace",
              fontSize: { xs: "1rem", md: "1.125rem" },
              fontWeight: 700,
              color: theme.palette.primary.light,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {linkData.short_url}
          </Typography>
          <Box
            component="button"
            onClick={() => copyShort(linkData.short_url)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              background: copiedShort
                ? theme.palette.success.main
                : theme.palette.primary.main,
              border: "none",
              borderRadius: "8px",
              px: 2,
              py: 0.875,
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "#fff",
              cursor: "pointer",
              flexShrink: 0,
              transition: "all 0.18s",
              boxShadow: copiedShort
                ? `0 2px 10px ${alpha(theme.palette.success.main, 0.35)}`
                : `0 2px 10px ${alpha(theme.palette.primary.main, 0.35)}`,
              "&:hover": {
                opacity: 0.88,
                transform: "translateY(-1px)",
                boxShadow: copiedShort
                  ? `0 4px 16px ${alpha(theme.palette.success.main, 0.45)}`
                  : `0 4px 16px ${alpha(theme.palette.primary.main, 0.45)}`,
              },
              "&:active": { transform: "translateY(0)" },
            }}
          >
            {copiedShort ? <Check size={14} /> : <Copy size={14} />}
            {copiedShort
              ? t("publicAnalytics.saveUrlBanner.copied")
              : t("publicAnalytics.linkInfo.copy")}
          </Box>
        </Box>

        {/* Destination URL */}
        <Box
          component="a"
          href={linkData.original_url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: theme.palette.text.secondary,
            textDecoration: "none",
            transition: "color 0.2s",
            "&:hover": { color: theme.palette.text.primary },
          }}
        >
          <ExternalLink size={13} strokeWidth={1.5} style={{ flexShrink: 0 }} />
          <Typography
            sx={{
              fontFamily: "monospace",
              fontSize: "0.8125rem",
              color: "inherit",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {linkData.original_url}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: theme.palette.divider }} />

      {/* Footer — save + CTA */}
      <Box sx={{ p: { xs: "20px 24px", md: "22px 28px" } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <BarChart3 size={15} color={theme.palette.primary.main} />
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            {t("publicAnalytics.saveUrlBanner.title")}
          </Typography>
        </Box>

        {/* Analytics URL */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            background: alpha(theme.palette.text.primary, 0.04),
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "4px",
            p: "10px 14px",
            mb: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: theme.palette.text.secondary,
              flexShrink: 0,
            }}
          >
            Analytics:
          </Typography>
          <Typography
            sx={{
              fontFamily: "monospace",
              fontSize: "0.8125rem",
              color: theme.palette.text.primary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {analyticsUrl}
          </Typography>
          <Box
            component="button"
            onClick={() => copyAnalytics(analyticsUrl)}
            sx={{
              display: "flex",
              alignItems: "center",
              background: "transparent",
              border: "none",
              color: copiedAnalytics
                ? theme.palette.success.main
                : theme.palette.text.secondary,
              cursor: "pointer",
              flexShrink: 0,
              p: 0.5,
              borderRadius: "4px",
              transition: "color 0.2s",
              "&:hover": {
                color: copiedAnalytics
                  ? theme.palette.success.main
                  : theme.palette.text.primary,
              },
            }}
          >
            {copiedAnalytics ? <Check {...ICON_SM} /> : <Copy {...ICON_SM} />}
          </Box>
        </Box>

        {/* CTA */}
        <Box
          component="button"
          onClick={onCreateLink}
          sx={{
            width: "100%",
            background: theme.palette.primary.main,
            border: "none",
            borderRadius: "10px",
            color: theme.palette.primary.contrastText,
            fontSize: "0.9375rem",
            fontWeight: 600,
            cursor: "pointer",
            px: 2,
            py: 1.25,
            letterSpacing: "0.01em",
            transition: "all 0.18s",
            boxShadow: `0 2px 14px ${alpha(theme.palette.primary.main, 0.3)}`,
            "&:hover": {
              opacity: 0.88,
              transform: "translateY(-1px)",
              boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.45)}`,
            },
            "&:active": { transform: "translateY(0)" },
          }}
        >
          {t("publicAnalytics.linkInfo.shortenAnother")}
        </Box>
      </Box>
    </Box>
  );
}
