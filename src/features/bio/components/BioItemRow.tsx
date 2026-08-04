"use client";

import { useState } from "react";
import NextLink from "next/link";
import {
  Avatar,
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
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { typographyScale } from "@/lib/theme";
import { getCardSurfaceSx } from "@/shared/ui/base";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import { AppIcon } from "@/shared/ui/icons";

import { useUpdateBioItem } from "../hooks/useBioItems";
import { getUrlHost } from "../utils/linkHost";

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
 * One row in the bio page's item list, in three zones: identity (destination
 * favicon in a bordered tile with initial fallback, editable label, short
 * URL), the
 * clicks chip — which IS the reference to the underlying link's analytics
 * page, strong blue like every analytics CTA in the app — and the controls
 * (reorder, active toggle, remove). Inactive items dim their identity zone
 * and gain a small "hidden" badge so the OFF state is readable at a glance,
 * not only from the switch position.
 *
 * Label editing and the active toggle each own their mutation locally —
 * reordering and removal are lifted to `BioItemsSection` since they need to
 * reason about the whole list (neighbour positions / the confirmation
 * dialog). On xs the zones stack: identity on top, chip + controls in one
 * bottom row.
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
  const theme = useTheme();
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

  const host = getUrlHost(item.url);
  const initial = (item.label?.trim() || host)[0]?.toUpperCase() ?? "?";

  return (
    <EnhancedPaper
      variant="outlined"
      animated={false}
      sx={{ ...getCardSurfaceSx(theme), mb: 0 }}
    >
      <Box
        sx={{
          p: { xs: 1.5, sm: 1.75 },
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          gap: { xs: 1.25, sm: 1.5 },
        }}
      >
        <Stack
          direction="row"
          spacing={1.25}
          alignItems="center"
          sx={{
            flex: 1,
            minWidth: 0,
            opacity: item.isActive ? 1 : 0.55,
            transition: "opacity 120ms",
          }}
        >
          {/* Tile com borda: favicons costumam ser PNG/ICO transparentes e,
              soltos, "vazam" no fundo escuro do card. A borda + respiro
              internos dão contorno a qualquer ícone, claro ou escuro. */}
          <Avatar
            variant="rounded"
            src={item.faviconUrl ?? undefined}
            slotProps={{ img: { referrerPolicy: "no-referrer" } }}
            sx={{
              width: 32,
              height: 32,
              fontSize: "0.8rem",
              fontWeight: 700,
              bgcolor: "background.default",
              color: "text.secondary",
              border: "1px solid",
              borderColor: "divider",
              flexShrink: 0,
              "& .MuiAvatar-img": { objectFit: "contain", p: "5px" },
            }}
          >
            {initial}
          </Avatar>

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
                {!item.isActive ? (
                  <Chip
                    size="small"
                    variant="outlined"
                    label={t("items.hiddenBadge")}
                    sx={{
                      height: 18,
                      fontSize: "0.6563rem",
                      flexShrink: 0,
                      "& .MuiChip-label": { px: 0.75 },
                    }}
                  />
                ) : null}
              </Box>
            )}
            {/* A própria URL curta já diz o domínio (que pode variar entre
                linhas) — dispensa chip de host separado. Mono: é a URL curta
                do produto, mesmo tratamento de LinkPerformanceTable/
                QuickCreateLinkStrip. */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                mt: 0.25,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontFamily: typographyScale.code.fontFamily,
              }}
            >
              {item.url.replace(/^https?:\/\//, "")}
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={{
            flexShrink: 0,
            justifyContent: { xs: "space-between", sm: "flex-end" },
          }}
        >
          <Tooltip title={t("items.viewStats")}>
            <Chip
              component={NextLink}
              href={`/links/analytics/${item.linkId}`}
              clickable
              color="primary"
              size="small"
              icon={<AppIcon intent="analytics" size={14} />}
              label={t("items.clicksCount", { count: item.clicks })}
              aria-label={t("items.viewStats")}
              sx={{
                fontWeight: 600,
                mr: 0.5,
                "& .MuiChip-icon": { color: "inherit", ml: 0.75 },
              }}
            />
          </Tooltip>

          <IconButton
            size="small"
            aria-label={t("items.moveUp")}
            onClick={onMoveUp}
            disabled={isFirst || isReordering}
          >
            <ArrowUpwardIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton
            size="small"
            aria-label={t("items.moveDown")}
            onClick={onMoveDown}
            disabled={isLast || isReordering}
          >
            <ArrowDownwardIcon sx={{ fontSize: 18 }} />
          </IconButton>

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
        </Stack>
      </Box>
    </EnhancedPaper>
  );
}

export default BioItemRow;
