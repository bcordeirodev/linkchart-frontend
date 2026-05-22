"use client";
import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { CheckCircle2, Copy, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

import { SHORTER_CONTENT_MAX_WIDTH } from "@/features/shorter/constants";
import useClipboard from "@/hooks/useClipboard";
import { ICON_LG, ICON_SM } from "@/lib/theme/iconDefaults";

interface ShorterSuccessStateProps {
  shortUrl: string;
  onReset: () => void;
}

export function ShorterSuccessState({
  shortUrl,
  onReset,
}: ShorterSuccessStateProps) {
  const { t } = useTranslation("public");
  const { copy, copied } = useClipboard({ timeout: 3000 });

  useEffect(() => {
    void copy(shortUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(16,185,129,0.28)",
        borderRadius: "12px",
        p: { xs: "24px", md: "28px 32px" },
        textAlign: "center",
        maxWidth: SHORTER_CONTENT_MAX_WIDTH,
        mx: "auto",
      }}
    >
      {/* Icon + title */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5,
          mb: 2.5,
        }}
      >
        <CheckCircle2 {...ICON_LG} color="#10b981" />
        <Typography
          sx={{ fontSize: "1.125rem", fontWeight: 700, color: "white" }}
        >
          {t("shorter.successTitle")}
        </Typography>
        {copied ? (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.3)",
              borderRadius: "6px",
              px: 1,
              py: 0.375,
            }}
          >
            <Check size={11} color="#10b981" />
            <Typography
              sx={{ fontSize: "0.6875rem", color: "#6ee7b7", fontWeight: 600 }}
            >
              {t("shorter.copiedToClipboard")}
            </Typography>
          </Box>
        ) : null}
      </Box>

      {/* URL row */}
      <Box
        sx={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "8px",
          p: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2.5,
          gap: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: "0.9375rem",
            fontWeight: 700,
            color: "#a5b4fc",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {shortUrl}
        </Typography>
        <Box
          component="button"
          onClick={() => copy(shortUrl)}
          title={t("shorter.copyAgain")}
          sx={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: copied ? "#10b981" : "rgba(255,255,255,0.3)",
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            p: 0.5,
            borderRadius: "4px",
            transition: "color 0.15s",
            "&:hover": { color: "rgba(255,255,255,0.65)" },
          }}
        >
          {copied ? <Check {...ICON_SM} /> : <Copy {...ICON_SM} />}
        </Box>
      </Box>

      {/* Reset */}
      <Box
        component="button"
        onClick={onReset}
        sx={{
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "6px",
          px: 2.5,
          py: 0.75,
          fontSize: "0.75rem",
          color: "rgba(255,255,255,0.4)",
          cursor: "pointer",
          "&:hover": {
            borderColor: "rgba(255,255,255,0.22)",
            color: "rgba(255,255,255,0.65)",
          },
        }}
      >
        {t("shorter.createAnother")}
      </Box>
    </Box>
  );
}
