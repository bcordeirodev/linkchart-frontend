"use client";

import { useCallback, useEffect, useState } from "react";

import { useCopyShortUrlForLink } from "@/features/links/hooks/useCopyShortUrlForLink";
import type { LinkResponse } from "@/types";

const HIGHLIGHT_MS = 4500;
const SCROLL_DELAY_MS = 150;

/**
 * Highlights a link card after quick-create and scrolls it into view once it appears in the list.
 */
export function useNewlyCreatedLinkHighlight(visibleLinkIds: string[]) {
  const [highlightedLinkId, setHighlightedLinkId] = useState<string | null>(
    null,
  );
  const copyShortUrlForLink = useCopyShortUrlForLink();

  const highlightLink = useCallback(
    (link: LinkResponse) => {
      setHighlightedLinkId(String(link.id));
      void copyShortUrlForLink(link);
    },
    [copyShortUrlForLink],
  );

  useEffect(() => {
    if (!highlightedLinkId) {
      return;
    }

    if (!visibleLinkIds.includes(highlightedLinkId)) {
      return;
    }

    const scrollTimer = window.setTimeout(() => {
      document
        .getElementById(`link-card-${highlightedLinkId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, SCROLL_DELAY_MS);

    const clearTimer = window.setTimeout(
      () => setHighlightedLinkId(null),
      HIGHLIGHT_MS,
    );

    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(clearTimer);
    };
  }, [highlightedLinkId, visibleLinkIds]);

  return { highlightedLinkId, highlightLink };
}
