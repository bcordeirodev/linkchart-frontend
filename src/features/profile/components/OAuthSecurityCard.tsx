"use client";

import { KeyRound, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import { Typography } from "@mui/material";

import {
  ProfileMutedBox,
  ProfileSection,
  ProfileSectionHeader,
} from "./ProfileSection";

export function OAuthSecurityCard() {
  const { t } = useTranslation("profile");

  return (
    <ProfileSection>
      <ProfileSectionHeader
        icon={<ShieldCheck {...ICON_MD} />}
        title={t("security.oauth.title")}
        description={t("security.oauth.subtitle")}
      />
      <ProfileMutedBox>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
        >
          <KeyRound {...ICON_MD} style={{ flexShrink: 0, marginTop: 2 }} />
          {t("security.oauth.body")}
        </Typography>
      </ProfileMutedBox>
    </ProfileSection>
  );
}

export default OAuthSecurityCard;
