"use client";

import {
  Box,
  Button,
  Link as MuiLink,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { BarChart3, History } from "lucide-react";
import NextLink from "next/link";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/lib/auth/AuthContext";
import { redirectToAuth0Login } from "@/lib/auth/authNavigation";
import { typographyScale } from "@/lib/theme";
import { ICON_SM } from "@/lib/theme/iconDefaults";
import { getPublicInsetSx, publicHairline } from "@/lib/theme/publicPageStyles";
import { getShortUrl } from "@/lib/utils/shortUrl";
import { SHORTER_CONTENT_MAX_WIDTH } from "@/shared/constants";
import { useRecentGuestLinks } from "../hooks/useRecentGuestLinks";

/** Props for {@link ShorterRecentLinks}. */
interface ShorterRecentLinksProps {
  /**
   * Value that changes when a new guest link is created (e.g. its slug), so
   * the list re-reads localStorage and shows the fresh item immediately.
   */
  refreshToken: string | null;
}

/**
 * "Seus links recentes" — a lista dos links que o visitante anônimo criou
 * neste navegador, cada um com atalho para as estatísticas públicas.
 *
 * Só renderiza para visitantes (usuários logados têm `/links`) e quando há
 * pelo menos um link salvo. Fecha com o gancho de conversão: criar conta
 * para não perder os links — o caminho comprovado de cadastro viral em
 * julho/2026 foi justamente a página de public-analytics.
 */
export function ShorterRecentLinks({ refreshToken }: ShorterRecentLinksProps) {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const { isAuthenticated } = useAuth();
  const links = useRecentGuestLinks(refreshToken);
  const isDark = theme.palette.mode === "dark";

  if (isAuthenticated || links.length === 0) return null;

  return (
    <Box
      component="section"
      aria-label={t("shorter.recent.title")}
      sx={{
        ...getPublicInsetSx(theme),
        maxWidth: SHORTER_CONTENT_MAX_WIDTH,
        mx: "auto",
        p: { xs: 2, sm: 2.5 },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
        <History
          {...ICON_SM}
          aria-hidden
          style={{ color: theme.palette.primary.main, flexShrink: 0 }}
        />
        <Typography
          component="h2"
          sx={{
            fontSize: "0.9375rem",
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          {t("shorter.recent.title")}
        </Typography>
      </Box>
      <Typography
        component="p"
        sx={{
          fontSize: "0.8125rem",
          color: alpha(theme.palette.text.primary, isDark ? 0.72 : 0.7),
          mb: 1.5,
        }}
      >
        {t("shorter.recent.subtitle")}
      </Typography>

      <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
        {links.map((link) => (
          <Box
            component="li"
            key={link.slug}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              py: 1,
              borderTop: `1px solid ${publicHairline(theme, "inset")}`,
              minWidth: 0,
            }}
          >
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <MuiLink
                href={getShortUrl(link.short_url)}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{
                  display: "block",
                  fontFamily: typographyScale.code.fontFamily,
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {getShortUrl(link.short_url)}
              </MuiLink>
              <Typography
                component="span"
                sx={{
                  display: "block",
                  fontSize: "0.75rem",
                  color: alpha(
                    theme.palette.text.primary,
                    isDark ? 0.55 : 0.55,
                  ),
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {link.original_url.replace(/^https?:\/\/(www\.)?/i, "")}
              </Typography>
            </Box>
            <Button
              component={NextLink}
              href={`/public-analytics/${encodeURIComponent(link.slug)}`}
              size="small"
              startIcon={<BarChart3 {...ICON_SM} aria-hidden />}
              sx={{
                flexShrink: 0,
                minHeight: 36,
                px: 1.25,
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              {t("shorter.recent.viewStats")}
            </Button>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { sm: "center" },
          gap: 1,
          pt: 1.5,
          borderTop: `1px solid ${publicHairline(theme, "inset")}`,
        }}
      >
        <Typography
          component="p"
          sx={{
            flex: 1,
            fontSize: "0.8125rem",
            color: alpha(theme.palette.text.primary, isDark ? 0.72 : 0.7),
          }}
        >
          {t("shorter.recent.keepCta")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => redirectToAuth0Login("signup")}
          sx={{
            flexShrink: 0,
            fontWeight: 700,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
          }}
        >
          {t("shorter.recent.keepCtaButton")}
        </Button>
      </Box>
    </Box>
  );
}
