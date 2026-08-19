"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { darkNeutral } from "@/lib/theme/colors/dark";
import { lightNeutral } from "@/lib/theme/colors/light";
import * as CookieConsent from "@/lib/consent/cookieconsent.esm.js";

interface FooterProps {
  /**
   * `"full"` (default) — duas linhas: links de guias/ferramentas/comparações
   * (SEO interno das páginas públicas) + linha legal.
   *
   * `"compact"` — só a linha legal (© + Privacidade/Termos/Suporte/cookies).
   * É a variante do app autenticado: os links de cima são conteúdo de
   * aquisição (guias, comparações com concorrentes) que não serve a quem já
   * está dentro — e, como no `MainLayout` o footer vive fora do `<main>` com
   * scroll, cada pixel dele fica permanentemente visível. A versão cheia
   * ocupava ~32% do viewport mobile.
   */
  variant?: "full" | "compact";
}

/**
 * Rodapé compartilhado entre layouts públicos e autenticados.
 *
 * Público (`full`): linha de guias e comparações agrupados por rótulos +
 * linha de copyright/legal. No mobile, os rótulos dos grupos somem e os
 * links fluem numa única faixa com quebra — mesma informação, metade da
 * altura. App (`compact`): só a linha legal, sempre em uma faixa fina.
 * Inclui botão de gerenciamento de cookies (LGPD art. 18 — revogação fácil).
 *
 * Cor vem da rampa de texto do tema (`text.secondary` para links e ©, o
 * degrau `tertiary` para os rótulos de grupo), não de alphas ad-hoc — o
 * rodapé continua discreto, mas legível a 12px nos dois temas.
 */
export function Footer({ variant = "full" }: FooterProps) {
  const theme = useTheme();
  const { t } = useTranslation("common");
  const isDark = theme.palette.mode === "dark";
  const neutral = isDark ? darkNeutral : lightNeutral;
  // Links do rodapé em `text.secondary` (0.68 dark / 0.66 light), não num
  // alpha ad-hoc: a 12px, o antigo 0.5 do dark caía em ~4,3:1 sobre o canvas
  // — abaixo do piso de 4,5:1 para texto normal, justamente em links legais
  // (privacidade, termos, revogação de cookies) que precisam ser
  // encontráveis. `text.secondary` sobe para ~7:1 e continua um degrau
  // claro abaixo do corpo, então o rodapé segue discreto.
  const linkColor = theme.palette.text.secondary;
  const linkHover = theme.palette.text.primary;
  // Rótulos de grupo (eyebrow de 11px): o degrau `tertiary` da rampa — um
  // degrau abaixo dos links, que é a hierarquia que os alphas 0.35/0.42
  // buscavam, sem cair no território ilegível de `text.disabled`. Só
  // aparecem na variante `full` (`PublicLayout`), que hoje é dark-only:
  // sobre o canvas #0B0D12 o 0.52 rende ~5:1.
  //
  // O © NÃO usa este degrau — ele renderiza também no `compact` da área
  // logada, onde o tema claro é possível, e ali `tertiary` (0.50 sobre
  // #EAEDF2) cairia para ~3,5:1. Como é par dos links legais ao lado
  // (mesmo tamanho, mesma faixa), fica em `text.secondary` com eles.
  const groupLabelColor = neutral.text.tertiary;
  const currentYear = new Date().getFullYear();
  const isCompact = variant === "compact";

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

  /**
   * Cluster de links com rótulo. No mobile o cluster se dissolve
   * (`display: contents`) para os links fluírem todos numa única faixa com
   * quebra — três grupos empilhados custavam ~3 linhas só de estrutura. No
   * desktop o cluster é indivisível (`nowrap`): quando falta largura, ele
   * quebra inteiro para a linha de baixo, em vez de esfarrapar por dentro.
   */
  const groupSx = {
    display: { xs: "contents", md: "flex" },
    alignItems: "center",
    flexWrap: "nowrap",
    justifyContent: "center",
    columnGap: 1.5,
  } as const;

  /**
   * Rótulo não interativo do cluster (eyebrow minúsculo). Só no desktop —
   * no mobile os grupos se dissolvem e o rótulo viraria um item solto no
   * meio da faixa de links.
   */
  const groupLabelSx = {
    display: { xs: "none", md: "inline" },
    fontSize: "0.6875rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: groupLabelColor,
  } as const;

  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        zIndex: 2,
        mt: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: isCompact ? { xs: 0.75, sm: 0.75 } : { xs: 1.25, sm: 1.25 },
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: { xs: 0.75, sm: 0.5 },
        }}
      >
        {/* Linha 1 — guias e comparações (conteúdo SEO linkado das páginas
            públicas). Fora do app: para usuário logado é ruído de aquisição. */}
        {!isCompact ? (
          <Box
            component="nav"
            aria-label={t("footer.resourcesNavAriaLabel")}
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              columnGap: { xs: 1.5, md: 3 },
              rowGap: 0,
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
              <a href="/guia/link-curto-para-whatsapp">
                {t("footer.guideWhatsapp")}
              </a>
              <a href="/guia/alternativa-ao-bitly">
                {t("footer.guideBitlyAlternative")}
              </a>
            </Box>
            <Box sx={groupSx}>
              <Typography component="span" sx={groupLabelSx}>
                {t("footer.toolsLabel")}
              </Typography>
              <a href="/ferramentas/gerador-utm">{t("footer.toolUtm")}</a>
              <a href="/ferramentas/verificar-link">
                {t("footer.toolChecker")}
              </a>
            </Box>
            <Box sx={groupSx}>
              <Typography component="span" sx={groupLabelSx}>
                {t("footer.comparisonsLabel")}
              </Typography>
              <a href="/comparar/bitly">{t("footer.compareBitly")}</a>
              <a href="/comparar/linktree">{t("footer.compareLinktree")}</a>
              <a href="/comparar/dub">{t("footer.compareDub")}</a>
              <a href="/comparar/short-io">{t("footer.compareShortIo")}</a>
            </Box>
          </Box>
        ) : null}

        {/* Linha 2 — copyright + links legais. Sempre presente: é onde vive o
            acesso à revogação de cookies (LGPD). No compact, © e links dividem
            uma única faixa com quebra em vez de empilhar em coluna. */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isCompact ? "row" : { xs: "column", sm: "row" },
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: isCompact
              ? { xs: "center", sm: "space-between" }
              : "space-between",
            columnGap: { xs: 1.5, sm: 2 },
            rowGap: 0,
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: linkColor,
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
              columnGap: { xs: 1.5, sm: 2.25 },
              rowGap: 0,
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
