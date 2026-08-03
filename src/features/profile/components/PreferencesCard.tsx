"use client";

import { useTranslation } from "react-i18next";
import { FormControl, FormLabel, MenuItem, Select, Stack } from "@mui/material";

import { useLanguage } from "@/lib/i18n/hooks/useLanguage";
import { SectionLabel } from "@/shared/ui/base";

import { ProfileSection } from "./ProfileSection";

import type { SupportedLanguage } from "@/lib/i18n/hooks/useLanguage";
import type { SelectChangeEvent } from "@mui/material";

/** Languages the app currently ships translations for, in display order. */
const LANGUAGE_OPTIONS: SupportedLanguage[] = ["pt-BR", "en"];

/**
 * Card exposing the user's language preference.
 *
 * Wraps `useLanguage()`: switching re-renders the app immediately via
 * i18next and persists the choice client-side (cookie + localStorage) so SSR
 * picks it up on the next request — see `useLanguage`'s own docs. There is no
 * backend persistence here; language is treated as a device/browser
 * preference rather than account data (YAGNI until a real need appears).
 *
 * "Instrumento técnico" (2026-08-03): lost the `Languages` icon-chip title in
 * favor of a plain `SectionLabel` above the card.
 */
export function PreferencesCard() {
  const { t } = useTranslation("profile");
  const { currentLanguage, switchLanguage } = useLanguage();

  /** Applies the newly selected language via `switchLanguage`. */
  const handleLanguageChange = (event: SelectChangeEvent) => {
    switchLanguage(event.target.value as SupportedLanguage);
  };

  return (
    <Stack spacing={1.25}>
      <SectionLabel headingLevel={2}>{t("preferences.title")}</SectionLabel>
      <ProfileSection>
        <FormControl fullWidth size="small">
          <FormLabel
            htmlFor="preferences-language-select"
            sx={{ display: "block", mb: 0.75 }}
          >
            {t("preferences.language")}
          </FormLabel>
          <Select
            id="preferences-language-select"
            value={currentLanguage}
            onChange={handleLanguageChange}
          >
            {LANGUAGE_OPTIONS.map((code) => (
              <MenuItem key={code} value={code}>
                {t(`preferences.languages.${code}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </ProfileSection>
    </Stack>
  );
}

export default PreferencesCard;
