"use client";
/**
 * 🎯 LINKS HEADER ACTIONS
 * Componente de ações para header Links mantendo todas as funcionalidades
 */

import { Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@/shared/hooks";

import {
  elevationLightTokens,
  elevationTokens,
  motionTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";
import { AppIcon } from "@/shared/ui/icons";

interface LinksHeaderActionsProps {
  onCreateNew?: () => void;
}

/**
 * Componente de ações do header Links
 * Mantém toda a funcionalidade do LinksHeader original
 */
export function LinksHeaderActions({ onCreateNew }: LinksHeaderActionsProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslation("links");

  const handleCreateNew = () => {
    if (onCreateNew) {
      onCreateNew();
    } else {
      navigate("/link/create");
    }
  };

  return (
    <Button
      variant="contained"
      size="large"
      startIcon={<AppIcon intent="create" size={20} />}
      onClick={handleCreateNew}
      sx={{
        textTransform: "none",
        fontWeight: 600,
        borderRadius: `${radiusTokens.md}px`,
        backgroundColor: theme.palette.primary.main,
        boxShadow: isDark ? elevationTokens.xs : elevationLightTokens.xs,
        transition: `background-color ${motionTokens.duration.base} ${motionTokens.easing.default}, box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
        "&:hover": {
          backgroundColor: theme.palette.primary.dark,
          boxShadow: isDark ? elevationTokens.sm : elevationLightTokens.sm,
        },
      }}
    >
      {t("list.createNew")}
    </Button>
  );
}

export default LinksHeaderActions;
