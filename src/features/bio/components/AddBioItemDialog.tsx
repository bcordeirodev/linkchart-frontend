"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NextLink from "next/link";
import { useTranslation } from "react-i18next";

import { useLinks } from "@/features/links/hooks/useLinks";
import { ResponsiveDialog } from "@/shared/ui/feedback";
import { AppIcon } from "@/shared/ui/icons";

import { useAddBioItem } from "../hooks/useBioItems";

import type { ID, LinkResponse } from "@/types";

export interface AddBioItemDialogProps {
  open: boolean;
  onClose: () => void;
  /** Link ids already on the page — excluded from the pickable list. */
  existingLinkIds: ID[];
  /** True once the page holds `MAX_BIO_ITEMS` — blocks every row's add button. */
  limitReached: boolean;
}

/** Case-insensitive match over a link's title, slug and short URL. */
function matchesSearch(link: LinkResponse, query: string): boolean {
  if (!query.trim()) return true;
  const haystack =
    `${link.title ?? ""} ${link.slug} ${link.short_url}`.toLowerCase();
  return haystack.includes(query.trim().toLowerCase());
}

/**
 * Dialog to add one of the authenticated user's existing links as a bio
 * page button. Reuses `useLinks()` (read-only, `@/features/links/hooks`) for
 * the candidate list — never lists a link already on the page, and disables
 * every add action once `limitReached`.
 */
export function AddBioItemDialog({
  open,
  onClose,
  existingLinkIds,
  limitReached,
}: AddBioItemDialogProps) {
  const { t } = useTranslation("bio");
  const { links, loading } = useLinks();
  const addItem = useAddBioItem();

  const [query, setQuery] = useState("");
  const [pendingLinkId, setPendingLinkId] = useState<ID | null>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);

  const existingIdSet = useMemo(
    () => new Set(existingLinkIds.map(String)),
    [existingLinkIds],
  );

  const candidates = links
    .filter((link) => !existingIdSet.has(String(link.id)))
    .filter((link) => matchesSearch(link, query));

  const handleAdd = async (link: LinkResponse) => {
    setDialogError(null);
    setPendingLinkId(link.id);
    try {
      await addItem.mutateAsync({ linkId: link.id });
    } catch {
      setDialogError(t("items.errors.addGeneric"));
    } finally {
      setPendingLinkId(null);
    }
  };

  const handleClose = () => {
    setQuery("");
    setDialogError(null);
    onClose();
  };

  return (
    <ResponsiveDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("items.addDialog.title")}</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
      >
        {limitReached ? (
          <Alert severity="info">{t("items.limitReachedNotice")}</Alert>
        ) : null}
        {dialogError ? <Alert severity="error">{dialogError}</Alert> : null}

        <TextField
          size="small"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("items.addDialog.searchPlaceholder")}
          disabled={limitReached}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />

        {loading ? (
          <Stack spacing={1}>
            <Skeleton variant="rounded" height={56} />
            <Skeleton variant="rounded" height={56} />
          </Stack>
        ) : links.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              {t("items.addDialog.noLinksAtAll")}
            </Typography>
            <Button
              component={NextLink}
              href="/links/create"
              variant="outlined"
              size="small"
            >
              {t("items.addDialog.createLinkCta")}
            </Button>
          </Box>
        ) : candidates.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", py: 3 }}
          >
            {t("items.addDialog.noResults")}
          </Typography>
        ) : (
          <List disablePadding sx={{ maxHeight: 360, overflowY: "auto" }}>
            {candidates.map((link) => (
              <ListItem
                key={String(link.id)}
                disablePadding
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  py: 1,
                  px: 0.5,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  "&:last-of-type": { borderBottom: "none" },
                }}
              >
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {link.title?.trim() || link.slug}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {link.short_url}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  color="primary"
                  aria-label={t("items.addDialog.addAction")}
                  onClick={() => void handleAdd(link)}
                  disabled={limitReached || addItem.isPending}
                >
                  {pendingLinkId === link.id ? (
                    <CircularProgress size={18} />
                  ) : (
                    <AppIcon intent="create" size={18} />
                  )}
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </ResponsiveDialog>
  );
}

export default AddBioItemDialog;
