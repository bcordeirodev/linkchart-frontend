"use client";
import { Box, ToggleButton, ToggleButtonGroup, useTheme } from "@mui/material";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BarChart3, Pencil, QrCode } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useNavigate } from "@/shared/hooks";
import { ICON_SM } from "@/lib/theme/iconDefaults";
import { radiusTokens } from "@/lib/theme/designSystem";

/** One of the three sibling views of a single link. */
export type LinkView = "analytics" | "edit" | "qr";

interface LinkActionsViewSwitchProps {
  linkId: string;
  currentView: LinkView;
  fullWidth?: boolean;
}

const VIEWS: {
  id: LinkView;
  icon: LucideIcon;
  labelKey: "analytics" | "edit" | "qrCode";
}[] = [
  { id: "analytics", icon: BarChart3, labelKey: "analytics" },
  { id: "edit", icon: Pencil, labelKey: "edit" },
  { id: "qr", icon: QrCode, labelKey: "qrCode" },
];

/**
 * Segmented control — Analytics / Editar / QR Code.
 * Neutral, low-contrast styling so it stays secondary to page content.
 */
export function LinkActionsViewSwitch({
  linkId,
  currentView,
  fullWidth = false,
}: LinkActionsViewSwitchProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation("links");

  const viewToPath = useMemo<Record<LinkView, string>>(
    () => ({
      analytics: `/links/analytics/${linkId}`,
      edit: `/links/edit/${linkId}`,
      qr: `/links/qr/${linkId}`,
    }),
    [linkId],
  );

  const handleChange = useCallback(
    (_event: React.MouseEvent<HTMLElement>, view: LinkView | null) => {
      if (!view || view === currentView) {
        return;
      }
      navigate(viewToPath[view]);
    },
    [navigate, viewToPath, currentView],
  );

  return (
    <ToggleButtonGroup
      value={currentView}
      exclusive
      onChange={handleChange}
      size="small"
      fullWidth={fullWidth}
      aria-label={t("actions.viewSwitch")}
      sx={{
        width: fullWidth ? "100%" : "auto",
        gap: 0.375,
        p: 0.375,
        backgroundColor: theme.palette.action.hover,
        borderRadius: `${radiusTokens.md}px`,
        "& .MuiToggleButtonGroup-grouped": {
          margin: 0,
          border: 0,
          borderRadius: `${radiusTokens.sm}px`,
          "&:not(:first-of-type)": {
            marginLeft: 0,
            borderLeft: 0,
          },
        },
        "& .MuiToggleButton-root": {
          flex: fullWidth ? 1 : "0 1 auto",
          minHeight: 34,
          minWidth: fullWidth ? 0 : 84,
          textTransform: "none",
          fontWeight: 500,
          fontSize: "0.75rem",
          py: 0.5,
          px: { xs: 1, sm: 1.25 },
          color: theme.palette.text.secondary,
          transition: theme.transitions.create(
            ["color", "background-color", "box-shadow"],
            { duration: theme.transitions.duration.shortest },
          ),
          "&:hover": {
            backgroundColor: "transparent",
            color: theme.palette.text.primary,
          },
          "&.Mui-selected": {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            fontWeight: 600,
            boxShadow: theme.shadows[1],
          },
          "&.Mui-selected:hover": {
            backgroundColor: theme.palette.background.paper,
          },
        },
      }}
    >
      {VIEWS.map(({ id, icon: Icon, labelKey }) => (
        <ToggleButton
          key={id}
          value={id}
          aria-current={currentView === id ? "page" : undefined}
        >
          <Box
            component="span"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Icon {...ICON_SM} strokeWidth={1.75} />
            <Box
              component="span"
              sx={{
                display: fullWidth ? "inline" : { xs: "none", sm: "inline" },
                whiteSpace: "nowrap",
              }}
            >
              {t(`actions.${labelKey}`)}
            </Box>
          </Box>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

export default LinkActionsViewSwitch;
