"use client";

import { Box, Typography } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { radiusTokens } from "@/lib/theme/designSystem";
import { AppIcon } from "@/shared/ui/icons";

/**
 * Short pitch shown above the form only while the user has no bio page yet
 * (`page === null`). Explains what the page is for in one line before
 * asking for a handle — disappears for good once the page exists.
 */
export function BioCreateIntro() {
  const theme = useTheme();
  const { t } = useTranslation("bio");

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
        p: { xs: 2, sm: 2.25 },
        borderRadius: `${radiusTokens.lg}px`,
        border: `1px solid ${alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.24 : 0.2)}`,
        bgcolor: alpha(
          theme.palette.primary.main,
          theme.palette.mode === "dark" ? 0.08 : 0.05,
        ),
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 36,
          height: 36,
          borderRadius: `${radiusTokens.md}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: theme.palette.primary.main,
          bgcolor: alpha(
            theme.palette.primary.main,
            theme.palette.mode === "dark" ? 0.16 : 0.12,
          ),
        }}
      >
        <AppIcon intent="link" size={18} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 700, fontSize: "0.9375rem", mb: 0.25 }}>
          {t("intro.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("intro.description")}
        </Typography>
      </Box>
    </Box>
  );
}

export default BioCreateIntro;
