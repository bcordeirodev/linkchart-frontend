"use client";

import { Box, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

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
 *
 * Light/dark diverge on purpose (fix 2026-08-09, F7): dark keeps
 * `theme.palette.action.hover` exactly as before — it already clears the
 * translucent `ProfileSection` card correctly (white veil lightens further).
 * Light switches from `action.hover` to an explicit
 * `alpha(common.black, 0.04)` — same numeric value MUI's default resolves to
 * today, but pinned locally instead of inherited from the semantic
 * `action.hover` token (que pode derivar sozinho no futuro). O que resolve
 * o F7 de fato é a COMBINAÇÃO: `getCardSurfaceSx` agora devolve
 * `background.paper` sólido no claro (card branco), e este véu de 4% sobre
 * o branco (#EAEBEE) volta a ser um degrau visível — antes eram dois véus
 * escuros empilhados sobre canvas cinza, indistinguíveis.
 */
export function ProfileMutedBox({ children }: ProfileMutedBoxProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: `${radiusTokens.md}px`,
        bgcolor: isDark
          ? theme.palette.action.hover
          : alpha(theme.palette.common.black, 0.04),
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
