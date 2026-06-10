"use client";
import { useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import { getPublicFocalSx } from "@/lib/theme/publicPageStyles";
import { SignUpCtaCard } from "@/shared/components";

/**
 * Mantido como wrapper fino sobre `SignUpCtaCard` para preservar a API
 * exportada pelo feature `public-analytics` e o agrupamento por contexto
 * (i18n keys de `publicAnalytics.cta.*`).
 *
 * Renderiza o card com surface focal (glow primário) e copy value-anchored
 * (`unlockTitle` / `unlockBody`) que contextualiza o que o usuário desbloqueia
 * ao criar uma conta. O botão de signup e a lista de features ficam em
 * `SignUpCtaCard`, garantindo paridade visual com a CTA da página /shorter.
 */
export function PublicCtaBlock() {
  const { t } = useTranslation("public");
  const theme = useTheme();
  const features = t("publicAnalytics.cta.features", {
    returnObjects: true,
  }) as string[];

  return (
    <SignUpCtaCard
      title={t("publicAnalytics.cta.unlockTitle")}
      description={t("publicAnalytics.cta.unlockBody")}
      features={features}
      ctaLabel={t("publicAnalytics.cta.button")}
      sx={getPublicFocalSx(theme)}
    />
  );
}
