"use client";

import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormLabel,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ResponsiveDialog } from "@/shared/ui/feedback";
import { AppIcon } from "@/shared/ui/icons";

import { AVATAR_ACCEPT_ATTR } from "../constants";
import { useRemoveBioAvatar, useUploadBioAvatar } from "../hooks/useBioAvatar";
import { getAvatarInitial } from "../utils/avatarInitial";
import { validateAvatarFile } from "../utils/avatarValidation";

import type { BioPage } from "../types";
import type { ChangeEvent } from "react";

/** Diameter of the avatar preview circle, in pixels. */
const PREVIEW_SIZE = 88;

export interface BioAvatarFieldProps {
  page: BioPage;
}

/**
 * Avatar section of the bio editor: circular preview (uploaded photo or the
 * title's initial), an "upload photo" button, and — once a photo exists —
 * a "remove photo" button gated behind a confirmation dialog.
 *
 * Upload and removal are each their own immediate mutation (`POST`/`DELETE
 * /api/bio/avatar`), independent of the page form's "Save" button — matches
 * how most avatar pickers behave (the photo change is live the moment it's
 * picked) and sidesteps having to thread a `File` through
 * `bioPageFormSchema`. Both mutations seed `queryKeys.bio.page()` directly
 * with the server's response, so this field, `BioPreviewPhone` and
 * `BioPublicUrlBar` all reflect the new photo without a refetch.
 *
 * Only rendered in edit mode (see `BioEditor`) — `POST /api/bio/avatar`
 * 422s when the authenticated user has no bio page yet to attach the photo
 * to, mirroring the precondition `BioPublicUrlBar` and `BioItemsSection`
 * already assume.
 */
export function BioAvatarField({ page }: BioAvatarFieldProps) {
  const { t } = useTranslation("bio");
  const theme = useTheme();

  const uploadAvatar = useUploadBioAvatar();
  const removeAvatar = useRemoveBioAvatar();

  const [clientError, setClientError] = useState<string | null>(null);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);

  const isBusy = uploadAvatar.isPending || removeAvatar.isPending;
  const fallbackGradient = `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`;
  // Círculo pequeno → thumb quando existe; presença de avatar continua
  // decidida por avatarUrl (avatares antigos não têm thumb).
  const previewUrl = page.avatarThumbUrl ?? page.avatarUrl;

  /**
   * Validates the picked file client-side (type + size) before ever
   * uploading it; on failure sets an inline error instead of firing the
   * mutation. Always resets the input's own value afterwards so picking the
   * exact same (invalid) file twice in a row still fires `onChange`.
   *
   * `t` is cast to a plain function type before reaching
   * `validateAvatarFile` — matches the same cast already used for
   * `bioPageFormSchema(t as ...)` in `BioEditor.tsx`. Passing react-i18next's
   * heavily overloaded `TFunction` type as-is into a differently-typed
   * parameter crashes this TypeScript version's overload resolution
   * ("Debug Failure: No error for last overload signature") instead of
   * producing a normal diagnostic; the cast sidesteps the structural
   * comparison that triggers it.
   */
  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const error = validateAvatarFile(
      file,
      t as (key: string, options?: Record<string, unknown>) => string,
    );
    if (error) {
      setClientError(error);
      return;
    }

    setClientError(null);
    uploadAvatar.mutate(file);
  };

  const handleConfirmRemove = async () => {
    try {
      await removeAvatar.mutateAsync();
      setConfirmRemoveOpen(false);
    } catch {
      // Dialog stays open; toast already shown by useRemoveBioAvatar's onError.
    }
  };

  return (
    <Box>
      <FormLabel sx={{ display: "block", mb: 0.75 }}>
        {t("form.avatar.label")}
      </FormLabel>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "flex-start", sm: "center" }}
      >
        <Box
          sx={{
            position: "relative",
            width: PREVIEW_SIZE,
            height: PREVIEW_SIZE,
            flexShrink: 0,
            borderRadius: "50%",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "common.white",
            background: previewUrl ? undefined : fallbackGradient,
          }}
        >
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt=""
              width={PREVIEW_SIZE}
              height={PREVIEW_SIZE}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            getAvatarInitial(page.title)
          )}

          {isBusy ? (
            <Box
              aria-hidden
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(0, 0, 0, 0.45)",
              }}
            >
              <CircularProgress size={28} sx={{ color: "common.white" }} />
            </Box>
          ) : null}
        </Box>

        <Stack spacing={0.75} sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button
              component="label"
              variant="outlined"
              size="small"
              startIcon={<AppIcon name="actions.upload" size={16} />}
              disabled={isBusy}
              sx={{ minHeight: 44 }}
            >
              {t("form.avatar.uploadAction")}
              <input
                type="file"
                accept={AVATAR_ACCEPT_ATTR}
                hidden
                onChange={handleFileSelected}
              />
            </Button>
            {page.avatarUrl ? (
              <Button
                variant="text"
                color="error"
                size="small"
                disabled={isBusy}
                onClick={() => setConfirmRemoveOpen(true)}
                sx={{ minHeight: 44 }}
              >
                {t("form.avatar.removeAction")}
              </Button>
            ) : null}
          </Stack>

          <Typography variant="caption" color="text.secondary">
            {t("form.avatar.hint")}
          </Typography>

          {clientError ? (
            <Typography variant="caption" color="error">
              {clientError}
            </Typography>
          ) : null}
        </Stack>
      </Stack>

      <ResponsiveDialog
        open={confirmRemoveOpen}
        onClose={() => setConfirmRemoveOpen(false)}
      >
        <DialogTitle>{t("form.avatar.removeDialog.title")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("form.avatar.removeDialog.body")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmRemoveOpen(false)}>
            {t("form.avatar.removeDialog.cancel")}
          </Button>
          <Button
            color="error"
            onClick={() => void handleConfirmRemove()}
            disabled={removeAvatar.isPending}
          >
            {t("form.avatar.removeDialog.confirm")}
          </Button>
        </DialogActions>
      </ResponsiveDialog>
    </Box>
  );
}

export default BioAvatarField;
