"use client";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  useTheme,
} from "@mui/material";
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
  /**
   * Number of clicks the link has, when known.
   *
   * With zero clicks the Analytics tab leads to an empty dashboard, so it is
   * disabled (and explains itself on hover) — same rule the `/links` cards
   * apply to their Analytics CTA. `undefined` means "not loaded yet": the tab
   * stays enabled rather than flickering disabled while data arrives.
   */
  clicks?: number;
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
  clicks,
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
          minHeight: { xs: 44, sm: 36 },
          minWidth: fullWidth ? 0 : 92,
          textTransform: "none",
          fontWeight: 500,
          fontSize: "0.8125rem",
          py: 0.5,
          px: { xs: 1.25, sm: 1.5 },
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
      {VIEWS.map(({ id, icon: Icon, labelKey }) => {
        // Never disable the view the user is already on — landing on
        // `/links/analytics/{id}` by direct URL must not leave the control with
        // its selected tab greyed out.
        const disabled =
          id === "analytics" &&
          clicks !== undefined &&
          clicks <= 0 &&
          currentView !== "analytics";

        return (
          <ToggleButton
            key={id}
            value={id}
            disabled={disabled}
            aria-label={t(`actions.${labelKey}`)}
            aria-current={currentView === id ? "page" : undefined}
            sx={
              disabled
                ? {
                    // MUI kills pointer events on a disabled button, which also
                    // kills the hover that explains *why* it is disabled.
                    "&.Mui-disabled": {
                      pointerEvents: "auto",
                      cursor: "not-allowed",
                    },
                  }
                : undefined
            }
          >
            <Tooltip
              title={disabled ? t("actions.analyticsDisabledTooltip") : ""}
              arrow
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
                    // Icon-only on phones (labels clip at 320px); labels from sm up.
                    display: { xs: "none", sm: "inline" },
                    whiteSpace: "nowrap",
                  }}
                >
                  {t(`actions.${labelKey}`)}
                </Box>
              </Box>
            </Tooltip>
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
}

export default LinkActionsViewSwitch;
