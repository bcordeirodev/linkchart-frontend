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
}

export function DeleteConfirmDialog({
  open,
  shortUrl,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  const { t } = useTranslation("links");
  const { t: tCommon } = useTranslation("common");

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{t("actions.deleteConfirm")}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t("actions.deleteConfirmDesc")} <strong>{shortUrl}</strong>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onCancel}>
          {tCommon("actions.cancel")}
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm} autoFocus>
          {tCommon("actions.delete")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteConfirmDialog;
