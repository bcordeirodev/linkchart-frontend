"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
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
import { typographyScale } from "@/lib/theme";
import { AppIcon } from "@/shared/ui/icons";

import type { ID, LinkResponse } from "@/types";

export interface BioLinkPickerProps {
  /** Link ids already on the page (as either an item or an icon) — excluded from the pickable list. */
  existingLinkIds: ID[];
  /** True once the page holds `MAX_BIO_ITEMS` — disables every row's add button. */
  limitReached: boolean;
  /**
   * Called when the user picks a link. The picker shows a per-row spinner
   * while this resolves and, on rejection, an inline generic error above the
   * list — the caller only needs to perform the mutation and let the
   * rejection propagate (or resolve).
   */
  onPick: (link: LinkResponse) => Promise<unknown>;
}

/** Case-insensitive match over a link's title, slug and short URL. */
function matchesSearch(link: LinkResponse, query: string): boolean {
  if (!query.trim()) return true;
  const haystack =
    `${link.title ?? ""} ${link.slug} ${link.short_url}`.toLowerCase();
  return haystack.includes(query.trim().toLowerCase());
}

/**
 * Searchable list of the authenticated user's existing links, shared by
 * `AddBioItemDialog` (plain button items) and `AddBioIconDialog` (social
 * icons) — both flows end the same way: pick one of your links, and it
 * becomes the new item's underlying `link_id`. Extracted so the two dialogs
 * only differ in what they render *around* this list (a platform select, in
 * the icon dialog's case), not in the search/list/empty-state logic itself.
 *
 * Owns its own query/pending/error state — a fresh instance every time its
 * host dialog reopens (MUI `Dialog` unmounts closed content by default), so
 * there is no reset-on-close plumbing to wire up.
 */
export function BioLinkPicker({
  existingLinkIds,
  limitReached,
  onPick,
}: BioLinkPickerProps) {
  const { t } = useTranslation("bio");
  const { links, loading } = useLinks();

  const [query, setQuery] = useState("");
  const [pendingLinkId, setPendingLinkId] = useState<ID | null>(null);
  const [error, setError] = useState<string | null>(null);

  const existingIdSet = useMemo(
    () => new Set(existingLinkIds.map(String)),
    [existingLinkIds],
  );

  const candidates = links
    .filter((link) => !existingIdSet.has(String(link.id)))
    .filter((link) => matchesSearch(link, query));

  const handlePick = async (link: LinkResponse) => {
    setError(null);
    setPendingLinkId(link.id);
    try {
      await onPick(link);
    } catch {
      setError(t("items.errors.addGeneric"));
    } finally {
      setPendingLinkId(null);
    }
  };

  return (
    <Stack spacing={1.5}>
      {error ? <Alert severity="error">{error}</Alert> : null}

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
                {/* Uma linha só: a URL curta sem esquema já diz o domínio e
                    o slug — sem chip, sem duplicar informação. Mono: mesma
                    URL curta do produto tratada em BioItemRow. */}
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
                  {link.short_url.replace(/^https?:\/\//, "")}
                </Typography>
              </Box>
              <IconButton
                size="small"
                color="primary"
                aria-label={t("items.addDialog.addAction")}
                onClick={() => void handlePick(link)}
                disabled={limitReached || pendingLinkId !== null}
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
    </Stack>
  );
}

export default BioLinkPicker;
