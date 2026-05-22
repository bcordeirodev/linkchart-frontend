"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Globe, Link2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ICON_SM } from "@/lib/theme/iconDefaults";

const PROTOCOL = "https://";
const DOMAIN_SUFFIX = ".linkcharts.com.br";

/**
 * Destaque do subdomínio gratuito na página /shorter (estado idle).
 * Complementa o SignUpCtaCard com um preview visual da URL branded.
 */
export function ShorterSubdomainPromo() {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const isDark = theme.palette.mode === "dark";

  const label = t("shorter.subdomainPromo.exampleLabel");
  const slug = t("shorter.subdomainPromo.exampleSlug");
  const fullUrl = `${PROTOCOL}${label}${DOMAIN_SUFFIX}/${slug}`;

  const surface = alpha(theme.palette.primary.main, isDark ? 0.06 : 0.05);
  const border = alpha(theme.palette.primary.main, isDark ? 0.22 : 0.18);
  const mutedUrlColor = alpha(theme.palette.text.primary, isDark ? 0.55 : 0.58);
  const brightUrlColor = alpha(
    theme.palette.text.primary,
    isDark ? 0.95 : 0.92,
  );

  return (
    <Box
      sx={{
        mt: 2.5,
        maxWidth: 800,
        mx: "auto",
        borderRadius: "12px",
        border: `1px solid ${border}`,
        background: surface,
        px: { xs: 2, md: 2.5 },
        py: { xs: 2, md: 2.25 },
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        gap: { xs: 1.5, sm: 2.5 },
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
          <Box
            sx={{
              color: theme.palette.primary.main,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Globe size={18} aria-hidden />
          </Box>
          <Typography
            component="h3"
            sx={{
              fontSize: "0.875rem",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: alpha(theme.palette.text.primary, isDark ? 0.92 : 0.95),
            }}
          >
            {t("shorter.subdomainPromo.title")}
          </Typography>
        </Box>
        <Typography
          sx={{
            fontSize: "0.8125rem",
            color: alpha(theme.palette.text.primary, isDark ? 0.6 : 0.68),
            lineHeight: 1.55,
            maxWidth: 480,
          }}
        >
          {t("shorter.subdomainPromo.description")}
        </Typography>
      </Box>

      <Box
        aria-label={fullUrl}
        sx={{
          flexShrink: 0,
          alignSelf: { xs: "stretch", sm: "center" },
          width: { xs: "100%", sm: "auto" },
          maxWidth: "100%",
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          py: 1.25,
          borderRadius: "10px",
          border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
          background: alpha(
            theme.palette.background.paper,
            isDark ? 0.35 : 0.9,
          ),
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            color: mutedUrlColor,
          }}
        >
          <Link2 {...ICON_SM} aria-hidden />
        </Box>
        <Typography
          component="p"
          sx={{
            m: 0,
            minWidth: 0,
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize: { xs: "0.8125rem", sm: "0.875rem" },
            letterSpacing: "-0.01em",
            lineHeight: 1.45,
            wordBreak: "break-all",
          }}
        >
          <Box component="span" sx={{ fontWeight: 600, color: mutedUrlColor }}>
            {PROTOCOL}
          </Box>
          <Box component="span" sx={{ fontWeight: 700, color: brightUrlColor }}>
            {label}
          </Box>
          <Box component="span" sx={{ fontWeight: 600, color: mutedUrlColor }}>
            {DOMAIN_SUFFIX}/
          </Box>
          <Box component="span" sx={{ fontWeight: 700, color: brightUrlColor }}>
            {slug}
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}

export default ShorterSubdomainPromo;
