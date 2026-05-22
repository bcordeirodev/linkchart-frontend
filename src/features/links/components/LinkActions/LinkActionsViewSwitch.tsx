"use client";
import { ToggleButton, ToggleButtonGroup, useTheme } from "@mui/material";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BarChart3, Pencil, QrCode } from "lucide-react";

import { useNavigate } from "@/shared/hooks";
import { ICON_MD } from "@/lib/theme/iconDefaults";

/** One of the three sibling views of a single link. */
export type LinkView = "analytics" | "edit" | "qr";

interface LinkActionsViewSwitchProps {
  linkId: string;
  currentView: LinkView;
  /** When true, the group expands to fill its container (used on mobile). */
  fullWidth?: boolean;
}

/**
 * Segmented control that switches between the three sibling views of a
 * link: Analytics, Edit, QR Code. The active toggle carries
 * `aria-current="page"` so screen readers announce the current page.
 *
 * Clicking a toggle immediately navigates; selecting the already-active
 * toggle is a no-op (MUI emits `null` for that case in exclusive mode).
 *
 * @param fullWidth - When true, the group expands to fill its container
 *                    (used on mobile to make the pills divide width evenly).
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
        backgroundColor: theme.palette.action.hover,
        borderRadius: 1.5,
        p: 0.5,
        "& .MuiToggleButton-root": {
          border: 0,
          borderRadius: 1,
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.75rem",
          py: 0.5,
          px: { xs: 1, sm: 1.25 },
          color: theme.palette.text.primary,
          opacity: 0.6,
          gap: 0.75,
          transition: theme.transitions.create(
            ["opacity", "background-color", "box-shadow"],
            { duration: theme.transitions.duration.shortest },
          ),
          "&:hover": {
            opacity: 0.9,
            backgroundColor: "transparent",
          },
          "&.Mui-selected": {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            fontWeight: 700,
            opacity: 1,
            boxShadow: theme.shadows[1],
          },
          "&.Mui-selected:hover": {
            backgroundColor: theme.palette.background.paper,
            opacity: 1,
          },
        },
      }}
    >
      <ToggleButton
        value="analytics"
        aria-current={currentView === "analytics" ? "page" : undefined}
      >
        <BarChart3 {...ICON_MD} />
        {t("actions.analytics")}
      </ToggleButton>
      <ToggleButton
        value="edit"
        aria-current={currentView === "edit" ? "page" : undefined}
      >
        <Pencil {...ICON_MD} />
        {t("actions.edit")}
      </ToggleButton>
      <ToggleButton
        value="qr"
        aria-current={currentView === "qr" ? "page" : undefined}
      >
        <QrCode {...ICON_MD} />
        {t("actions.qrCode")}
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default LinkActionsViewSwitch;
