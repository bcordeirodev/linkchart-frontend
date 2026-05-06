"use client";
import { useState, useEffect } from "react";
import { Box, Divider, Typography } from "@mui/material";
import { ExternalLink, Copy, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

import useClipboard from "@/hooks/useClipboard";
import { ICON_SM } from "@/lib/theme/iconDefaults";

import type { PublicLinkData } from "../../types";

interface LinkHeroCardProps {
  linkData: PublicLinkData;
  onCreateLink: () => void;
}

export function LinkHeroCard({ linkData, onCreateLink }: LinkHeroCardProps) {
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
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* Zone 1 — link identity */}
      <Box sx={{ p: { xs: "20px", md: "24px" }, pb: { xs: "16px", md: "20px" } }}>
        {/* Short URL */}
        <Box
          sx={{
            background: "rgba(99,102,241,0.07)",
            border: "1px solid rgba(99,102,241,0.18)",
            borderRadius: "10px",
            p: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            mb: 1.5,
          }}
        >
          <Typography
            sx={{
              fontFamily: "monospace",
              fontSize: { xs: "1rem", md: "1.125rem" },
              fontWeight: 700,
              color: "#a5b4fc",
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
              background: copiedShort ? "rgba(52,211,153,0.12)" : "rgba(99,102,241,0.15)",
              border: "1px solid",
              borderColor: copiedShort ? "rgba(52,211,153,0.32)" : "rgba(99,102,241,0.32)",
              borderRadius: "6px",
              px: 2,
              py: 0.75,
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: copiedShort ? "#34d399" : "#a5b4fc",
              cursor: "pointer",
              flexShrink: 0,
              transition: "all 0.2s",
              "&:hover": {
                background: copiedShort ? "rgba(52,211,153,0.2)" : "rgba(99,102,241,0.28)",
              },
            }}
          >
            {copiedShort
              ? t("publicAnalytics.saveUrlBanner.copied")
              : t("publicAnalytics.linkInfo.copy")}
          </Box>
        </Box>

        {/* Destination URL — directly below, no divider */}
        <Box
          component="a"
          href={linkData.original_url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "rgba(255,255,255,0.4)",
            textDecoration: "none",
            transition: "color 0.2s",
            "&:hover": { color: "rgba(255,255,255,0.7)" },
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

      <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />

      {/* Zone 2 — utilities */}
      <Box sx={{ p: { xs: "16px 20px", md: "16px 24px" } }}>
        {/* Analytics URL — single compact row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.6875rem",
              fontWeight: 500,
              color: "rgba(255,255,255,0.3)",
              flexShrink: 0,
            }}
          >
            Analytics:
          </Typography>
          <Typography
            sx={{
              fontFamily: "monospace",
              fontSize: "0.6875rem",
              color: "rgba(255,255,255,0.22)",
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
              gap: 0.5,
              background: "transparent",
              border: "none",
              color: copiedAnalytics ? "#34d399" : "rgba(255,255,255,0.28)",
              fontSize: "0.6875rem",
              fontWeight: 600,
              cursor: "pointer",
              flexShrink: 0,
              p: 0,
              transition: "color 0.2s",
              "&:hover": {
                color: copiedAnalytics ? "#34d399" : "rgba(255,255,255,0.55)",
              },
            }}
          >
            {copiedAnalytics ? <Check {...ICON_SM} /> : <Copy {...ICON_SM} />}
          </Box>
        </Box>

        {/* Shorten another link */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            component="button"
            onClick={onCreateLink}
            sx={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "rgba(255,255,255,0.5)",
              fontSize: "0.8125rem",
              fontWeight: 500,
              cursor: "pointer",
              px: 2.5,
              py: 0.75,
              transition: "all 0.2s",
              "&:hover": {
                background: "rgba(255,255,255,0.05)",
                borderColor: "rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.8)",
              },
            }}
          >
            {t("publicAnalytics.linkInfo.shortenAnother")}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
