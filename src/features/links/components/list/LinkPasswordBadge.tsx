"use client";
import { Lock } from "lucide-react";
import { Box, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";

interface LinkPasswordBadgeProps {
  /** `has_password` of the link — the badge renders nothing when falsy. */
  hasPassword?: boolean;
}

/**
 * Password-protection indicator for link cards.
 *
 * A discreet lock icon with an i18n tooltip, shown only when the link is
 * password-protected — mirroring `LinkHealthBadge`'s rule of staying silent
 * when there is no signal worth surfacing.
 */
export function LinkPasswordBadge({ hasPassword }: LinkPasswordBadgeProps) {
  const { t } = useTranslation("links");

  if (!hasPassword) {
    return null;
  }

  return (
    <Tooltip title={t("list.passwordBadgeTooltip")} arrow>
      <Box
        role="img"
        aria-label={t("list.passwordBadgeTooltip")}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          flexShrink: 0,
          color: "text.secondary",
          opacity: 0.7,
        }}
      >
        <Lock size={13} strokeWidth={2} aria-hidden />
      </Box>
    </Tooltip>
  );
}
