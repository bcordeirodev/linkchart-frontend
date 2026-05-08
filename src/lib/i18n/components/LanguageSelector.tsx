import { Box, Button, ButtonGroup, Tooltip, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

import { radiusTokens } from "@/lib/theme/designSystem";

import { useLanguage, type SupportedLanguage } from "../hooks/useLanguage";

const LANGUAGES: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "pt-BR", label: "Português", flag: "🇧🇷" },
];

interface LanguageSelectorProps {
  /**
   * Compact pill style for floating utility bars.
   * Removes the heavy outlined ButtonGroup chrome and renders flag-only chips
   * with a subtle hover/selected treatment.
   */
  compact?: boolean;
}

export function LanguageSelector({ compact = false }: LanguageSelectorProps) {
  const { currentLanguage, switchLanguage } = useLanguage();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

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
        {LANGUAGES.map(({ code, label, flag }) => {
          const isActive = currentLanguage === code;
          return (
            <Tooltip key={code} title={label} arrow>
              <Box
                component="button"
                type="button"
                onClick={() => switchLanguage(code)}
                aria-label={label}
                aria-pressed={isActive}
                sx={{
                  width: 28,
                  height: 28,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "999px",
                  background: isActive ? activeBg : "transparent",
                  border: isActive
                    ? `1px solid ${activeBorder}`
                    : "1px solid transparent",
                  color: theme.palette.text.primary,
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  lineHeight: 1,
                  transition: "background 160ms ease, border-color 160ms ease",
                  p: 0,
                  "&:hover": {
                    background: isActive
                      ? activeBg
                      : alpha(theme.palette.text.primary, 0.06),
                  },
                }}
              >
                {flag}
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
      {LANGUAGES.map(({ code, label, flag }) => (
        <Tooltip key={code} title={label} arrow>
          <Button
            onClick={() => switchLanguage(code)}
            variant={currentLanguage === code ? "contained" : "outlined"}
            sx={{ minWidth: 40, px: 1, fontSize: "1rem" }}
            aria-label={label}
          >
            {flag}
          </Button>
        </Tooltip>
      ))}
    </ButtonGroup>
  );
}
