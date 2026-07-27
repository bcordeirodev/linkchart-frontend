"use client";

import { useState } from "react";
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import { AppIcon } from "@/shared/ui/icons";

import { useUpdateBioItem } from "../hooks/useBioItems";

import type { BioItem } from "../types";

export interface BioItemRowProps {
  item: BioItem;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRequestRemove: (item: BioItem) => void;
  /** True while a reorder request from ANY row is in flight — disables every row's up/down. */
  isReordering: boolean;
}

/**
 * One row in the bio page's item list: editable label, active toggle,
 * click count, reorder buttons and remove. Label editing and the active
 * toggle each own their mutation locally — reordering and removal are
 * lifted to `BioItemsSection` since they need to reason about the whole
 * list (neighbour positions / the confirmation dialog).
 */
export function BioItemRow({
  item,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onRequestRemove,
  isReordering,
}: BioItemRowProps) {
  const { t } = useTranslation("bio");
  const updateItem = useUpdateBioItem();

  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [labelDraft, setLabelDraft] = useState(item.label ?? "");

  const startEditingLabel = () => {
    setLabelDraft(item.label ?? "");
    setIsEditingLabel(true);
  };

  const saveLabel = async () => {
    const trimmed = labelDraft.trim();
    try {
      await updateItem.mutateAsync({ id: item.id, input: { label: trimmed } });
      setIsEditingLabel(false);
    } catch {
      // Toast already shown by useUpdateBioItem's onError; keep editing open.
    }
  };

  const toggleActive = async (checked: boolean) => {
    try {
      await updateItem.mutateAsync({
        id: item.id,
        input: { isActive: checked },
      });
    } catch {
      // Toast already shown by useUpdateBioItem's onError.
    }
  };

  return (
    <EnhancedPaper variant="outlined" sx={{ mb: 0 }}>
      <Box
        sx={{
          p: { xs: 1.5, sm: 1.75 },
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          flexWrap: "wrap",
        }}
      >
        <Stack direction="column" sx={{ flexShrink: 0 }}>
          <IconButton
            size="small"
            aria-label={t("items.moveUp")}
            onClick={onMoveUp}
            disabled={isFirst || isReordering}
          >
            <ArrowUpwardIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            aria-label={t("items.moveDown")}
            onClick={onMoveDown}
            disabled={isLast || isReordering}
          >
            <ArrowDownwardIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {isEditingLabel ? (
            <Stack direction="row" spacing={0.75} alignItems="center">
              <TextField
                autoFocus
                size="small"
                fullWidth
                value={labelDraft}
                onChange={(e) => setLabelDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void saveLabel();
                  if (e.key === "Escape") setIsEditingLabel(false);
                }}
                disabled={updateItem.isPending}
              />
              <IconButton
                size="small"
                color="primary"
                aria-label={t("items.saveLabel")}
                onClick={() => void saveLabel()}
                disabled={updateItem.isPending}
              >
                {updateItem.isPending ? (
                  <CircularProgress size={16} />
                ) : (
                  <CheckIcon fontSize="small" />
                )}
              </IconButton>
              <IconButton
                size="small"
                aria-label={t("items.cancelLabel")}
                onClick={() => setIsEditingLabel(false)}
                disabled={updateItem.isPending}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          ) : (
            <Box
              onClick={startEditingLabel}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                cursor: "pointer",
                minWidth: 0,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label?.trim() || t("items.unlabeled")}
              </Typography>
              <AppIcon
                intent="edit"
                size={14}
                aria-hidden
                style={{ opacity: 0.5, flexShrink: 0 }}
              />
            </Box>
          )}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mt: 0.25,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.url}
          </Typography>
        </Box>

        <Chip
          size="small"
          label={t("items.clicksCount", { count: item.clicks })}
          sx={{ fontWeight: 500, flexShrink: 0 }}
        />

        <Tooltip
          title={item.isActive ? t("items.active") : t("items.inactive")}
        >
          <Switch
            size="small"
            checked={item.isActive}
            onChange={(e) => void toggleActive(e.target.checked)}
            disabled={updateItem.isPending}
          />
        </Tooltip>

        <IconButton
          size="small"
          aria-label={t("items.remove")}
          onClick={() => onRequestRemove(item)}
          sx={{ flexShrink: 0 }}
        >
          <AppIcon intent="delete" size={16} />
        </IconButton>
      </Box>
    </EnhancedPaper>
  );
}

export default BioItemRow;
