"use client";
import { useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import { getPublicFocalSx } from "@/lib/theme/publicPageStyles";
import { SignUpCtaCard } from "@/shared/components";

/** Props for {@link PublicCtaBlock}. */
interface PublicCtaBlockProps {
  /**
   * Copy variant. `"analytics"` (default) uses the value-anchored
   * "this is a free preview / unlock …" framing shown after a visitor sees
   * their own link analytics. `"landing"` uses the neutral "create your free
   * account" framing for the /shorter landing, where nothing has been
   * previewed yet — so the analytics-preview wording would be out of context.
   */
  variant?: "analytics" | "landing";
}

/**
 * Mantido como wrapper fino sobre `SignUpCtaCard` para preservar a API
 * exportada pelo feature `public-analytics` e o agrupamento por contexto
 * (i18n keys de `publicAnalytics.cta.*`).
 *
 * Renderiza o card com surface focal (glow primário). No contexto `analytics`
 * usa copy value-anchored (`unlockTitle` / `unlockBody`); no contexto
 * `landing` usa a copy neutra (`title` / `description`), evitando que o texto
 * de "preview" vaze para a /shorter onde nada foi pré-visualizado ainda.
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
