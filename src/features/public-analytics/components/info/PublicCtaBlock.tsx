"use client";
import { useTranslation } from "react-i18next";

import { SignUpCtaCard } from "@/shared/components";

/**
 * Mantido como wrapper fino sobre `SignUpCtaCard` para preservar a API
 * exportada pelo feature `public-analytics` e o agrupamento por contexto
 * (i18n keys de `publicAnalytics.cta.*`).
 *
 * Toda a UI vive em `SignUpCtaCard`, garantindo paridade visual com a CTA da
 * página /shorter.
 */
export function PublicCtaBlock() {
  const { t } = useTranslation("public");
  const features = t("publicAnalytics.cta.features", {
    returnObjects: true,
  }) as string[];

  return (
    <SignUpCtaCard
      title={t("publicAnalytics.cta.title")}
      description={t("publicAnalytics.cta.description")}
      features={features}
      ctaLabel={t("publicAnalytics.cta.button")}
    />
  );
}
