"use client";
import { ExternalLink } from "lucide-react";
import { alpha, Box, Chip, Stack, Typography } from "@mui/material";
import { useTheme, type Theme } from "@mui/material/styles";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@/shared/hooks";

import {
  getLinkStatus,
  getResolvedStatusColor,
  STATUS_MAP,
} from "@/features/links/utils/linkStatus";
import type { LinkStatus } from "@/features/links/utils/linkStatus";
import { useMessage } from "@/lib/providers/MessageProvider";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import type { LinkMeta, LinkResponse } from "@/types";

import { LinkCardActionBar } from "./LinkCardActionBar";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { LinkActionsMenu } from "./LinkActionsMenu";
import { LinkCardMetrics } from "./LinkCardMetrics";
import { LinkPreviewThumb } from "./LinkPreviewThumb";
import { useShortUrl } from "@/features/links/hooks/useShortUrl";
import { radiusTokens } from "@/lib/theme/designSystem";
import {
  getLinkCardShellSx,
  getNewlyCreatedHighlightSx,
  getLinkCardListItemMb,
  getLinkCardContentSx,
  type LinkCardDensity,
} from "./linksPanelStyles";

const STATUS_LABEL_KEYS = {
  active: "status.active",
  inactive: "status.inactive",
  scheduled: "status.scheduled",
  expired: "status.expired",
} as const satisfies Record<LinkStatus, string>;

interface LinkCardRichProps {
  link: LinkResponse;
  meta?: LinkMeta;
  onDelete: (id: string) => Promise<void>;
  isHighlighted?: boolean;
  /** Row density; `compact` tightens padding and hides the OG thumbnail. */
  density?: LinkCardDensity;
}

/**
 * Single visual anchor for the card — the OG image cropped square when the
 * destination has one, otherwise the favicon centered on a quiet well. One
 * image per card; title and destination stack beside it.
 */
function LinkIdentityThumb({
  preview,
  theme,
}: {
  preview?: LinkMeta["preview"];
  theme: Theme;
}) {
  const [imgError, setImgError] = useState(false);
  const ogImageUrl = preview?.og_image_url;

  return (
    <Box
      sx={{
        width: 44,
        height: 44,
        flexShrink: 0,
        borderRadius: `${radiusTokens.sm}px`,
        overflow: "hidden",
        border: `1px solid ${theme.palette.divider}`,
        bgcolor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.common.white, 0.03)
            : alpha(theme.palette.common.black, 0.03),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {ogImageUrl && !imgError ? (
        <Box
          component="img"
          src={ogImageUrl}
          alt=""
          onError={() => setImgError(true)}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <LinkPreviewThumb preview={preview} size={22} />
      )}
    </Box>
  );
}

/**
 * Desktop link card — identity row, full-width destination, copy CTA + analytics, metrics.
 */
export function LinkCardRich({
  link,
  meta,
  onDelete,
  isHighlighted = false,
  density = "comfortable",
}: LinkCardRichProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { showMessage } = useMessage();
  const { t } = useTranslation("links");

  const isCompact = density === "compact";

  const shortUrl = useShortUrl(link.slug);
  const displayUrl = shortUrl.replace(/^https?:\/\//, "");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleConfirmDelete = useCallback(async () => {
    setDeleteDialogOpen(false);
    try {
      await onDelete(String(link.id));
    } catch {
      showMessage({ message: t("actions.deleteError"), variant: "error" });
    }
  }, [link.id, onDelete, showMessage, t]);

  const handleDelete = useCallback(() => {
    setDeleteDialogOpen(true);
  }, []);

  const status = getLinkStatus(link);
  const statusColorKey = STATUS_MAP[status].color;
  const statusColorValue = getResolvedStatusColor(theme, status);
  const statusLabel = t(STATUS_LABEL_KEYS[status]);

  return (
    <EnhancedPaper
      id={`link-card-${link.id}`}
      animated={false}
      sx={{
        mb: getLinkCardListItemMb(density),
        ...getLinkCardShellSx(theme),
        ...(isHighlighted ? getNewlyCreatedHighlightSx(theme) : {}),
      }}
    >
      <Box sx={getLinkCardContentSx(density)}>
        {/* 1+2 — Identity block: one thumb, title and destination beside it.
            Compact density skips the thumb and inlines the favicon. */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={isCompact ? 1 : 1.25}
          sx={{ minWidth: 0 }}
        >
          {isCompact ? (
            <LinkPreviewThumb preview={meta?.preview} size={22} />
          ) : (
            <LinkIdentityThumb preview={meta?.preview} theme={theme} />
          )}

          {/* Tight title+URL block — chip and menu live outside it so their
              taller hit areas can't push the URL below the thumb's edge. */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                lineHeight: 1.3,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {link.title || link.slug || link.custom_slug || t("list.noTitle")}
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              spacing={0.75}
              sx={{ mt: 0.25, minWidth: 0 }}
            >
              <ExternalLink
                size={12}
                strokeWidth={1.75}
                style={{ flexShrink: 0, opacity: 0.4 }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  flex: 1,
                  minWidth: 0,
                  fontSize: "0.75rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={link.original_url}
              >
                {link.original_url}
              </Typography>
            </Stack>
          </Box>

          {status !== "active" ? (
            <Chip
              size="small"
              label={statusLabel}
              sx={{
                height: 20,
                flexShrink: 0,
                fontSize: "0.625rem",
                fontWeight: 500,
                bgcolor: alpha(statusColorValue, 0.12),
                color: statusColorKey,
                border: `1px solid ${alpha(statusColorValue, 0.22)}`,
                "& .MuiChip-label": { px: 0.75 },
              }}
            />
          ) : null}
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{ flexShrink: 0, ml: 0.25 }}
          >
            <LinkActionsMenu
              onEdit={() => navigate(`/links/edit/${link.id}`)}
              onQR={() => navigate(`/links/qr/${link.id}`)}
              onDelete={handleDelete}
            />
          </Box>
        </Stack>

        <LinkCardActionBar
          shortUrl={shortUrl}
          displayUrl={displayUrl}
          withTopBorder
          onAnalytics={() => navigate(`/links/analytics/${link.id}`)}
        />

        {/* 4 — Metrics footer (shared component) */}
        <LinkCardMetrics link={link} meta={meta} variant="rich" />
      </Box>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        shortUrl={shortUrl}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </EnhancedPaper>
  );
}
