"use client";

import { Trash2, X } from "lucide-react";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import { ResponsiveDialog } from "@/shared/ui/feedback";

import {
  getLinksBorderColor,
  getLinksCardShadow,
  getLinksPanelSx,
} from "./linksPanelStyles";

interface BulkActionsBarProps {
  /** How many links are currently selected (drives the count copy and the confirm dialog's plural). */
  selectedCount: number;
  /** Layout switch: bottom-fixed bar on phones vs. a sticky bar above the list on larger screens. */
  isMobile: boolean;
  /** True while a bulk action request is in flight — disables every control to avoid a second concurrent request. */
  isRunning: boolean;
  /** True once the selection hit the backend's 50-id cap — shows a caption; new checkboxes are disabled by the caller. */
  isMaxReached: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  /** Called after the user confirms the delete dialog (the bar owns the confirmation step itself). */
  onConfirmDelete: () => void;
  /** Exits selection mode and clears the current selection. */
  onCancel: () => void;
}

/**
 * Sticky action bar shown once at least one link is selected in the browse
 * list — bottom-fixed on mobile (thumb reach), sticky above the list on
 * desktop. Activate/deactivate run immediately (reversible); delete always
 * routes through a confirmation dialog, mirroring the single-link
 * `DeleteConfirmDialog` pattern but with pluralized copy for the selection count.
 */
export function BulkActionsBar({
  selectedCount,
  isMobile,
  isRunning,
  isMaxReached,
  onActivate,
  onDeactivate,
  onConfirmDelete,
  onCancel,
}: BulkActionsBarProps) {
  const theme = useTheme();
  const { t } = useTranslation("links");
  const { t: tCommon } = useTranslation("common");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirm = () => {
    setConfirmOpen(false);
    onConfirmDelete();
  };

  return (
    <>
      <Box
        role="toolbar"
        aria-label={t("bulk.toolbarLabel")}
        sx={
          isMobile
            ? {
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: theme.zIndex.appBar,
                backgroundColor: theme.palette.background.paper,
                borderTop: `1px solid ${getLinksBorderColor(theme)}`,
                boxShadow: getLinksCardShadow(theme, "hover"),
                px: 1.5,
                pt: 1.25,
                pb: "calc(env(safe-area-inset-bottom, 0px) + 10px)",
              }
            : {
                position: "sticky",
                top: 8,
                zIndex: 2,
                mb: 1.5,
                ...getLinksPanelSx(theme),
                px: 2,
                py: 1.25,
              }
        }
      >
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton
              size="small"
              onClick={onCancel}
              disabled={isRunning}
              aria-label={t("bulk.cancel")}
              sx={{ width: 44, height: 44, flexShrink: 0 }}
            >
              <X {...ICON_MD} />
            </IconButton>
            <Typography variant="body2" sx={{ fontWeight: 600, flexShrink: 0 }}>
              {t("bulk.selectedCount", { count: selectedCount })}
            </Typography>
            {isMaxReached ? (
              <Typography
                variant="caption"
                color="warning.main"
                sx={{ ml: "auto", textAlign: "right" }}
              >
                {t("bulk.maxReached")}
              </Typography>
            ) : null}
          </Stack>

          <Stack direction="row" spacing={1} sx={{ "& > button": { flex: 1 } }}>
            <Button
              size="small"
              variant="outlined"
              disabled={isRunning}
              onClick={onActivate}
              sx={{ minHeight: 44 }}
            >
              {t("bulk.activate")}
            </Button>
            <Button
              size="small"
              variant="outlined"
              disabled={isRunning}
              onClick={onDeactivate}
              sx={{ minHeight: 44 }}
            >
              {t("bulk.deactivate")}
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              disabled={isRunning}
              onClick={() => setConfirmOpen(true)}
              startIcon={<Trash2 size={16} strokeWidth={1.75} />}
              sx={{ minHeight: 44 }}
            >
              {t("bulk.delete")}
            </Button>
          </Stack>
        </Stack>
      </Box>

      <ResponsiveDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        disableEscapeKeyDown={isRunning}
      >
        <DialogTitle>
          {t("bulk.confirmTitle", { count: selectedCount })}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("bulk.confirmBody", { count: selectedCount })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setConfirmOpen(false)}
            disabled={isRunning}
          >
            {tCommon("actions.cancel")}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirm}
            autoFocus
            disabled={isRunning}
          >
            {tCommon("actions.delete")}
          </Button>
        </DialogActions>
      </ResponsiveDialog>
    </>
  );
}

export default BulkActionsBar;
