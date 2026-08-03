"use client";

import {
  Alert,
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useTranslation } from "react-i18next";

import { typographyScale } from "@/lib/theme";
import { radiusTokens } from "@/lib/theme/designSystem";
import useClipboard from "@/shared/hooks/useClipboard";
import { ResponsiveDialog } from "@/shared/ui/feedback";

import type { CreatedApiKey } from "../types";

export interface ApiKeyTokenDialogProps {
  /** The freshly created key, or null when the dialog is closed. */
  createdKey: CreatedApiKey | null;
  /**
   * Called ONLY by the explicit confirm button. The owner must clear
   * `createdKey` here — that unmounts the token from the DOM for good.
   */
  onConfirm: () => void;
}

/**
 * The one-time token reveal — the single moment the full API key exists in
 * the UI. Deliberately hard to dismiss by accident: backdrop clicks and the
 * Escape key are ignored, so the only way out is the explicit "I saved my
 * key" button. Once closed, the token is unrecoverable (the backend never
 * returns it again), which is exactly what the warning inside says.
 */
export function ApiKeyTokenDialog({
  createdKey,
  onConfirm,
}: ApiKeyTokenDialogProps) {
  const { t } = useTranslation("apiKeys");
  const { copied, copy } = useClipboard();

  /**
   * Swallows implicit close attempts (backdrop click / Escape). Closing is
   * exclusively the confirm button's job — losing this dialog by mis-tap
   * means losing the token forever.
   */
  const handleImplicitClose = () => {
    // Intentionally empty: see TSDoc.
  };

  return (
    <ResponsiveDialog
      open={!!createdKey}
      onClose={handleImplicitClose}
      disableEscapeKeyDown
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{t("tokenDialog.title")}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          {t("tokenDialog.intro", { name: createdKey?.name ?? "" })}
        </DialogContentText>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: { xs: 1.25, sm: 1.5 },
            mb: 2,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: `${radiusTokens.md}px`,
            bgcolor: "action.hover",
          }}
        >
          <Box
            component="code"
            sx={{
              fontFamily: typographyScale.code.fontFamily,
              fontSize: "0.8125rem",
              lineHeight: 1.6,
              wordBreak: "break-all",
              flex: 1,
              minWidth: 0,
              userSelect: "all",
            }}
          >
            {createdKey?.token}
          </Box>
          <Tooltip
            title={copied ? t("tokenDialog.copied") : t("tokenDialog.copy")}
          >
            <IconButton
              size="small"
              aria-label={t("tokenDialog.copy")}
              onClick={() => createdKey && copy(createdKey.token)}
              sx={{
                width: { xs: 44, sm: 36 },
                height: { xs: 44, sm: 36 },
                flexShrink: 0,
                color: copied ? "success.main" : "text.secondary",
              }}
            >
              {copied ? (
                <CheckIcon fontSize="small" />
              ) : (
                <ContentCopyIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>

        <Alert severity="warning">{t("tokenDialog.warning")}</Alert>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="contained" onClick={onConfirm} sx={{ minHeight: 44 }}>
          {t("tokenDialog.confirm")}
        </Button>
      </DialogActions>
    </ResponsiveDialog>
  );
}

export default ApiKeyTokenDialog;
