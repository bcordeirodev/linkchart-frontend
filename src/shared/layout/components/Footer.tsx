"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import * as CookieConsent from "@/lib/consent/cookieconsent.esm.js";

/**
 * Rodapé minimalista compartilhado entre layouts públicos e autenticados.
 * 2 linhas discretas: em cima, guias e comparações agrupados por rótulos
 * pequenos; embaixo, copyright à esquerda e links legais à direita.
 * Inclui botão de gerenciamento de cookies (LGPD art. 18 — revogação fácil).
 */
export function Footer() {
  const theme = useTheme();
  const { t } = useTranslation("common");
  const isDark = theme.palette.mode === "dark";
  const linkColor = alpha(theme.palette.text.primary, isDark ? 0.5 : 0.6);
  const linkHover = alpha(theme.palette.text.primary, isDark ? 0.85 : 0.92);
  const currentYear = new Date().getFullYear();

  /** Abre o modal de preferências de cookies do vanilla-cookieconsent. */
  function handleManageCookies() {
    CookieConsent.showPreferences();
  }

  /**
   * Estilo compartilhado dos itens interativos do rodapé (links e botões):
   * mesma tipografia discreta nas duas linhas, com alvo de toque confortável
   * no mobile e altura compacta no desktop.
   */
  const interactiveSx = {
    "& a, & button": {
      fontSize: "0.75rem",
      color: linkColor,
      textDecoration: "none",
      transition: "color 160ms ease",
      background: "none",
      border: "none",
      display: "inline-flex",
      alignItems: "center",
      minHeight: { xs: 40, sm: 28 },
      px: 0.5,
      cursor: "pointer",
      fontFamily: "inherit",
    },
    "& a:hover, & button:hover": { color: linkHover },
  } as const;

  /** Cluster de links com rótulo: inline no desktop, empilhado e centrado no mobile. */
  const groupSx = {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap: { xs: 1.5, sm: 2 },
    rowGap: 0.25,
  } as const;

  /** Rótulo não interativo do cluster (eyebrow minúsculo, mais apagado que os links). */
  const groupLabelSx = {
    fontSize: "0.6875rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: alpha(theme.palette.text.primary, isDark ? 0.35 : 0.42),
  } as const;

  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        zIndex: 2,
        mt: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 1.5, sm: 1.25 },
        borderTop: `1px solid ${alpha(theme.palette.text.primary, isDark ? 0.06 : 0.08)}`,
      }}
    >
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: { xs: 1.25, sm: 0.5 },
        }}
      >
        {/* Linha 1 — guias e comparações (conteúdo SEO linkado de todo o site) */}
        <Box
          component="nav"
          aria-label={t("footer.resourcesNavAriaLabel")}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: { xs: 0.75, md: 2 },
            ...interactiveSx,
          }}
        >
          <Box sx={groupSx}>
            <Typography component="span" sx={groupLabelSx}>
              {t("footer.guidesLabel")}
            </Typography>
            <a href="/guia/cliques-bot-vs-humano">{t("footer.guideBots")}</a>
            <a href="/guia/como-ver-cliques-do-link">
              {t("footer.guideSeeClicks")}
            </a>
            <a href="/guia/rastrear-link-instagram">
              {t("footer.guideInstagram")}
            </a>
          </Box>
          <Box sx={groupSx}>
            <Typography component="span" sx={groupLabelSx}>
              {t("footer.comparisonsLabel")}
            </Typography>
            <a href="/comparar/bitly">{t("footer.compareBitly")}</a>
            <a href="/comparar/dub">{t("footer.compareDub")}</a>
            <a href="/comparar/short-io">{t("footer.compareShortIo")}</a>
          </Box>
        </Box>

        {/* Linha 2 — copyright + links legais */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: { xs: 1, sm: 2 },
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: alpha(theme.palette.text.primary, isDark ? 0.5 : 0.6),
              letterSpacing: "0.01em",
            }}
          >
            © {currentYear} {t("appName")}
          </Typography>

          <Box
            component="nav"
            aria-label={t("footer.cookiesNavAriaLabel")}
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: { xs: 1.5, sm: 2.25 },
              ...interactiveSx,
            }}
          >
            <a href="/privacy">{t("footer.privacy")}</a>
            <a href="/terms">{t("footer.terms")}</a>
            <a href="/support">{t("footer.support")}</a>
            <button type="button" onClick={handleManageCookies}>
              {t("footer.cookies")}
            </button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;
