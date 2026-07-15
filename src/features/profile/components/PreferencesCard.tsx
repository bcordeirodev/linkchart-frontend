"use client";

import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FormControl, FormLabel, MenuItem, Select } from "@mui/material";

import { useLanguage } from "@/lib/i18n/hooks/useLanguage";
import { ICON_MD } from "@/lib/theme/iconDefaults";

import { ProfileSection, ProfileSectionHeader } from "./ProfileSection";

import type { SupportedLanguage } from "@/lib/i18n/hooks/useLanguage";
import type { SelectChangeEvent } from "@mui/material";

/** Languages the app currently ships translations for, in display order. */
const LANGUAGE_OPTIONS: SupportedLanguage[] = ["pt-BR", "en"];

/**
 * Sidebar card exposing the user's language preference.
 *
 * Wraps `useLanguage()`: switching re-renders the app immediately via
 * i18next and persists the choice client-side (cookie + localStorage) so SSR
 * picks it up on the next request — see `useLanguage`'s own docs. There is no
 * backend persistence here; language is treated as a device/browser
 * preference rather than account data (YAGNI until a real need appears).
 */
export function PreferencesCard() {
  const { t } = useTranslation("profile");
  const { currentLanguage, switchLanguage } = useLanguage();

  /** Applies the newly selected language via `switchLanguage`. */
  const handleLanguageChange = (event: SelectChangeEvent) => {
    switchLanguage(event.target.value as SupportedLanguage);
  };

  return (
    <ProfileSection>
      <ProfileSectionHeader
        icon={<Languages {...ICON_MD} />}
        title={t("preferences.title")}
      />
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
  );
}

export default PreferencesCard;
