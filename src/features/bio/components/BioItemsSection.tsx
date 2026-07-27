"use client";

import { useState } from "react";
import {
  Alert,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import { ResponsiveDialog } from "@/shared/ui/feedback";
import { AppIcon } from "@/shared/ui/icons";

import { MAX_BIO_ITEMS } from "../constants";
import { useRemoveBioItem, useReorderBioItems } from "../hooks/useBioItems";
import { AddBioItemDialog } from "./AddBioItemDialog";
import { BioItemRow } from "./BioItemRow";

import type { BioItem, BioPage } from "../types";

export interface BioItemsSectionProps {
  page: BioPage;
}

/** Swaps the positions of the items at `index` and `index + direction`, returning the new id order. */
function swapOrder(
  items: BioItem[],
  index: number,
  direction: 1 | -1,
): number[] {
  const ids = items.map((item) => item.id);
  const target = index + direction;
  [ids[index], ids[target]] = [ids[target]!, ids[index]!];
  return ids;
}

/**
 * Manages the bio page's items: reorderable list (up/down buttons), add
 * dialog gated by `MAX_BIO_ITEMS`, and remove-with-confirmation.
 */
export function BioItemsSection({ page }: BioItemsSectionProps) {
  const { t } = useTranslation("bio");
  const reorderItems = useReorderBioItems();
  const removeItem = useRemoveBioItem();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<BioItem | null>(null);

  const items = page.items;
  const limitReached = items.length >= MAX_BIO_ITEMS;

  const handleMove = (index: number, direction: 1 | -1) => {
    if (reorderItems.isPending) return;
    reorderItems.mutate(swapOrder(items, index, direction));
  };

  const handleConfirmRemove = async () => {
    if (!pendingRemove) return;
    try {
      await removeItem.mutateAsync(pendingRemove.id);
      setPendingRemove(null);
    } catch {
      // Dialog stays open; toast already shown by useRemoveBioItem's onError.
    }
  };

  return (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={1}
      >
        <Typography variant="subtitle2" component="h2">
          {t("items.heading", { count: items.length, max: MAX_BIO_ITEMS })}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AppIcon intent="create" size={16} />}
          onClick={() => setIsAddOpen(true)}
          disabled={limitReached}
        >
          {t("items.add")}
        </Button>
      </Stack>

      {limitReached ? (
        <Alert severity="info">{t("items.limitReachedNotice")}</Alert>
      ) : null}

      {items.length === 0 ? (
        <EnhancedPaper
          variant="outlined"
          sx={{ p: { xs: 2.5, sm: 3 }, textAlign: "center" }}
        >
          <Typography variant="body2" color="text.secondary">
            {t("items.empty")}
          </Typography>
        </EnhancedPaper>
      ) : (
        <Stack spacing={1.25}>
          {items.map((item, index) => (
            <BioItemRow
              key={item.id}
              item={item}
              isFirst={index === 0}
              isLast={index === items.length - 1}
              onMoveUp={() => handleMove(index, -1)}
              onMoveDown={() => handleMove(index, 1)}
              onRequestRemove={setPendingRemove}
              isReordering={reorderItems.isPending}
            />
          ))}
        </Stack>
      )}

      <AddBioItemDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        existingLinkIds={items.map((item) => item.linkId)}
        limitReached={limitReached}
      />

      <ResponsiveDialog
        open={!!pendingRemove}
        onClose={() => setPendingRemove(null)}
      >
        <DialogTitle>{t("items.removeDialog.title")}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontWeight: 600, mb: 1 }}>
            {pendingRemove?.label?.trim() || pendingRemove?.url}
          </DialogContentText>
          <DialogContentText>{t("items.removeDialog.body")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingRemove(null)}>
            {t("items.removeDialog.cancel")}
          </Button>
          <Button
            color="error"
            onClick={() => void handleConfirmRemove()}
            disabled={removeItem.isPending}
          >
            {t("items.removeDialog.confirm")}
          </Button>
        </DialogActions>
      </ResponsiveDialog>
    </Stack>
  );
}

export default BioItemsSection;
