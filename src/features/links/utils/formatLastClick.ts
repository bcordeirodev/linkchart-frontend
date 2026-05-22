import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  format,
} from "date-fns";
import type { Locale } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import type { TFunction } from "i18next";

/**
 * Compact relative label for link card "last click" (no "about"/"cerca de").
 */
export function formatLastClickLabel(
  lastClickAt: string | null | undefined,
  locale: Locale,
  t: TFunction<"links">,
): string {
  if (!lastClickAt) {
    return t("metrics.neverClicked");
  }

  const date = new Date(lastClickAt);
  if (Number.isNaN(date.getTime())) {
    return t("metrics.neverClicked");
  }

  const now = new Date();
  const minutes = differenceInMinutes(now, date);

  if (minutes < 1) {
    return t("metrics.justNow");
  }

  if (minutes < 60) {
    return t("metrics.minutesAgo", { count: minutes });
  }

  const hours = differenceInHours(now, date);
  if (hours < 24) {
    return t("metrics.hoursAgo", { count: hours });
  }

  const days = differenceInDays(now, date);
  if (days < 7) {
    return t("metrics.daysAgo", { count: days });
  }

  return format(date, locale === ptBR ? "d MMM" : "MMM d", { locale });
}

/** Resolves date-fns locale from i18n language code. */
export function getDateFnsLocale(language: string): Locale {
  return language.startsWith("pt") ? ptBR : enUS;
}
