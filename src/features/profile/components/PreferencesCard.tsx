"use client";

import { useTranslation } from "react-i18next";
import {
  Box,
  Divider,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

import {
  useProfile,
  useUpdateProfile,
} from "@/features/profile/hooks/useProfile";
import { useLanguage } from "@/lib/i18n/hooks/useLanguage";
import { useMessage } from "@/lib/providers/MessageProvider";
import { SectionLabel } from "@/shared/ui/base";

import { ProfileSection } from "./ProfileSection";

import type { SupportedLanguage } from "@/lib/i18n/hooks/useLanguage";
import type { SelectChangeEvent } from "@mui/material";

/** Languages the app currently ships translations for, in display order. */
const LANGUAGE_OPTIONS: SupportedLanguage[] = ["pt-BR", "en"];

/**
 * Card exposing the user's language preference and the weekly click-digest
 * opt-in.
 *
 * Language wraps `useLanguage()`: switching re-renders the app immediately via
 * i18next and persists the choice client-side (cookie + localStorage) so SSR
 * picks it up on the next request — see `useLanguage`'s own docs. There is no
 * backend persistence here; language is treated as a device/browser
 * preference rather than account data (YAGNI until a real need appears).
 *
 * The weekly digest toggle IS account data: it drives
 * `users.weekly_digest_enabled` through `useUpdateProfile()` (PUT /api/profile),
 * the same flag the signed unsubscribe link in the digest email flips — this
 * toggle is the only way back in after an email opt-out.
 *
 * "Instrumento técnico" (2026-08-03): lost the `Languages` icon-chip title in
 * favor of a plain `SectionLabel` above the card.
 */
export function PreferencesCard() {
  const { t } = useTranslation("profile");
  const { currentLanguage, switchLanguage } = useLanguage();
  const { showMessage } = useMessage();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  /** Applies the newly selected language via `switchLanguage`. */
  const handleLanguageChange = (event: SelectChangeEvent) => {
    switchLanguage(event.target.value as SupportedLanguage);
  };

  /**
   * Persists the digest opt-in/opt-out. Sends name/email along because the
   * backend validator requires them on PUT /api/profile; the cache write-back
   * in `useUpdateProfile` keeps the switch in sync with the server truth.
   */
  const handleDigestChange = async (checked: boolean) => {
    if (!profile) {
      return;
    }

    try {
      await updateProfile.mutateAsync({
        name: profile.name,
        email: profile.email,
        weekly_digest_enabled: checked,
      });
      showMessage({
        message: checked
          ? t("preferences.weeklyDigest.enabled")
          : t("preferences.weeklyDigest.disabled"),
        variant: "success",
      });
    } catch {
      showMessage({
        message: t("preferences.weeklyDigest.error"),
        variant: "error",
      });
    }
  };

  const digestChecked = profile?.weekly_digest_enabled ?? true;
  const digestBusy = isLoading || updateProfile.isPending;

  return (
    <Stack spacing={1.25}>
      <SectionLabel headingLevel={2}>{t("preferences.title")}</SectionLabel>
      <ProfileSection>
        <Stack spacing={2.25}>
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

          <Divider />

          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography
                component="label"
                htmlFor="preferences-weekly-digest-switch"
                variant="body2"
                sx={{ display: "block", fontWeight: 600, cursor: "pointer" }}
              >
                {t("preferences.weeklyDigest.label")}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t("preferences.weeklyDigest.description")}
              </Typography>
            </Box>
            <Switch
              id="preferences-weekly-digest-switch"
              checked={digestChecked}
              disabled={digestBusy}
              onChange={(event) =>
                void handleDigestChange(event.target.checked)
              }
              inputProps={{
                "aria-label": t("preferences.weeklyDigest.label"),
              }}
            />
          </Stack>
        </Stack>
      </ProfileSection>
    </Stack>
  );
}

export default PreferencesCard;
