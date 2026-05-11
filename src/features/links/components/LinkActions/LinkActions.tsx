"use client";
import {
  Box,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ClipboardCopy, MoreVertical, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import { useNavigate } from "@/shared/hooks";
import useClipboard from "@/shared/hooks/useClipboard";

import { LinkActionsBackLink } from "./LinkActionsBackLink";
import { LinkActionsTitleRow } from "./LinkActionsTitleRow";
import { LinkActionsViewSwitch, type LinkView } from "./LinkActionsViewSwitch";

export type { LinkView };

export interface LinkActionsProps {
  /** Backend id of the link these actions operate on. */
  linkId: string;
  /** Currently active view (required — no default to avoid silent bugs). */
  currentView: LinkView;
  /** Short URL used for Copy and as subtitle. */
  shortUrl?: string;
  /** Link title shown in the heading; falls back to `shortUrl`. */
  title?: string;
  /** Called after a successful delete; defaults to navigating to `/links`. */
  onDeleteSuccess?: () => void;
}

/**
 * Page-header toolbar shown above every per-link view (Analytics,
 * Edit, QR Code). Provides:
 *
 * - A back link that always returns to the links list (`/links`).
 * - The link's title and short URL.
 * - A segmented control to switch between sibling views.
 * - The primary Copy action.
 * - An overflow menu hosting destructive actions (Delete).
 *
 * Layout is responsive: below the `sm` breakpoint the toolbar
 * collapses into a vertical stack (back+overflow / title / copy /
 * view switch) per the design spec.
 *
 * **Note:** the delete flow intentionally preserves today's behavior
 * (window.confirm + setTimeout placeholder). Replacing it with a
 * real API call and an MUI dialog is tracked as follow-up work — see
 * the design spec § "Out of scope".
 */
export function LinkActions({
  linkId,
  currentView,
  shortUrl,
  title,
  onDeleteSuccess,
}: LinkActionsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { t } = useTranslation("links");
  const { copy } = useClipboard();
  const [loading, setLoading] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const handleCopy = useCallback(() => {
    if (shortUrl) {
      copy(shortUrl);
    }
  }, [shortUrl, copy]);

  const handleOpenMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setMenuAnchor(null);
  }, []);

  const handleDelete = useCallback(async () => {
    setMenuAnchor(null);
    const confirmed = window.confirm(
      `${t("actions.deleteConfirm")}\n${t("actions.deleteConfirmDesc")}`,
    );
    if (!confirmed) {
      return;
    }
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (onDeleteSuccess) {
        onDeleteSuccess();
      } else {
        navigate("/links");
      }
    } catch {
      alert(t("actions.deleteError"));
    } finally {
      setLoading(false);
    }
  }, [navigate, onDeleteSuccess, t]);

  const overflowTrigger = (
    <IconButton
      onClick={handleOpenMenu}
      aria-label={t("actions.more")}
      aria-haspopup="menu"
      aria-expanded={menuAnchor ? true : undefined}
      disabled={loading}
      size="small"
    >
      <MoreVertical {...ICON_MD} />
    </IconButton>
  );

  const copyButton = (
    <Button
      variant="contained"
      onClick={handleCopy}
      startIcon={<ClipboardCopy {...ICON_MD} />}
      disabled={loading || !shortUrl}
      fullWidth={isMobile}
      sx={{ textTransform: "none", fontWeight: 600 }}
    >
      {t("actions.copyLink")}
    </Button>
  );

  return (
    <Box
      sx={{
        py: 2,
        mb: 3,
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <LinkActionsBackLink />
        {isMobile ? overflowTrigger : null}
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 1.5,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <LinkActionsTitleRow title={title} shortUrl={shortUrl} />
        {isMobile ? (
          copyButton
        ) : (
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {copyButton}
            {overflowTrigger}
          </Box>
        )}
      </Box>

      <LinkActionsViewSwitch
        linkId={linkId}
        currentView={currentView}
        fullWidth={isMobile}
      />

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <ListItemIcon sx={{ color: "error.main" }}>
            <Trash2 {...ICON_MD} />
          </ListItemIcon>
          <ListItemText>{t("actions.delete")}</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default LinkActions;
