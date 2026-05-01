import { Button, ButtonGroup, Tooltip } from "@mui/material";

import { radiusTokens } from "@/lib/theme/designSystem";

import { useLanguage, type SupportedLanguage } from "../hooks/useLanguage";

const LANGUAGES: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "pt-BR", label: "Português", flag: "🇧🇷" },
];

export function LanguageSelector() {
  const { currentLanguage, switchLanguage } = useLanguage();

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
