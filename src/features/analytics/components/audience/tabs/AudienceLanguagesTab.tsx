"use client";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import type { LanguageData } from "@/types";

import { aggregateLanguagesByFamily } from "../aggregateFamily";
import {
  HorizontalBreakdownBars,
  categoricalBreakdownColor,
  type HorizontalBreakdownItem,
} from "../HorizontalBreakdownBars";

/** Props for the Languages card. */
export interface AudienceLanguagesTabProps {
  /** Raw per-region language breakdown from the audience API. */
  languages: LanguageData[];
}

/**
 * Renders the "Idioma" (Language) card: language entries aggregated by base
 * language — `en-US`, `en-GB` and `en-CA` fold into a single "English" row —
 * as one horizontal-bar list. A leaf user reads "Inglês", not a BCP-47 tag.
 */
export function AudienceLanguagesTab({ languages }: AudienceLanguagesTabProps) {
  const { t, i18n } = useTranslation("analytics");
  const theme = useTheme();

  const families = aggregateLanguagesByFamily(
    languages,
    i18n.language,
    t("audience.extraCharts.others"),
  );
  const items: HorizontalBreakdownItem[] = families.map((family, index) => ({
    key: family.key,
    label: family.label,
    value: family.clicks,
    percentage: family.percentage,
    color: categoricalBreakdownColor(index, theme.palette.mode),
  }));

  return (
    <ChartCard
      title={t("audience.chart.languageDistribution")}
      subtitle={t("audience.chart.tabDescriptions.languages")}
    >
      <HorizontalBreakdownBars items={items} />
    </ChartCard>
  );
}

export default AudienceLanguagesTab;
