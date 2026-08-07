"use client";
import { useTranslation } from "react-i18next";

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
 * No contexto `analytics` usa copy voltada para organização dos links; no
 * contexto `landing` usa a copy neutra.
 *
 * Não passa mais `sx={getPublicFocalSx(theme)}`: aquele override pintava por
 * cima do card um gradiente azul-marinho (o "wash" apontado na auditoria de
 * 2026-08-04) e vencia a superfície translúcida + hairline que o próprio
 * `SignUpCtaCard` agora aplica. Sem o override, a CTA lê como o card do
 * formulário logo acima dela, que é o ponto.
 */
export function PublicCtaBlock({ variant = "analytics" }: PublicCtaBlockProps) {
  const { t } = useTranslation("public");
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
      // Só no contexto `analytics`: esta página é o destino do botão do digest
      // semanal, então parte de quem chega aqui JÁ tem conta e "criar conta
      // grátis" é a porta errada. `/links` é rota protegida — sem sessão, o
      // middleware devolve para /sign-in carregando `returnTo`. Em `landing`
      // não há esse público, e o card segue com uma ação só.
      secondaryLabel={
        variant === "analytics"
          ? t("publicAnalytics.cta.existingAccount")
          : undefined
      }
      secondaryHref={variant === "analytics" ? "/links" : undefined}
    />
  );
}
