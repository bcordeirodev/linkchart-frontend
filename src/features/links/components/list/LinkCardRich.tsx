"use client";
import { ExternalLink } from "lucide-react";
import { alpha, Box, Chip, Stack, Tooltip, Typography } from "@mui/material";
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
import {
  linksRadius,
  getDemoChipSx,
  getLinkCardInnerBorderColor,
  getLinkCardShellSx,
  getNewlyCreatedHighlightSx,
  linkCardContentSx,
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
        width: 56,
        height: 56,
        flexShrink: 0,
        borderRadius: `${linksRadius.control}px`,
        overflow: "hidden",
        border: `1px solid ${getLinkCardInnerBorderColor(theme)}`,
        bgcolor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.common.white, 0.05)
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
        <LinkPreviewThumb preview={preview} size={26} />
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
}: LinkCardRichProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { showMessage } = useMessage();
  const { t } = useTranslation("links");

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
        ...getLinkCardShellSx(theme),
        ...(isHighlighted ? getNewlyCreatedHighlightSx(theme) : {}),
      }}
    >
      <Box sx={linkCardContentSx}>
        {/* 1+2 — Identity block: one thumb, title and destination beside it. */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.25}
          sx={{ minWidth: 0 }}
        >
          <LinkIdentityThumb preview={meta?.preview} theme={theme} />

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
              {link.title ||
                meta?.preview?.og_title ||
                link.slug ||
                link.custom_slug ||
                t("list.noTitle")}
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

          {/* Sem chip de cliques aqui: a contagem já aparece — exata, não
              comprimida — no rodapé de métricas, e o CTA Analytics do action bar
              já é a porta de entrada do analytics. O chip repetia os dois. */}
          {link.is_demo ? (
            <Tooltip title={t("list.demo.badgeTooltip")} arrow>
              <Chip
                size="small"
                label={t("list.demo.badge")}
                sx={getDemoChipSx(theme)}
              />
            </Tooltip>
          ) : null}
          {status !== "active" ? (
            <Chip
              size="small"
              label={statusLabel}
              sx={{
                height: 20,
                flexShrink: 0,
                borderRadius: `${linksRadius.chip}px`,
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
