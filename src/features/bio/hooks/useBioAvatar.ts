"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiError } from "@/lib/api/client";
import { i18n } from "@/lib/i18n";
import { useMessage } from "@/lib/providers/MessageProvider";
import { queryKeys } from "@/lib/query/keys";
import { bioService } from "@/services/bio.service";

import { createAvatarThumbnail } from "../utils/avatarThumbnail";

import type { BioPage } from "../types";

/** Translates a `bio` namespace key — shared by both mutations below. */
function t(key: string): string {
  return (i18n.t as (key: string, opts: object) => string)(key, { ns: "bio" });
}

/**
 * Resolves an avatar mutation's error to a user-facing message.
 *
 * Prefers the backend's own field-level message when present
 * (`UploadBioAvatarRequest` surfaces one specific reason — wrong type, too
 * large, dimensions too small — under `error.details.errors.avatar`), then
 * falls back to the envelope's generic `error.message`, then to a
 * translated fallback for non-`ApiError` failures (network drop, timeout).
 *
 * @param error - the error thrown by the mutation.
 * @param fallbackKey - `bio` namespace key used when no server message is available.
 */
function resolveAvatarErrorMessage(
  error: unknown,
  fallbackKey: string,
): string {
  if (error instanceof ApiError) {
    const fieldMessage = (
      error.details?.errors as Record<string, string[]> | undefined
    )?.avatar?.[0];
    if (fieldMessage) return fieldMessage;
    if (error.message) return error.message;
  }
  return t(fallbackKey);
}

/**
 * Mutation: upload (or replace) the bio page's avatar image.
 *
 * @endpoint `POST /api/bio/avatar` (via `bioService.uploadAvatar()`)
 *
 * @remarks
 * Only called once a bio page already exists — `BioAvatarField` is not
 * rendered in create mode (the endpoint 422s without a page to attach the
 * avatar to). On success, seeds `queryKeys.bio.page()` directly with the
 * server's response (same pattern as `useUpsertBioPage`) so the preview and
 * public-URL bar pick up the new `avatarUrl` without an extra round trip.
 */
export function useUploadBioAvatar() {
  const { showMessage } = useMessage();
  const queryClient = useQueryClient();

  return useMutation({
    // The square thumbnail rides along in the same multipart request: the
    // original becomes the Open Graph image (WhatsApp preview), the thumb
    // feeds the page's small avatar circle. Generation failing is fine —
    // `createAvatarThumbnail` resolves null and the upload proceeds
    // original-only.
    mutationFn: async (file: File) =>
      bioService.uploadAvatar(file, await createAvatarThumbnail(file)),
    onSuccess: (page: BioPage) => {
      queryClient.setQueryData(queryKeys.bio.page(), page);
      showMessage({
        message: t("form.avatar.uploadedToast"),
        variant: "success",
      });
    },
    onError: (error) => {
      showMessage({
        message: resolveAvatarErrorMessage(
          error,
          "form.avatar.errors.uploadGeneric",
        ),
        variant: "error",
      });
    },
  });
}

/**
 * Mutation: remove the bio page's avatar image, reverting the public page
 * back to its title/handle initial.
 *
 * @endpoint `DELETE /api/bio/avatar` (via `bioService.removeAvatar()`)
 */
export function useRemoveBioAvatar() {
  const { showMessage } = useMessage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => bioService.removeAvatar(),
    onSuccess: (page: BioPage) => {
      queryClient.setQueryData(queryKeys.bio.page(), page);
      showMessage({
        message: t("form.avatar.removedToast"),
        variant: "success",
      });
    },
    onError: (error) => {
      showMessage({
        message: resolveAvatarErrorMessage(
          error,
          "form.avatar.errors.removeGeneric",
        ),
        variant: "error",
      });
    },
  });
}
