"use client";

import { useState } from "react";
import {
  Alert,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AtSign } from "lucide-react";
import { useTranslation } from "react-i18next";

import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import {
  getCardSurfaceSx,
  getFilterSegmentSx,
  OverviewMetricRow,
  SectionLabel,
} from "@/shared/ui/base";
import { ResponsiveDialog } from "@/shared/ui/feedback";
import { AppIcon } from "@/shared/ui/icons";

import { MAX_BIO_ITEMS } from "../constants";
import { useBioPerformance } from "../hooks/useBioPerformance";
import { useRemoveBioItem, useReorderBioItems } from "../hooks/useBioItems";
import { AddBioIconDialog } from "./AddBioIconDialog";
import { AddBioItemDialog } from "./AddBioItemDialog";
import { BioItemRow } from "./BioItemRow";

import type { BioItem, BioPage, BioPerformancePeriod } from "../types";

export interface BioItemsSectionProps {
  page: BioPage;
}

/** Every selectable value of the section's period control, in display order. */
const PERIODS: BioPerformancePeriod[] = ["7d", "30d", "90d", "all"];

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
 * Manages the bio page's items: reorderable list (up/down buttons), the
 * add-item entry points (gated by `MAX_BIO_ITEMS`, shared by plain links and
 * social icons alike), and remove-with-confirmation.
 *
 * The header action is one "Adicionar" button revealing a two-option menu
 * (plain link vs. social icon) rather than two side-by-side buttons — two
 * full buttons in `SectionLabel`'s action slot roughly doubles its width,
 * which on a narrow phone competes with the heading text for a row that has
 * no wrap behavior of its own (`SectionLabel` is a single non-wrapping flex
 * row). A single split button keeps that slot's width exactly what it was
 * before this feature, on every viewport.
 *
 * This section is ALSO the page's performance view (2026-08-05): the former
 * `/ DESEMPENHO` panel below it repeated the same links a second time just to
 * attach a click count to each — one list, period-filterable, replaces both.
 * A strip above the list holds the total-clicks metric plus the period
 * segmented control, and each row's clicks chip shows the count within the
 * selected period, all from `GET /api/bio/performance` (`useBioPerformance`)
 * — the `clicks` table, demo-excluded; the one source of truth for every
 * click number on this screen. The management payload's all-time
 * `item.clicks` (same source, "all" window) is only the fallback while a
 * fetch is in flight or after an error, so the chips never blank out.
 *
 * The strip degrades quietly: if the performance query errors, metric and
 * period control simply don't render and the chips stay on their all-time
 * fallback — the list itself must never look broken because a secondary
 * aggregate failed.
 */
export function BioItemsSection({ page }: BioItemsSectionProps) {
  const { t } = useTranslation("bio");
  const theme = useTheme();
  const reorderItems = useReorderBioItems();
  const removeItem = useRemoveBioItem();

  const [addMenuAnchor, setAddMenuAnchor] = useState<HTMLElement | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAddIconOpen, setIsAddIconOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<BioItem | null>(null);

  // "all" (not the old panel's "30d") is the default on purpose: the chips'
  // historical meaning was the link's all-time clicks, and the management
  // payload ships exactly that — so the first paint is already correct and
  // the strip's total converges to the same numbers without a flip.
  const [period, setPeriod] = useState<BioPerformancePeriod>("all");
  const { performance, isError: isPerformanceError } =
    useBioPerformance(period);

  const items = page.items;
  const limitReached = items.length >= MAX_BIO_ITEMS;
  const existingLinkIds = items.map((item) => item.linkId);

  const clicksByItemId = new Map(
    (performance?.items ?? []).map((row) => [row.itemId, row.clicks]),
  );
  /** Period-scoped count for a row's chip; all-time fallback pre-fetch/on error. */
  const clicksFor = (item: BioItem) =>
    clicksByItemId.get(item.id) ?? item.clicks;
  const totalClicks =
    performance?.totalClicks ??
    items.reduce((sum, item) => sum + item.clicks, 0);

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

  const closeAddMenu = () => setAddMenuAnchor(null);

  return (
    <Stack spacing={1.5}>
      <SectionLabel
        headingLevel={2}
        action={
          <>
            <Button
              size="small"
              variant="outlined"
              startIcon={<AppIcon intent="create" size={16} />}
              endIcon={<AppIcon intent="expand" size={14} />}
              onClick={(e) => setAddMenuAnchor(e.currentTarget)}
              disabled={limitReached}
              aria-haspopup="menu"
              aria-expanded={!!addMenuAnchor}
            >
              {t("items.add")}
            </Button>
            <Menu
              anchorEl={addMenuAnchor}
              open={!!addMenuAnchor}
              onClose={closeAddMenu}
            >
              <MenuItem
                onClick={() => {
                  closeAddMenu();
                  setIsAddOpen(true);
                }}
              >
                <ListItemIcon>
                  <AppIcon intent="link" size={16} />
                </ListItemIcon>
                <ListItemText>
                  {t("items.addDialog.menuLinkOption")}
                </ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  closeAddMenu();
                  setIsAddIconOpen(true);
                }}
              >
                <ListItemIcon>
                  <AtSign size={16} aria-hidden />
                </ListItemIcon>
                <ListItemText>
                  {t("items.icon.addDialog.menuIconOption")}
                </ListItemText>
              </MenuItem>
            </Menu>
          </>
        }
      >
        {t("items.heading", { count: items.length, max: MAX_BIO_ITEMS })}
      </SectionLabel>

      {limitReached ? (
        <Alert severity="info">{t("items.limitReachedNotice")}</Alert>
      ) : null}

      {items.length > 0 && !isPerformanceError ? (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems={{ xs: "flex-start", sm: "flex-end" }}
          justifyContent="space-between"
        >
          <OverviewMetricRow
            size="md"
            metrics={[
              {
                label: t("performance.totalClicksLabel"),
                value: totalClicks.toLocaleString(),
              },
            ]}
          />
          <ToggleButtonGroup
            size="small"
            exclusive
            value={period}
            aria-label={t("performance.periodLabel")}
            sx={getFilterSegmentSx(theme, 32)}
            onChange={(_, next: BioPerformancePeriod | null) => {
              if (next) setPeriod(next);
            }}
          >
            {PERIODS.map((value) => (
              <ToggleButton key={value} value={value}>
                {t(`performance.periods.${value}`)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
      ) : null}

      {items.length === 0 ? (
        <EnhancedPaper
          variant="outlined"
          animated={false}
          sx={{
            ...getCardSurfaceSx(theme),
            p: { xs: 2.5, sm: 3 },
            textAlign: "center",
          }}
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
              clicks={clicksFor(item)}
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
        existingLinkIds={existingLinkIds}
        limitReached={limitReached}
      />

      <AddBioIconDialog
        open={isAddIconOpen}
        onClose={() => setIsAddIconOpen(false)}
        existingLinkIds={existingLinkIds}
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
