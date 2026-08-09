"use client";
/**
 * 📄 ENHANCED PAPER - COMPONENTE BASE
 * Paper aprimorado com glass effect e animações
 */

import { Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { createPresetAnimations } from "@/lib/theme";
import {
  elevationLightTokens,
  elevationTokens,
  motionTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";

import type { PaperProps } from "@mui/material";

interface EnhancedPaperProps extends Omit<PaperProps, "variant"> {
  /** Visual preset: `"glass"` (subtle xs elevation, md radius), `"elevated"` (sm elevation, lg radius), `"outlined"` (1px divider, lg radius). Default `"glass"`. */
  variant?: "glass" | "elevated" | "outlined";
  /** When true (default), applies the `fadeIn` mount animation and a `translateY(-1px)` hover lift. */
  animated?: boolean;
}

/**
 * MUI `<Paper>` wrapper that applies design-system elevation/radius tokens and an optional hover-lift animation.
 *
 * Elevation tokens swap between `elevationTokens` (dark) and `elevationLightTokens` (light) based on `theme.palette.mode`.
 */
function EnhancedPaper({
  variant = "glass",
  animated = true,
  children,
  sx,
  ...other
}: EnhancedPaperProps) {
  const theme = useTheme();
  const animations = createPresetAnimations(theme);

  const isDark = theme.palette.mode === "dark";
  const elevation = isDark ? elevationTokens : elevationLightTokens;

  const variantStyles = {
    // `glass`/`elevated` são deliberadamente shadow-only (identidade própria,
    // anterior ao redesign "instrumento técnico"): `border: "none"` anula a
    // hairline global do `MuiPaper` para essas duas variantes, evitando que
    // sombra + borda apareçam empilhadas sem intenção.
    glass: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: `${radiusTokens.md}px`,
      boxShadow: elevation.xs,
      border: "none",
    },
    elevated: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: `${radiusTokens.lg}px`,
      boxShadow: elevation.sm,
      border: "none",
    },
    // `outlined` já é hairline-only e explícito — sem sombra, sem mudança.
    // Confirmado em 2026-08-09 (F5/C3): este variant já usa
    // `theme.palette.background.paper` sólido nos DOIS temas — é exatamente
    // o "paper sólido igual ao card" que C3 pede para o light, e já era
    // assim antes deste fix (dark permanece intocado). O véu translúcido que
    // aparecia em `AnalyticsFilterBar`, `LinksQuickCreate`,
    // `URLShortenerForm`, `ProfileSection`, `BioEditor`/`BioItemsSection`/
    // `BioItemRow`, `SubdomainList`, `ApiKeyList`, `DangerZone` e
    // `ReportsDateFilter` não vem daqui — cada um desses call sites espalha
    // `sx={{ ...getCardSurfaceSx(theme) }}` por cima deste sólido depois de
    // montar o `EnhancedPaper`, revertendo para o véu. Esses call sites estão
    // fora do ownership deste arquivo nesta rodada; nenhuma mudança de código
    // é necessária aqui — só o registro de que este componente já está
    // correto e não é a causa do defeito.
    outlined: {
      backgroundColor: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: `${radiusTokens.lg}px`,
    },
  };

  return (
    <Paper
      sx={
        {
          ...variantStyles[variant],
          ...(animated && animations.fadeIn),
          transition: `transform ${motionTokens.duration.base} ${motionTokens.easing.default}, box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
          "&:hover": animated
            ? {
                transform: "translateY(-1px)",
                boxShadow: elevation.md,
              }
            : {},
          ...sx,
        } as Record<string, unknown>
      }
      {...other}
    >
      {children}
    </Paper>
  );
}

export default EnhancedPaper;
