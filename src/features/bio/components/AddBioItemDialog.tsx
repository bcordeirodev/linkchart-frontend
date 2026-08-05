"use client";

import { Alert, DialogContent, DialogTitle } from "@mui/material";
import { useTranslation } from "react-i18next";

import { ResponsiveDialog } from "@/shared/ui/feedback";

import { useAddBioItem } from "../hooks/useBioItems";
import { BioLinkPicker } from "./BioLinkPicker";

import type { ID } from "@/types";

export interface AddBioItemDialogProps {
  open: boolean;
  onClose: () => void;
  /** Link ids already on the page — excluded from the pickable list. */
  existingLinkIds: ID[];
  /** True once the page holds `MAX_BIO_ITEMS` — blocks every row's add button. */
  limitReached: boolean;
}

/**
 * Dialog to add one of the authenticated user's existing links as a plain
 * bio page button (`display: "item"`, the default — see `AddBioIconDialog`
 * for the social-icon counterpart). Search/list/empty-state UI lives in
 * `BioLinkPicker`; this component only supplies the title chrome and the
 * `useAddBioItem` mutation `BioLinkPicker` calls per pick.
 */
export function AddBioItemDialog({
  open,
  onClose,
  existingLinkIds,
  limitReached,
}: AddBioItemDialogProps) {
  const { t } = useTranslation("bio");
  const addItem = useAddBioItem();

  return (
    <ResponsiveDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("items.addDialog.title")}</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
      >
        {limitReached ? (
          <Alert severity="info">{t("items.limitReachedNotice")}</Alert>
        ) : null}

        <BioLinkPicker
          existingLinkIds={existingLinkIds}
          limitReached={limitReached}
          onPick={(link) => addItem.mutateAsync({ linkId: link.id })}
        />
      </DialogContent>
    </ResponsiveDialog>
  );
}

export default AddBioItemDialog;
