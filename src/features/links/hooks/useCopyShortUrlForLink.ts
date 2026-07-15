"use client";

import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useMessage } from "@/lib/providers/MessageProvider";
import { copyTextToClipboard, getShortUrlForLink } from "@/lib/utils/shortUrl";
import type { LinkResponse } from "@/types";

type LinkShortUrlInput = Pick<
  LinkResponse,
  "slug" | "custom_slug" | "short_url"
>;

/**
 * Copies a link's public short URL and shows a success toast.
 *
 * Always uses the link's own recorded `short_url` (its immutable domain) —
 * see `getShortUrlForLink` for why that must not depend on the account's
 * currently active subdomain.
 */
export function useCopyShortUrlForLink() {
  const { showMessage } = useMessage();
  const { t } = useTranslation("links");

  return useCallback(
    async (link: LinkShortUrlInput) => {
      const url = getShortUrlForLink(link);

      if (!url) {
        return false;
      }

      const copied = await copyTextToClipboard(url);

      if (copied) {
        showMessage({
          message: t("actions.copySuccess"),
          variant: "success",
        });
      }

      return copied;
    },
    [showMessage, t],
  );
}
