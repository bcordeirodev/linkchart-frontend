"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { SUBDOMAIN_QUERY_KEY } from "@/features/profile/hooks/useSubdomain";
import type { SubdomainResponse } from "@/features/profile/types/subdomain";
import { useAppDispatch } from "@/lib/store/hooks";
import { showMessage } from "@/lib/store/messageSlice";
import { copyTextToClipboard, getShortUrlForLink } from "@/lib/utils/shortUrl";
import type { LinkResponse } from "@/types";

type LinkShortUrlInput = Pick<
  LinkResponse,
  "slug" | "custom_slug" | "short_url"
>;

/**
 * Copies a link's public short URL (subdomain-aware) and shows a success toast.
 */
export function useCopyShortUrlForLink() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { t } = useTranslation("links");

  return useCallback(
    async (link: LinkShortUrlInput) => {
      const subdomain =
        queryClient.getQueryData<SubdomainResponse>(SUBDOMAIN_QUERY_KEY) ??
        null;
      const url = getShortUrlForLink(link, subdomain);

      if (!url) {
        return false;
      }

      const copied = await copyTextToClipboard(url);

      if (copied) {
        dispatch(
          showMessage({
            message: t("actions.copySuccess"),
            variant: "success",
          }),
        );
      }

      return copied;
    },
    [dispatch, queryClient, t],
  );
}
