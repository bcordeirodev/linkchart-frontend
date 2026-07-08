"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import * as CookieConsent from "@/lib/consent/cookieconsent.esm.js";

/**
 * Rodapé minimalista compartilhado entre layouts públicos e autenticados.
 * 1 linha: copyright à esquerda, links à direita.
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

  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        zIndex: 2,
        mt: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 2.25 },
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
      }}
    >
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
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
            "& a, & button": {
              fontSize: "0.75rem",
              color: linkColor,
              textDecoration: "none",
              transition: "color 160ms ease",
              background: "none",
              border: "none",
              // Comfortable tap target on phones (was padding:0 → ~16px tall).
              display: "inline-flex",
              alignItems: "center",
              minHeight: 44,
              px: 0.5,
              cursor: "pointer",
              fontFamily: "inherit",
            },
            "& a:hover, & button:hover": { color: linkHover },
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
  );
}

export default Footer;
