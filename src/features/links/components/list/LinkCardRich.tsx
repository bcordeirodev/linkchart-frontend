"use client";
import { BarChart3, Check, Copy, ExternalLink } from "lucide-react";
import { ICON_SM } from "@/lib/theme/iconDefaults";
import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@/shared/hooks";

import { getLinkStatus, STATUS_MAP } from "@/features/links/utils/linkStatus";
import type { LinkStatus } from "@/features/links/utils/linkStatus";
import { useAppDispatch } from "@/lib/store/hooks";
import { showMessage } from "@/lib/store/messageSlice";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import useClipboard from "@/hooks/useClipboard";
import type { LinkMeta, LinkResponse } from "@/types";

import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { LinkActionsMenu } from "./LinkActionsMenu";
import { LinkPreviewThumb } from "./LinkPreviewThumb";
import { getShortUrl } from "@/lib/utils/shortUrl";

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
}

/**
 * Desktop link card with two-zone layout: identity (left) and actions (right).
 *
 * Copy is the primary CTA — contained button in the action panel. Analytics is
 * secondary (outlined). Metrics, sparkline, and trend are intentionally omitted;
 * users who want them navigate to the per-link analytics page.
 */
export function LinkCardRich({ link, meta, onDelete }: LinkCardRichProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation("links");
  const { copied, copy } = useClipboard({ timeout: 1500 });
  const shortUrl = getShortUrl(link.slug);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleConfirmDelete = useCallback(async () => {
    setDeleteDialogOpen(false);
    try {
      await onDelete(String(link.id));
    } catch {
      dispatch(
        showMessage({ message: "Erro ao excluir o link.", variant: "error" }),
      );
    }
  }, [link.id, onDelete, dispatch]);

  const status = getLinkStatus(link);
  const { color: statusColor } = STATUS_MAP[status];
  const statusLabel = t(STATUS_LABEL_KEYS[status]);

  return (
    <EnhancedPaper
      sx={{
        borderRadius: "12px",
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: 4 },
        display: "flex",
      }}
    >
      {/* Left zone — identity */}
      <Stack
        spacing={0.75}
        justifyContent="center"
        sx={{ flex: 1, minWidth: 0, py: 2, px: 2.5 }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <LinkPreviewThumb preview={meta?.preview} size={20} />
          <Typography
            variant="body1"
            sx={{
              fontWeight: 700,
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {link.title || t("list.noTitle")}
          </Typography>
          <Chip
            size="small"
            label={statusLabel}
            sx={{
              bgcolor: `${statusColor}22`,
              color: statusColor,
              border: `1px solid ${statusColor}44`,
              fontWeight: 600,
              fontSize: "0.7rem",
              height: 20,
              borderRadius: "6px",
              ml: "auto",
              flexShrink: 0,
            }}
          />
        </Stack>

        <Stack direction="row" spacing={0.75} alignItems="center">
          <ExternalLink
            size={13}
            strokeWidth={1.5}
            style={{ flexShrink: 0, opacity: 0.4 }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={link.original_url}
          >
            {link.original_url}
          </Typography>
        </Stack>
      </Stack>

      <Divider orientation="vertical" flexItem />

      {/* Right zone — actions */}
      <Stack
        spacing={1}
        sx={{
          width: 176,
          flexShrink: 0,
          py: 2,
          px: 1.5,
          bgcolor: "action.hover",
        }}
      >
        <Tooltip
          title={copied ? t("actions.copySuccess") : t("actions.copyLink")}
        >
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="medium"
            startIcon={
              copied ? (
                <Check size={15} strokeWidth={2} />
              ) : (
                <Copy size={15} strokeWidth={2} />
              )
            }
            onClick={() => copy(shortUrl)}
            sx={{
              textTransform: "none",
              fontFamily: copied ? "inherit" : "monospace",
              fontSize: "0.8rem",
              fontWeight: 600,
              boxShadow: "none",
              transition: "background-color 0.15s ease, color 0.15s ease",
              ...(copied && {
                bgcolor: "success.main",
                "&:hover": { bgcolor: "success.dark" },
              }),
              "& .MuiButton-startIcon": { flexShrink: 0 },
            }}
          >
            <Box
              component="span"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {copied ? t("actions.copySuccess") : shortUrl}
            </Box>
          </Button>
        </Tooltip>

        <Button
          variant="outlined"
          color="primary"
          fullWidth
          size="small"
          startIcon={<BarChart3 {...ICON_SM} />}
          onClick={() => navigate(`/links/analytics/${link.id}`)}
          sx={{
            textTransform: "none",
            fontSize: "0.75rem",
            boxShadow: "none",
          }}
        >
          {t("actions.analytics")}
        </Button>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <LinkActionsMenu
            onEdit={() => navigate(`/links/edit/${link.id}`)}
            onQR={() => navigate(`/links/qr/${link.id}`)}
            onDelete={() => setDeleteDialogOpen(true)}
          />
        </Box>
      </Stack>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        shortUrl={shortUrl}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </EnhancedPaper>
  );
}
