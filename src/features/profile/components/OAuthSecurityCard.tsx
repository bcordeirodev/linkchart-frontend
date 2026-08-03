"use client";

import { useTranslation } from "react-i18next";
import { Stack, Typography } from "@mui/material";

import { SectionLabel } from "@/shared/ui/base";

import { ProfileMutedBox, ProfileSection } from "./ProfileSection";

/**
 * Read-only security explainer for Auth0 (Google) accounts — replaces
 * `PasswordChangeForm` when `usesOAuthLogin` is true, since those accounts
 * have no local password to change.
 *
 * "Instrumento técnico" (2026-08-03): dropped the `ShieldCheck`/`KeyRound`
 * decorative icons (title icon-chip and inline body icon) — the section
 * heading is a `SectionLabel`, and the note reads fine as plain text inside
 * `ProfileMutedBox`.
 */
export function OAuthSecurityCard() {
  const { t } = useTranslation("profile");

  return (
    <Stack spacing={1.25}>
      <SectionLabel headingLevel={2}>{t("security.oauth.title")}</SectionLabel>
      <ProfileSection>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t("security.oauth.subtitle")}
        </Typography>
        <ProfileMutedBox>
          <Typography variant="body2" color="text.secondary">
            {t("security.oauth.body")}
          </Typography>
        </ProfileMutedBox>
      </ProfileSection>
    </Stack>
  );
}

export default OAuthSecurityCard;
