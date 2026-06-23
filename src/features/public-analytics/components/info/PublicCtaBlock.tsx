"use client";
import { useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import { getPublicFocalSx } from "@/lib/theme/publicPageStyles";
import { SignUpCtaCard } from "@/shared/components";

/** Props for {@link PublicCtaBlock}. */
interface PublicCtaBlockProps {
  /**
   * Copy variant. `"analytics"` (default) uses account-oriented copy after a
   * visitor sees public analytics. `"landing"` uses the neutral "create your
   * free account" framing for the /shorter landing.
   */
  variant?: "analytics" | "landing";
}

/**
 * Mantido como wrapper fino sobre `SignUpCtaCard` para preservar a API
 * exportada pelo feature `public-analytics` e o agrupamento por contexto
 * (i18n keys de `publicAnalytics.cta.*`).
 *
 * Renderiza o card com surface focal. No contexto `analytics` usa copy voltada
 * para organização dos links; no contexto `landing` usa a copy neutra.
 */
export function PublicCtaBlock({ variant = "analytics" }: PublicCtaBlockProps) {
  const { t } = useTranslation("public");
  const theme = useTheme();
  const features = t("publicAnalytics.cta.features", {
    returnObjects: true,
  }) as string[];

  const title =
    variant === "landing"
      ? t("publicAnalytics.cta.title")
      : t("publicAnalytics.cta.unlockTitle");
  const description =
    variant === "landing"
      ? t("publicAnalytics.cta.description")
      : t("publicAnalytics.cta.unlockBody");

  return (
    <SignUpCtaCard
      title={title}
      description={description}
      features={features}
      ctaLabel={t("publicAnalytics.cta.button")}
      sx={getPublicFocalSx(theme)}
    />
  );
}
