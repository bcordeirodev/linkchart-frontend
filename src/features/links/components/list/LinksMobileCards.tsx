"use client";
/**
 * LINKS MOBILE CARDS
 *
 * Optimised card list for narrow viewports. Each card shows:
 * - Favicon, title, status chip and overflow menu in the header row
 * - Destination URL (truncated)
 * - Action zone: click-to-copy short-URL strip (analytics lives on the card body tap)
 * - Compact metrics footer via LinkCardMetrics (variant="compact")
 *
 * The card body only opens analytics once the link has at least one click —
 * mirroring the desktop CTA, which is hidden until then. Copy and the overflow
 * menu stay available either way.
 *
 * Shell styles match the desktop card via `getLinkCardShellSx`.
 */

import { Link2 } from "lucide-react";
import {
  alpha,
  Box,
  Card,
  CardContent,
  Checkbox,
  Typography,
  Chip,
  Stack,
  Tooltip,
  useTheme,
  Skeleton,
} from "@mui/material";
import { memo, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@/shared/hooks";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { LinkCardActionBar } from "./LinkCardActionBar";
import { LinkActionsMenu } from "./LinkActionsMenu";
import { LinkCardMetrics } from "./LinkCardMetrics";
import { LinkTagChips } from "./LinkTagChips";

import {
  getLinkStatus,
  getResolvedStatusColor,
  STATUS_MAP,
} from "../../utils/linkStatus";
import type { LinkStatus } from "../../utils/linkStatus";

import type {
  BatchMetaResponse,
  LinkMeta,
  LinkResponse as Link,
} from "@/types";

import { LinkPreviewThumb } from "./LinkPreviewThumb";
import { useShortUrl } from "@/features/links/hooks/useShortUrl";
import {
  linksRadius,
  getDemoChipSx,
  getLinkCardShellSx,
  getNewlyCreatedHighlightSx,
  getStaggeredEntranceSx,
  linkCardContentSx,
  linkCardListItemMb,
} from "./linksPanelStyles";

const STATUS_LABEL_KEYS = {
  active: "status.active",
  inactive: "status.inactive",
  scheduled: "status.scheduled",
  expired: "status.expired",
} as const satisfies Record<LinkStatus, string>;

interface LinksMobileCardsProps {
  data: Link[];
  loading?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (link: Link) => void;
  meta?: BatchMetaResponse;
  highlightedLinkId?: string | null;
  /** True while the browse list is in multi-select mode — swaps tap-to-open for tap-to-select. */
  selectionMode?: boolean;
  /** Currently selected link ids (as strings), used to render each card's checkbox state. */
  selectedIds?: string[];
  /** Toggles a card's selection; called with `String(link.id)`. */
  onToggleSelect?: (id: string) => void;
  /** True once the 50-link selection cap is reached — disables checkboxes for not-yet-selected cards. */
  selectionMaxReached?: boolean;
}

interface LinkMobileCardProps {
  link: Link;
  onDelete?: (id: string) => void;
  onEdit?: (link: Link) => void;
  meta?: LinkMeta;
  isHighlighted?: boolean;
  selectionMode?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
  selectionDisabled?: boolean;
}

/**
 * Individual mobile card for a single link.
 */
const LinkMobileCard = memo(
  ({
    link,
    onDelete,
    onEdit,
    meta,
    isHighlighted = false,
    selectionMode = false,
    selected = false,
    onToggleSelect,
    selectionDisabled = false,
  }: LinkMobileCardProps) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const { t } = useTranslation("links");

    const shortUrl = useShortUrl(link);
    const displayUrl = shortUrl.replace(/^https?:\/\//, "");

    const linkStatus = getLinkStatus(link);
    const statusColorKey = STATUS_MAP[linkStatus].color;
    const statusColorValue = getResolvedStatusColor(theme, linkStatus);
    const statusLabel = t(STATUS_LABEL_KEYS[linkStatus]);

    // No mobile o corpo do card *é* o botão de estatísticas (não há CTA na
    // linha de ações). Sem clique não há dashboard, então o card deixa de ser
    // alvo de toque — mesma regra do CTA no desktop, sem levar ninguém para uma
    // tela vazia. Copiar e o menu de ações seguem funcionando.
    const hasClicks = (link.clicks ?? 0) > 0;
    const isInteractive = selectionMode || hasClicks;

    /** Navigate to the link's analytics view (card body is the tap target). */
    const goToAnalytics = () => navigate(`/links/analytics/${link.id}`);

    /** Card body tap target: toggles selection in selection mode, opens analytics otherwise. */
    const handleCardActivate = () => {
      if (selectionMode) {
        onToggleSelect?.(String(link.id));
        return;
      }
      if (hasClicks) {
        goToAnalytics();
      }
    };

    /** Keyboard activation mirrors the tap target above. */
    const handleCardKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleCardActivate();
      }
    };

    const truncateUrl = (url: string, maxLength = 48) =>
      url.length <= maxLength ? url : `${url.substring(0, maxLength)}…`;

    return (
      <Card
        id={`link-card-${link.id}`}
        role={selectionMode ? "checkbox" : hasClicks ? "button" : undefined}
        aria-checked={selectionMode ? selected : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        aria-label={
          selectionMode
            ? t("bulk.selectLink", { title: link.title || t("list.noTitle") })
            : hasClicks
              ? t("actions.viewAnalyticsCard", {
                  title: link.title || t("list.noTitle"),
                })
              : undefined
        }
        onClick={isInteractive ? handleCardActivate : undefined}
        onKeyDown={isInteractive ? handleCardKeyDown : undefined}
        sx={{
          mb: linkCardListItemMb,
          cursor: isInteractive ? "pointer" : "default",
          ...getLinkCardShellSx(theme),
          ...(isHighlighted ? getNewlyCreatedHighlightSx(theme) : {}),
        }}
      >
        <CardContent
          sx={{
            ...linkCardContentSx,
            "&:last-child": { pb: linkCardContentSx.py },
          }}
        >
          {/* 1 — Favicon · title · status chip · menu — all in one row */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.75}
            sx={{ mb: 0.375, minWidth: 0 }}
          >
            {selectionMode ? (
              <Checkbox
                checked={selected}
                disabled={!selected && selectionDisabled}
                onChange={() => onToggleSelect?.(String(link.id))}
                onClick={(e) => e.stopPropagation()}
                sx={{ flexShrink: 0, p: 1.125 }}
              />
            ) : (
              <LinkPreviewThumb preview={meta?.preview} size={20} />
            )}
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {link.title || meta?.preview?.og_title || t("list.noTitle")}
            </Typography>
            {/* Sem chip de cliques: a contagem exata já está no rodapé de
                métricas deste mesmo card. */}
            {link.is_demo ? (
              <Tooltip title={t("list.demo.badgeTooltip")} arrow>
                <Chip
                  size="small"
                  label={t("list.demo.badge")}
                  sx={getDemoChipSx(theme)}
                />
              </Tooltip>
            ) : null}
            {linkStatus !== "active" ? (
              <Chip
                size="small"
                label={statusLabel}
                sx={{
                  height: 20,
                  borderRadius: `${linksRadius.chip}px`,
                  fontSize: "0.625rem",
                  fontWeight: 500,
                  flexShrink: 0,
                  bgcolor: alpha(statusColorValue, 0.12),
                  color: statusColorKey,
                  border: `1px solid ${alpha(statusColorValue, 0.22)}`,
                  "& .MuiChip-label": { px: 0.75 },
                }}
              />
            ) : null}
            <Box
              onClick={(e) => e.stopPropagation()}
              sx={{ flexShrink: 0, display: "inline-flex" }}
            >
              <LinkActionsMenu
                onEdit={() => {
                  if (onEdit) {
                    onEdit(link);
                  } else {
                    navigate(`/links/edit/${link.id}`);
                  }
                }}
                onQR={() => navigate(`/links/qr/${link.id}`)}
                onDelete={() => setDeleteDialogOpen(true)}
              />
            </Box>
          </Stack>

          {/* 2 — Destination URL full width */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              fontSize: "0.75rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              mb: link.tags?.length ? 0.5 : 0.75,
            }}
          >
            {truncateUrl(link.original_url)}
          </Typography>

          <LinkTagChips tags={link.tags} sx={{ mb: 0.75 }} />

          <Box onClick={(e) => e.stopPropagation()}>
            <LinkCardActionBar
              shortUrl={shortUrl}
              displayUrl={displayUrl}
              analyticsAccess="card"
              onAnalytics={goToAnalytics}
              sx={{ mb: 0.75 }}
            />
          </Box>

          {/* 3 — Compact metrics footer (shared component) */}
          <LinkCardMetrics link={link} meta={meta} variant="compact" />
        </CardContent>

        {/* Portaled Dialog still bubbles synthetic events through the React
            tree, so stop them here to keep the card's onClick from firing. */}
        <Box onClick={(e) => e.stopPropagation()}>
          <DeleteConfirmDialog
            open={deleteDialogOpen}
            shortUrl={shortUrl}
            onConfirm={() => {
              setDeleteDialogOpen(false);
              if (onDelete) onDelete(String(link.id));
            }}
            onCancel={() => setDeleteDialogOpen(false)}
          />
        </Box>
      </Card>
    );
  },
);

LinkMobileCard.displayName = "LinkMobileCard";

/**
 * Renders a scrollable list of mobile link cards with an inline loading skeleton.
 */
export const LinksMobileCards = memo(
  ({
    data,
    loading,
    onDelete,
    onEdit,
    meta,
    highlightedLinkId = null,
    selectionMode = false,
    selectedIds = [],
    onToggleSelect,
    selectionMaxReached = false,
  }: LinksMobileCardsProps) => {
    const theme = useTheme();
    const { t } = useTranslation("links");

    if (loading) {
      return (
        <Box>
          {[...Array(3)].map((_, index) => (
            <Card
              key={index}
              sx={{ mb: linkCardListItemMb, ...getLinkCardShellSx(theme) }}
            >
              <CardContent sx={linkCardContentSx}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 1 }}
                >
                  <Skeleton variant="rounded" width={20} height={20} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton height={18} width="60%" />
                    <Skeleton height={14} width="85%" />
                  </Box>
                </Stack>
                <Skeleton variant="rounded" height={44} sx={{ mb: 1 }} />
                <Skeleton height={16} width="70%" />
              </CardContent>
            </Card>
          ))}
        </Box>
      );
    }

    if (!data || data.length === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 6, px: 3 }}>
          <Link2
            size={64}
            strokeWidth={1.5}
            style={{ opacity: 0.3, marginBottom: 16 }}
          />
          <Typography variant="h6" sx={{ color: "text.secondary", mb: 1 }}>
            {t("list.empty.title")}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.disabled" }}>
            {t("list.empty.createButton")}
          </Typography>
        </Box>
      );
    }

    return (
      // Mesmo escalonamento de entrada do grid desktop: sem ele os cards do
      // mobile entravam todos no mesmo frame, num bloco só.
      <Box sx={getStaggeredEntranceSx(data.length)}>
        {data.map((link) => {
          const idStr = String(link.id);
          const selected = selectedIds.includes(idStr);

          return (
            <LinkMobileCard
              key={link.id}
              link={link}
              meta={meta?.[idStr]}
              onDelete={onDelete}
              onEdit={onEdit}
              isHighlighted={idStr === highlightedLinkId}
              selectionMode={selectionMode}
              selected={selected}
              onToggleSelect={onToggleSelect}
              selectionDisabled={!selected && selectionMaxReached}
            />
          );
        })}
      </Box>
    );
  },
);

LinksMobileCards.displayName = "LinksMobileCards";

export default LinksMobileCards;
