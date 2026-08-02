"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { SHORTER_CONTENT_MAX_WIDTH } from "@/shared/constants";
import {
  getPublicElevatedSx,
  getPublicSectionHeadingSx,
} from "@/lib/theme/publicPageStyles";

/** A resource link: its route and the i18n label key under `resources.links`. */
interface ResourceLink {
  href: string;
  key: string;
}

/** Guides group — informational content pages. */
const GUIDES: readonly ResourceLink[] = [
  { href: "/guia/cliques-bot-vs-humano", key: "guiaBots" },
  { href: "/guia/como-ver-cliques-do-link", key: "guiaVerCliques" },
  { href: "/guia/rastrear-link-instagram", key: "guiaInstagram" },
  { href: "/guia/link-curto-para-whatsapp", key: "guiaWhatsapp" },
];

/** Comparisons group — competitor comparison pages. */
const COMPARISONS: readonly ResourceLink[] = [
  { href: "/comparar/bitly", key: "compareBitly" },
  { href: "/comparar/short-io", key: "compareShortIo" },
  { href: "/comparar/dub", key: "compareDub" },
];

/** Tools group — free standalone tool pages (UTM generator, link checker). */
const TOOLS: readonly ResourceLink[] = [
  { href: "/ferramentas/gerador-utm", key: "toolUtm" },
  { href: "/ferramentas/verificar-link", key: "toolChecker" },
];

/** Props for {@link PublicResourcesLinks}. */
interface PublicResourcesLinksProps {
  /**
   * Visual mode. `"landing"` (default) renders the full homepage section with
   * title and subtitle; `"readAlso"` renders the compact end-of-guide block
   * headed by "Leia também", for cross-linking between guides/comparisons.
   */
  variant?: "landing" | "readAlso";
  /**
   * Route of the page currently being viewed. When set, that link is omitted
   * so the block never links to itself (used by the `readAlso` variant).
   */
  excludeHref?: string;
}

/**
 * "Guias e comparações" section for the homepage/landing — and, via the
 * `readAlso` variant, the "Leia também" cross-links block at the end of each
 * guide/comparison page.
 *
 * Surfaces the guide, comparison and free-tool pages so users can discover
 * them from the main page and, just as importantly, so those pages are
 * internally linked (no orphan pages) — which helps them get crawled and
 * indexed. Copy is i18n-driven; the routes are static. Reuses the public
 * design system so it reads as native to the landing.
 *
 * @param props - see {@link PublicResourcesLinksProps}
 */
export function PublicResourcesLinks({
  variant = "landing",
  excludeHref,
}: PublicResourcesLinksProps = {}) {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const { t: tCommon } = useTranslation("common");
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;
  // Link labels are looked up with a dynamic key; i18next keys are statically
  // typed, so widen the lookup locally without weakening the rest of the app.
  const tstr = t as unknown as (key: string) => string;

  /** Drops the current page's own link so the block never self-references. */
  const withoutCurrent = (links: readonly ResourceLink[]) =>
    excludeHref ? links.filter((link) => link.href !== excludeHref) : links;

  const guides = withoutCurrent(GUIDES);
  const comparisons = withoutCurrent(COMPARISONS);
  const tools = withoutCurrent(TOOLS);

  /** Renders one titled group of resource links. */
  const renderGroup = (title: string, links: readonly ResourceLink[]) => (
    <Box sx={{ ...getPublicElevatedSx(theme), p: { xs: 2, md: 2.5 } }}>
      <Typography
        component="h3"
        sx={{
          fontSize: "0.9375rem",
          fontWeight: 700,
          color: theme.palette.text.primary,
          mb: 1.25,
        }}
      >
        {title}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {links.map((link) => (
          <Box
            key={link.href}
            component={Link}
            href={link.href}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              px: 1.25,
              py: 1,
              borderRadius: 1.5,
              textDecoration: "none",
              color: theme.palette.text.secondary,
              transition: "background 160ms ease, color 160ms ease",
              "&:hover": {
                bgcolor: alpha(primary, isDark ? 0.08 : 0.06),
                color: primary,
              },
            }}
          >
            <Typography component="span" sx={{ fontSize: "0.8125rem" }}>
              {tstr(`resources.links.${link.key}`)}
            </Typography>
            <ArrowRight size={15} style={{ flexShrink: 0 }} />
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box
      component="section"
      aria-labelledby="resources-heading"
      sx={{ maxWidth: SHORTER_CONTENT_MAX_WIDTH, mx: "auto" }}
    >
      <Typography
        id="resources-heading"
        component="h2"
        sx={getPublicSectionHeadingSx(theme)}
      >
        {variant === "readAlso"
          ? tCommon("resources.readAlso")
          : t("resources.sectionTitle")}
      </Typography>
      {variant === "landing" && (
        <Typography
          component="p"
          sx={{
            fontSize: "0.9375rem",
            lineHeight: 1.6,
            color: theme.palette.text.secondary,
            mb: 2.5,
          }}
        >
          {t("resources.subtitle")}
        </Typography>
      )}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(3, 1fr)",
          },
          gap: { xs: 1.5, md: 2 },
        }}
      >
        {renderGroup(t("resources.guidesTitle"), guides)}
        {renderGroup(t("resources.comparisonsTitle"), comparisons)}
        {renderGroup(t("resources.toolsTitle"), tools)}
      </Box>
    </Box>
  );
}

export default PublicResourcesLinks;
