"use client";
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { MoreVertical, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { DeleteConfirmDialog } from "@/features/links/components/list/DeleteConfirmDialog";
import { useDeleteLink } from "@/features/links/hooks/useLinks";
import { getShortUrl } from "@/lib/utils/shortUrl";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import { useNavigate } from "@/shared/hooks";

import { LinkActionsBackLink } from "./LinkActionsBackLink";
import { LinkActionsCopyButton } from "./LinkActionsCopyButton";
import { LinkActionsTitleRow } from "./LinkActionsTitleRow";
import { LinkActionsViewSwitch, type LinkView } from "./LinkActionsViewSwitch";

export type { LinkView };

export interface LinkActionsProps {
  linkId: string;
  currentView: LinkView;
  slug?: string;
  shortUrl?: string;
  title?: string;
  /**
   * Click count, when the page already has it. Forwarded to the view switch,
   * which disables the Analytics tab while the link has no clicks to show.
   * Leave undefined when unknown — the tab then stays enabled.
   */
  clicks?: number;
  onDeleteSuccess?: () => void;
}

export function LinkActions({
  linkId,
  currentView,
  slug,
  shortUrl: shortUrlProp,
  title,
  clicks,
  onDeleteSuccess,
}: LinkActionsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { t } = useTranslation("links");
  const deleteLink = useDeleteLink();

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // `shortUrlProp` is the link's own recorded `short_url` (immutable domain,
  // set at creation) — always prefer it over rebuilding from `slug`, which
  // used to derive a URL from whichever subdomain is *currently* active on
  // the account. With multiple subdomains per user those can differ from the
  // domain this particular link actually has.
  const resolvedShortUrl = useMemo(() => {
    if (shortUrlProp) {
      return shortUrlProp;
    }
    if (slug) {
      return getShortUrl(slug);
    }
    return "";
  }, [slug, shortUrlProp]);

  const isDeleting = deleteLink.isPending;

  const handleOpenMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setMenuAnchor(null);
  }, []);

  const handleRequestDelete = useCallback(() => {
    setMenuAnchor(null);
    setDeleteDialogOpen(true);
  }, []);

  const handleCancelDelete = useCallback(() => {
    if (!isDeleting) {
      setDeleteDialogOpen(false);
    }
  }, [isDeleting]);

  const handleConfirmDelete = useCallback(async () => {
    try {
      await deleteLink.mutateAsync(linkId);
      setDeleteDialogOpen(false);
      if (onDeleteSuccess) {
        onDeleteSuccess();
      } else {
        navigate("/links");
      }
    } catch {
      // Toast handled by useDeleteLink
    }
  }, [deleteLink, linkId, navigate, onDeleteSuccess]);

  const overflowTrigger = (
    <IconButton
      onClick={handleOpenMenu}
      aria-label={t("actions.more")}
      aria-haspopup="menu"
      aria-expanded={menuAnchor ? true : undefined}
      disabled={isDeleting}
      size="small"
      sx={{
        // 44px touch target on phones; compact 34px from sm up.
        width: { xs: 44, sm: 34 },
        height: { xs: 44, sm: 34 },
        color: "text.secondary",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: `${theme.shape.borderRadius}px`,
        flexShrink: 0,
        "&:hover": {
          color: "text.primary",
          bgcolor: "action.hover",
        },
      }}
    >
      <MoreVertical {...ICON_MD} />
    </IconButton>
  );

  return (
    <Box
      component="header"
      sx={{
        pt: { xs: 0.75, sm: 1 },
        pb: { xs: 1.5, sm: 1.75 },
        mb: { xs: 2, sm: 2.5 },
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: "flex",
        flexDirection: "column",
        gap: { xs: 1, sm: 1.25 },
      }}
    >
      {/* Row 1 — utilities: back link left, copy + overflow right, one baseline */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <LinkActionsBackLink />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {!isMobile ? (
            <LinkActionsCopyButton
              shortUrl={resolvedShortUrl || undefined}
              disabled={isDeleting}
            />
          ) : null}
          {overflowTrigger}
        </Box>
      </Box>

      {/* Row 2 — identity: title + short URL, full width */}
      <LinkActionsTitleRow
        title={title}
        shortUrl={resolvedShortUrl || undefined}
      />

      {/* Mobile-only copy button between identity and navigation */}
      {isMobile ? (
        <LinkActionsCopyButton
          shortUrl={resolvedShortUrl || undefined}
          disabled={isDeleting}
          fullWidth
        />
      ) : null}

      {/* Row 3 — sibling-view navigation */}
      <Box sx={{ maxWidth: { sm: 520 }, width: "100%" }}>
        <LinkActionsViewSwitch
          linkId={linkId}
          currentView={currentView}
          fullWidth={isMobile}
          clicks={clicks}
        />
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
      >
        <MenuItem
          onClick={handleRequestDelete}
          disabled={isDeleting}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon sx={{ color: "error.main" }}>
            <Trash2 {...ICON_MD} />
          </ListItemIcon>
          <ListItemText>{t("actions.delete")}</ListItemText>
        </MenuItem>
      </Menu>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        shortUrl={resolvedShortUrl || title || ""}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirming={isDeleting}
      />
    </Box>
  );
}

export default LinkActions;
