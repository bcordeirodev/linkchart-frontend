"use client";
import { Box, Typography } from "@mui/material";
import { Copy, Check } from "lucide-react";
import { useNavigate } from "@/shared/hooks";
import { useTranslation } from "react-i18next";

import useClipboard from "@/hooks/useClipboard";
import { ICON_SM } from "@/lib/theme/iconDefaults";

export function SaveAnalyticsUrlBanner() {
  const navigate = useNavigate();
  const { t } = useTranslation("public");
  const analyticsUrl = window.location.href;
  const { copy, copied } = useClipboard({ timeout: 2000 });

  return (
    <Box
      sx={{
        background: "rgba(99,102,241,0.04)",
        border: "1px solid rgba(99,102,241,0.18)",
        borderRadius: "10px",
        p: "16px 20px",
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "rgba(255,255,255,0.6)",
            mb: 0.5,
          }}
        >
          {t("publicAnalytics.saveUrlBanner.title")}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.75rem",
            color: "rgba(255,255,255,0.28)",
            lineHeight: 1.55,
            mb: 2,
          }}
        >
          {t("publicAnalytics.saveUrlBanner.desc")}
        </Typography>

        <Box
          sx={{
            background: "rgba(0,0,0,0.2)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "6px",
            px: 1.5,
            py: 0.875,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography
            sx={{
              fontFamily: "monospace",
              fontSize: "0.6875rem",
              color: "rgba(255,255,255,0.3)",
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
            onClick={() => copy(analyticsUrl)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              background: "transparent",
              border: "none",
              color: copied ? "#34d399" : "rgba(255,255,255,0.3)",
              fontSize: "0.6875rem",
              fontWeight: 600,
              cursor: "pointer",
              flexShrink: 0,
              p: 0,
              transition: "color 0.2s",
              "&:hover": {
                color: copied ? "#34d399" : "rgba(255,255,255,0.55)",
              },
            }}
          >
            {copied ? <Check {...ICON_SM} /> : <Copy {...ICON_SM} />}
            {copied
              ? t("publicAnalytics.saveUrlBanner.copied")
              : t("publicAnalytics.saveUrlBanner.copy")}
          </Box>
        </Box>

        <Typography
          sx={{
            fontSize: "0.6875rem",
            color: "rgba(255,255,255,0.16)",
            mt: 1.25,
            lineHeight: 1.5,
          }}
        >
          {t("publicAnalytics.saveUrlBanner.upgradeTitle")}{" "}
          <Box
            component="span"
            onClick={() => navigate("/sign-up")}
            sx={{
              color: "rgba(165,180,252,0.55)",
              cursor: "pointer",
              "&:hover": { color: "#a5b4fc", textDecoration: "underline" },
            }}
          >
            {t("publicAnalytics.saveUrlBanner.upgradeButton")}
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}
