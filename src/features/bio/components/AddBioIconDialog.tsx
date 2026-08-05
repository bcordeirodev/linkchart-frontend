"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  DialogContent,
  DialogTitle,
  FormLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { ResponsiveDialog } from "@/shared/ui/feedback";
import {
  SOCIAL_PLATFORM_KEYS,
  SocialPlatformIcon,
  type SocialPlatformKey,
} from "@/shared/ui/icons";

import { useAddBioItem } from "../hooks/useBioItems";
import { BioLinkPicker } from "./BioLinkPicker";

import type { ID } from "@/types";

export interface AddBioIconDialogProps {
  open: boolean;
  onClose: () => void;
  /** Link ids already on the page (as either an item or an icon) — excluded from the pickable list. */
  existingLinkIds: ID[];
  /** True once the page holds `MAX_BIO_ITEMS` — icons share the same cap as plain items. */
  limitReached: boolean;
}

/**
 * Dialog to add a social icon (`display: "icon"`) to the bio page — a
 * separate entry point from `AddBioItemDialog` rather than a mode toggle
 * crammed into it.
 *
 * Chosen over extending `AddBioItemDialog` with an "item vs. icon" switch
 * for three reasons: (1) that dialog's own docstring already frames it as a
 * single-purpose "pick a link" flow, and a hidden mode switch inside it
 * would only be discoverable once opened; (2) two clearly labeled entry
 * points ("Link" / "Ícone social" — see the menu in `BioItemsSection`) let
 * the choice read directly off the UI, instead of being buried a level deep;
 * (3) the icon flow needs one extra required field up front (platform) that
 * has no equivalent in the plain-item flow — putting it in its own dialog
 * keeps that field from being conditionally shown/hidden inside a shared one.
 * The actual link-picking UI is still shared (`BioLinkPicker`) — only the
 * chrome around it differs.
 *
 * Platform-first, link-second: the platform select sits above
 * `BioLinkPicker` since "which network" is the more stable decision (rarely
 * revisited) and "which of my links" the more variable one — reading top to
 * bottom, "Instagram" then "which link" reads as one sentence.
 */
export function AddBioIconDialog({
  open,
  onClose,
  existingLinkIds,
  limitReached,
}: AddBioIconDialogProps) {
  const { t } = useTranslation("bio");
  const addItem = useAddBioItem();

  const [platform, setPlatform] = useState<SocialPlatformKey>(
    SOCIAL_PLATFORM_KEYS[0],
  );

  return (
    <ResponsiveDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("items.icon.addDialog.title")}</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
      >
        <Typography variant="body2" color="text.secondary">
          {t("items.icon.addDialog.hint")}
        </Typography>

        {limitReached ? (
          <Alert severity="info">{t("items.limitReachedNotice")}</Alert>
        ) : null}

        <Box>
          <FormLabel
            htmlFor="bio-icon-platform-select"
            sx={{ display: "block", mb: 0.75 }}
          >
            {t("items.icon.platformLabel")}
          </FormLabel>
          <TextField
            id="bio-icon-platform-select"
            select
            fullWidth
            size="small"
            value={platform}
            onChange={(e) => setPlatform(e.target.value as SocialPlatformKey)}
            disabled={limitReached}
          >
            {SOCIAL_PLATFORM_KEYS.map((key) => (
              <MenuItem key={key} value={key}>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <SocialPlatformIcon platform={key} size={16} />
                  <span>{t(`socialPlatforms.${key}`)}</span>
                </Stack>
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <BioLinkPicker
          existingLinkIds={existingLinkIds}
          limitReached={limitReached}
          onPick={(link) =>
            addItem.mutateAsync({
              linkId: link.id,
              display: "icon",
              socialPlatform: platform,
            })
          }
        />
      </DialogContent>
    </ResponsiveDialog>
  );
}

export default AddBioIconDialog;
