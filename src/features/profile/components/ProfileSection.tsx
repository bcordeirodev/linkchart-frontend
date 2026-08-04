"use client";

import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { radiusTokens } from "@/lib/theme/designSystem";
import { typographyScale } from "@/lib/theme";
import { getCardSurfaceSx } from "@/shared/ui/base";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";

import type { ReactNode } from "react";

interface ProfileSectionProps {
  children: ReactNode;
}

/**
 * Card shell shared by every profile settings section — a translucent,
 * hairline-bordered surface (`getCardSurfaceSx`, the same `surfaceOverlayTokens
 * .card` formula as the sibling `/subdomains`, `/api-keys` and `/bio`
 * cards), `animated={false}` since these are static settings panels, not
 * interactive list rows. Pair with a `SectionLabel` rendered *above* it
 * (outside the card) for the "/ LABEL" section heading — the card itself
 * carries no title, matching the pattern established across the
 * "instrumento técnico" redesign.
 */
export function ProfileSection({ children }: ProfileSectionProps) {
  const theme = useTheme();

  return (
    <EnhancedPaper
      variant="outlined"
      animated={false}
      sx={{ ...getCardSurfaceSx(theme), p: { xs: 2.5, sm: 3 } }}
    >
      {children}
    </EnhancedPaper>
  );
}

interface ProfileMutedBoxProps {
  children: ReactNode;
}

/**
 * Neutral inset for a short note or sample inside a `ProfileSection` card
 * (e.g. the OAuth security explainer, the password change security tips) —
 * a subtle background one step darker/lighter than the card so the note
 * reads as a distinct block without becoming its own bordered card.
 */
export function ProfileMutedBox({ children }: ProfileMutedBoxProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: `${radiusTokens.md}px`,
        bgcolor: theme.palette.action.hover,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      {children}
    </Box>
  );
}

interface ProfileMetaRowProps {
  label: string;
  value: ReactNode;
  /** Renders a top hairline instead of the default none (stacks rows inside one card). */
  divider?: boolean;
  /**
   * Renders `value` in the theme's monospace face with tabular numerals —
   * for values that read as *data* rather than prose (e.g. the account's
   * "member since" date in the two-column round of the redesign, per
   * Bruno's gate note that a flat prose line under-served that value).
   */
  mono?: boolean;
}

/**
 * Plain label/value row for account metadata (verification status, member
 * since) — no icon: the "instrumento técnico" ban on decorative icons beside
 * a title extends to any label, not just page/section headings.
 */
export function ProfileMetaRow({
  label,
  value,
  divider = false,
  mono = false,
}: ProfileMetaRowProps) {
  return (
    <Box
      sx={
        divider
          ? { pt: 2, mt: 2, borderTop: 1, borderColor: "divider" }
          : undefined
      }
    >
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          mt: 0.25,
          ...(mono
            ? {
                fontFamily: typographyScale.code.fontFamily,
                fontVariantNumeric: "tabular-nums",
              }
            : undefined),
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default ProfileSection;
