"use client";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface DeleteConfirmDialogProps {
  open: boolean;
  shortUrl: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** Disables actions while the delete mutation is in flight. */
  confirming?: boolean;
}

export function DeleteConfirmDialog({
  open,
  shortUrl,
  onConfirm,
  onCancel,
  confirming = false,
}: DeleteConfirmDialogProps) {
  const { t } = useTranslation("links");
  const { t: tCommon } = useTranslation("common");

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      disableEscapeKeyDown={confirming}
    >
      <DialogTitle>{t("actions.deleteConfirm")}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t("actions.deleteConfirmDesc")} <strong>{shortUrl}</strong>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onCancel}
          disabled={confirming}
        >
          {tCommon("actions.cancel")}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          autoFocus
          disabled={confirming}
        >
          {tCommon("actions.delete")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteConfirmDialog;
