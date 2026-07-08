import { useState, useEffect } from "react";
import { Box, Button, ButtonGroup, Tooltip, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

import { radiusTokens } from "@/lib/theme/designSystem";

import { useLanguage, type SupportedLanguage } from "../hooks/useLanguage";

const LANGUAGES: { code: SupportedLanguage; label: string; abbr: string }[] = [
  { code: "en", label: "English", abbr: "EN" },
  { code: "pt-BR", label: "Português", abbr: "PT" },
];

interface LanguageSelectorProps {
  /**
   * Compact pill style for floating utility bars.
   * Removes the heavy outlined ButtonGroup chrome and renders flag-only chips
   * with a subtle hover/selected treatment.
   */
  compact?: boolean;
}

/**
 * Renders the language switcher (currently `en` and `pt-BR`). Reads the active
 * locale from `useLanguage()` and calls `switchLanguage(code)` on click.
 *
 * Two visual modes: the default outlined `ButtonGroup`, and a `compact` pill
 * (flag-only chips with subtle hover/active treatment) used by floating
 * utility bars where the heavier chrome is too loud.
 */
export function LanguageSelector({ compact = false }: LanguageSelectorProps) {
  const { currentLanguage, switchLanguage } = useLanguage();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (compact) {
    const baseBg = alpha(theme.palette.text.primary, isDark ? 0.04 : 0.05);
    const borderColor = alpha(theme.palette.divider, isDark ? 0.7 : 1);
    const activeBg = alpha(theme.palette.primary.main, isDark ? 0.18 : 0.12);
    const activeBorder = alpha(theme.palette.primary.main, 0.32);

    return (
      <Box
        role="group"
        aria-label="Language"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.25,
          background: baseBg,
          border: `1px solid ${borderColor}`,
          borderRadius: "999px",
          p: 0.25,
          backdropFilter: "blur(8px)",
        }}
      >
        {LANGUAGES.map(({ code, label, abbr }) => {
          const isActive = mounted && currentLanguage === code;
          return (
            <Tooltip key={code} title={label} arrow>
              <Box
                component="button"
                type="button"
                onClick={() => switchLanguage(code)}
                aria-label={label}
                aria-pressed={isActive}
                sx={{
                  // Larger tap target on touch devices (was a fixed 28px).
                  width: { xs: 40, sm: 28 },
                  height: { xs: 40, sm: 28 },
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "999px",
                  background: isActive ? activeBg : "transparent",
                  border: isActive
                    ? `1px solid ${activeBorder}`
                    : "1px solid transparent",
                  color: isActive
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                  cursor: "pointer",
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                  transition:
                    "background 160ms ease, border-color 160ms ease, color 160ms ease",
                  p: 0,
                  "&:hover": {
                    background: isActive
                      ? activeBg
                      : alpha(theme.palette.text.primary, 0.06),
                    color: isActive
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                  },
                }}
              >
                {abbr}
              </Box>
            </Tooltip>
          );
        })}
      </Box>
    );
  }

  return (
    <ButtonGroup
      size="small"
      variant="outlined"
      sx={{ borderRadius: `${radiusTokens.sm}px` }}
    >
      {LANGUAGES.map(({ code, label, abbr }) => (
        <Tooltip key={code} title={label} arrow>
          <Button
            onClick={() => switchLanguage(code)}
            variant={
              mounted && currentLanguage === code ? "contained" : "outlined"
            }
            sx={{
              minWidth: 40,
              // Taller tap target on touch (the small ButtonGroup is ~32px).
              minHeight: { xs: 40, sm: 32 },
              px: 1,
              fontSize: "0.6875rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
            }}
            aria-label={label}
          >
            {abbr}
          </Button>
        </Tooltip>
      ))}
    </ButtonGroup>
  );
}
