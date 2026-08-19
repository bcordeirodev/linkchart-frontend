"use client";

import { useId, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormLabel,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import visuallyHidden from "@mui/utils/visuallyHidden";
import { ZoomIn } from "lucide-react";
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
 *
 * The circle doubles as a trigger for a full-size preview: whenever a photo
 * exists, it becomes a real `<button>` (zoom-in cursor, hover/focus overlay
 * hint) opening a lightbox `Dialog` with the ORIGINAL upload (`avatarUrl` —
 * the same file used as the `og:image`), never the 512px thumbnail the
 * circle itself renders. Presentational only — no crop/zoom/re-upload; ESC
 * and backdrop click close it via the `Dialog`'s own default behavior.
 */
export function BioAvatarField({ page }: BioAvatarFieldProps) {
  const { t } = useTranslation("bio");
  const theme = useTheme();

  const uploadAvatar = useUploadBioAvatar();
  const removeAvatar = useRemoveBioAvatar();

  const [clientError, setClientError] = useState<string | null>(null);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewDialogTitleId = useId();

  const isBusy = uploadAvatar.isPending || removeAvatar.isPending;
  const fallbackGradient = `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`;
  // Círculo pequeno → thumb quando existe; presença de avatar continua
  // decidida por avatarUrl (avatares antigos não têm thumb).
  const previewUrl = page.avatarThumbUrl ?? page.avatarUrl;
  // A ampliação sempre mostra o ORIGINAL (avatarUrl) — o mesmo arquivo usado
  // como og:image — nunca o thumb de 512px que alimenta só o círculo pequeno.
  const hasPhoto = Boolean(page.avatarUrl);
  const canPreview = hasPhoto && !isBusy;

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
          component="button"
          type="button"
          onClick={() => setPreviewOpen(true)}
          disabled={!canPreview}
          aria-label={
            hasPhoto ? t("form.avatar.viewFullSize") : t("form.avatar.label")
          }
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
            background: previewUrl ? "none" : fallbackGradient,
            // Hairline em vez do reset `border: none` do <button>: uma foto
            // de bordas escuras (ou o gradiente) encostava direto no card e
            // o círculo perdia contorno no dark — mesmo motivo do tile de
            // favicon em `BioItemRow`. `divider` acompanha o token global.
            border: `1px solid ${theme.palette.divider}`,
            p: 0,
            m: 0,
            WebkitTapHighlightColor: "transparent",
            cursor: canPreview ? "zoom-in" : "default",
            "&:hover .avatar-zoom-hint, &:focus-visible .avatar-zoom-hint": {
              opacity: 1,
            },
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

          {/* Affordance sutil: ícone de lupa some por padrão, aparece no
              hover/focus do círculo — só quando há foto para ampliar. */}
          {hasPhoto ? (
            <Box
              aria-hidden
              className="avatar-zoom-hint"
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(0, 0, 0, 0.35)",
                opacity: 0,
                transition: "opacity 150ms ease",
              }}
            >
              <ZoomIn size={22} strokeWidth={1.75} color="#fff" />
            </Box>
          ) : null}

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

      {/* Lightbox simples: mostra o ORIGINAL (avatarUrl, o mesmo arquivo do
          og:image), nunca o thumb do círculo. Sem crop/zoom/reenvio — só
          visualização em tamanho real. ESC e clique no backdrop fecham de
          graça (comportamento padrão do MUI Dialog); título fica
          visualmente oculto (mesmo padrão de LinkAnalyticsTabs) só para dar
          nome acessível ao diálogo. */}
      <ResponsiveDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="sm"
        fullWidth
        aria-labelledby={previewDialogTitleId}
      >
        <Typography
          component="h2"
          id={previewDialogTitleId}
          sx={visuallyHidden}
        >
          {t("form.avatar.previewDialog.title")}
        </Typography>
        <Box sx={{ position: "relative", lineHeight: 0 }}>
          <IconButton
            onClick={() => setPreviewOpen(false)}
            aria-label={t("form.avatar.previewDialog.close")}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: alpha(theme.palette.common.black, 0.45),
              color: "common.white",
              "&:hover": {
                bgcolor: alpha(theme.palette.common.black, 0.65),
              },
            }}
          >
            <AppIcon intent="cancel" size={20} />
          </IconButton>
          {page.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- foto do usuário em tamanho real, num modal pontual
            <img
              src={page.avatarUrl}
              alt={t("form.avatar.previewDialog.alt", { title: page.title })}
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
          ) : null}
        </Box>
      </ResponsiveDialog>
    </Box>
  );
}

export default BioAvatarField;
