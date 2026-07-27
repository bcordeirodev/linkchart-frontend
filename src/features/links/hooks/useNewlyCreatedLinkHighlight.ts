"use client";

import { useCallback, useEffect, useState } from "react";

import { useCopyShortUrlForLink } from "@/features/links/hooks/useCopyShortUrlForLink";
import type { LinkResponse } from "@/types";

const HIGHLIGHT_MS = 4500;
const SCROLL_DELAY_MS = 150;

/**
 * Highlights a newly created link card and scrolls it into view once it
 * appears in the list.
 *
 * Two triggers:
 * - `highlightLink(link)` — in-page quick-create: highlights AND copies the
 *   short URL (the quick-create flow delegates the copy toast to this hook).
 * - `highlightLinkById(id)` — cross-page arrival (`/links?created={id}`):
 *   highlight only, because the originating flow (`CreateLinkForm`, landing
 *   shortener) already copied the URL before navigating here.
 *
 * The scroll and the auto-clear timer only start once the id shows up in
 * `visibleLinkIds` — a highlight set before the list (re)fetches simply waits
 * for the data, and if the id never appears (e.g. it landed outside the
 * current server-side page) the highlight degrades to a silent no-op.
 */
export function useNewlyCreatedLinkHighlight(visibleLinkIds: string[]) {
  const [highlightedLinkId, setHighlightedLinkId] = useState<string | null>(
    null,
  );
  const copyShortUrlForLink = useCopyShortUrlForLink();

  /**
   * Marks a link id as newly created, with no side-effects (no clipboard
   * copy). Entry point for the cross-page `?created={id}` flow, where the
   * short URL was already copied before navigation.
   */
  const highlightLinkById = useCallback((id: string) => {
    setHighlightedLinkId(id);
  }, []);

  /**
   * Marks a just-created link as highlighted and copies its short URL —
   * the in-page quick-create path.
   */
  const highlightLink = useCallback(
    (link: LinkResponse) => {
      highlightLinkById(String(link.id));
      void copyShortUrlForLink(link);
    },
    [copyShortUrlForLink, highlightLinkById],
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

  return { highlightedLinkId, highlightLink, highlightLinkById };
}
