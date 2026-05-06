"use client";
import { useState, useEffect } from "react";
import { Box, Divider, Typography } from "@mui/material";
import { ExternalLink, Copy, Check, Link2 } from "lucide-react";
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
      {/* Header — identity + description */}
      <Box sx={{ p: { xs: "20px", md: "24px" }, pb: { xs: "18px", md: "20px" } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 30,
                height: 30,
                borderRadius: "8px",
                background: "rgba(99,102,241,0.12)",
                border: "1px solid rgba(99,102,241,0.22)",
                flexShrink: 0,
              }}
            >
              <Link2 size={14} strokeWidth={2} color="#a5b4fc" />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.75)",
                  lineHeight: 1.2,
                }}
              >
                Link encurtado
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.6875rem",
                  color: "rgba(255,255,255,0.35)",
                  lineHeight: 1.3,
                  mt: 0.25,
                }}
              >
                Analytics públicos disponíveis
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              background: linkData.is_active
                ? "rgba(16,185,129,0.08)"
                : "rgba(239,68,68,0.08)",
              border: "1px solid",
              borderColor: linkData.is_active
                ? "rgba(16,185,129,0.22)"
                : "rgba(239,68,68,0.22)",
              borderRadius: "5px",
              px: 1,
              py: 0.375,
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: linkData.is_active ? "#34d399" : "#f87171",
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontSize: "0.6875rem",
                fontWeight: 600,
                color: linkData.is_active ? "#34d399" : "#f87171",
              }}
            >
              {linkData.is_active
                ? t("publicAnalytics.metrics.active")
                : t("publicAnalytics.metrics.inactive")}
            </Typography>
          </Box>
        </Box>

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

      {/* Footer — save + action */}
      <Box sx={{ p: { xs: "14px 20px", md: "14px 24px" } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {/* Analytics URL */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              minWidth: 0,
              flex: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.6875rem",
                fontWeight: 500,
                color: "rgba(255,255,255,0.28)",
                flexShrink: 0,
              }}
            >
              Analytics:
            </Typography>
            <Typography
              sx={{
                fontFamily: "monospace",
                fontSize: "0.6875rem",
                color: "rgba(255,255,255,0.18)",
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
                color: copiedAnalytics ? "#34d399" : "rgba(255,255,255,0.25)",
                cursor: "pointer",
                flexShrink: 0,
                p: 0,
                transition: "color 0.2s",
                "&:hover": {
                  color: copiedAnalytics ? "#34d399" : "rgba(255,255,255,0.5)",
                },
              }}
            >
              {copiedAnalytics ? <Check {...ICON_SM} /> : <Copy {...ICON_SM} />}
            </Box>
          </Box>

          {/* Shorten another link */}
          <Box
            component="button"
            onClick={onCreateLink}
            sx={{
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "7px",
              color: "#a5b4fc",
              fontSize: "0.8125rem",
              fontWeight: 600,
              cursor: "pointer",
              px: 2,
              py: 0.625,
              flexShrink: 0,
              transition: "all 0.2s",
              "&:hover": {
                background: "rgba(99,102,241,0.16)",
                borderColor: "rgba(99,102,241,0.35)",
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
