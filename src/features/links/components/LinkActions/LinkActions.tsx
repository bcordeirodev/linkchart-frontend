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
import { useShortUrl } from "@/features/links/hooks/useShortUrl";
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
  onDeleteSuccess?: () => void;
}

export function LinkActions({
  linkId,
  currentView,
  slug,
  shortUrl: shortUrlProp,
  title,
  onDeleteSuccess,
}: LinkActionsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { t } = useTranslation("links");
  const deleteLink = useDeleteLink();

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const slugForHook = slug ?? "";
  const subdomainAwareUrl = useShortUrl(slugForHook);

  const resolvedShortUrl = useMemo(() => {
    if (slug) {
      return subdomainAwareUrl;
    }
    if (shortUrlProp) {
      return getShortUrl(shortUrlProp);
    }
    return "";
  }, [slug, subdomainAwareUrl, shortUrlProp]);

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
        width: 34,
        height: 34,
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
        py: { xs: 1.5, sm: 1.75 },
        mb: { xs: 2.5, sm: 3 },
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: "flex",
        flexDirection: "column",
        gap: { xs: 1.25, sm: 1.5 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { sm: "flex-start" },
          gap: { xs: 1.25, sm: 2 },
        }}
      >
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: 1,
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
          <LinkActionsTitleRow
            title={title}
            shortUrl={resolvedShortUrl || undefined}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { sm: "center" },
            gap: 1,
            flexShrink: 0,
            width: { xs: "100%", sm: "auto" },
            pt: { sm: 0.25 },
          }}
        >
          <LinkActionsCopyButton
            shortUrl={resolvedShortUrl || undefined}
            disabled={isDeleting}
            fullWidth={isMobile}
          />
          {!isMobile ? overflowTrigger : null}
        </Box>
      </Box>

      <Box sx={{ maxWidth: { sm: 520 }, width: "100%" }}>
        <LinkActionsViewSwitch
          linkId={linkId}
          currentView={currentView}
          fullWidth={isMobile}
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
