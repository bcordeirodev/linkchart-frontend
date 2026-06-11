"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Globe, Link2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { SHORTER_CONTENT_MAX_WIDTH } from "@/features/shorter/constants";
import { radiusTokens } from "@/lib/theme/designSystem";
import { ICON_SM } from "@/lib/theme/iconDefaults";
import {
  getPublicBlockDescriptionSx,
  getPublicBlockTitleSx,
  getPublicElevatedSx,
  getPublicInsetSx,
} from "@/lib/theme/publicPageStyles";
import { PublicBlockIcon } from "@/shared/ui/base";

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

  const mutedUrlColor = alpha(theme.palette.text.primary, isDark ? 0.55 : 0.58);
  const brightUrlColor = alpha(
    theme.palette.text.primary,
    isDark ? 0.95 : 0.92,
  );
  const blockIconColor = alpha(
    theme.palette.common.white,
    isDark ? 0.96 : 0.94,
  );

  return (
    <Box
      sx={{
        ...getPublicElevatedSx(theme),
        maxWidth: SHORTER_CONTENT_MAX_WIDTH,
        mx: "auto",
        px: { xs: 2, md: 2.5 },
        py: { xs: 2, md: 2.25 },
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        gap: { xs: 1.5, sm: 2.5 },
        borderColor: alpha(theme.palette.divider, isDark ? 0.3 : 0.28),
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(90deg, transparent 0%, ${alpha(theme.palette.primary.main, isDark ? 0.22 : 0.16)} 50%, transparent 100%)`,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(circle at 84% 18%, ${alpha(theme.palette.secondary.main, isDark ? 0.05 : 0.03)} 0%, transparent 42%)`,
        },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          alignItems: "flex-start",
          gap: 1.25,
        }}
      >
        <PublicBlockIcon icon={Globe} sx={{ color: blockIconColor }} />
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="h2"
            sx={{ ...getPublicBlockTitleSx(theme), mb: 0.5 }}
          >
            {t("shorter.subdomainPromo.title")}
          </Typography>
          <Typography
            sx={{ ...getPublicBlockDescriptionSx(theme), maxWidth: 480 }}
          >
            {t("shorter.subdomainPromo.description")}
          </Typography>
        </Box>
      </Box>

      <Box
        aria-label={fullUrl}
        sx={{
          ...getPublicInsetSx(theme),
          flexShrink: 0,
          alignSelf: { xs: "stretch", sm: "center" },
          width: { xs: "100%", sm: "auto" },
          maxWidth: "100%",
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          py: 1.25,
          borderRadius: `${radiusTokens.sm}px`,
          bgcolor: alpha(theme.palette.background.paper, isDark ? 0.4 : 0.85),
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
            fontFamily: "monospace",
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
