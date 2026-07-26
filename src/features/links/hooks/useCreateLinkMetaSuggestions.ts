"use client";

import { useEffect, useRef } from "react";
import type { Control, UseFormSetValue } from "react-hook-form";
import { useWatch } from "react-hook-form";

import type { LinkFormData } from "@/features/links/components/forms/LinkFormSchema";
import { usePublicSlugSuggestion } from "@/features/links/hooks/usePublicSlugSuggestion";

type UseCreateLinkMetaSuggestionsOptions = {
  control: Control<LinkFormData>;
  setValue: UseFormSetValue<LinkFormData>;
};

/**
 * URL metadata → title + slug suggestions for the **create** link form.
 *
 * Server-based counterpart of {@link useLinkFormMetaSuggestions} (which the edit
 * form keeps using for its `excludeSlug` support). A single request to
 * `GET /api/public/links/suggest-slug` derives the slug from the page's og:title
 * (falling back to the URL path/host) and checks global availability, and also
 * returns that og:title to fill the title field. This replaces the previous
 * client-side approach, which computed two different bases (URL first, then
 * og:title once it loaded) and fired a cascade of availability checks — making
 * the suggestion flip from one slug to another mid-resolution.
 *
 * Returns the same shape as {@link useLinkFormMetaSuggestions} so the shared
 * `LinkFormFields` UI is unchanged.
 */
export function useCreateLinkMetaSuggestions({
  control,
  setValue,
}: UseCreateLinkMetaSuggestionsOptions) {
  const urlValue = useWatch({ control, name: "original_url" });
  const slugValue = useWatch({ control, name: "custom_slug" });
  const titleValue = useWatch({ control, name: "title" });

  // Fire regardless of the slug field so the og:title can still fill the title
  // when the user already typed a custom slug. The slug suggestion itself is only
  // surfaced while the slug field is empty (below).
  const {
    slug: availableSlug,
    ogTitle,
    status,
  } = usePublicSlugSuggestion(urlValue ?? null);

  // The title we last filled in ourselves. While the field still holds it, the
  // field is ours to update — so pointing the form at a different URL replaces
  // the title too. Without this the auto-filled title outlived the URL it came
  // from: it was only ever written into an *empty* field, and filling it made
  // the condition false forever.
  const autoTitleRef = useRef<string | null>(null);
  const currentTitle = titleValue?.trim() ?? "";
  const titleIsOurs = !currentTitle || currentTitle === autoTitleRef.current;
  const resolvedTitle = ogTitle?.trim() || null;

  const titleSuggestion =
    titleIsOurs && resolvedTitle && resolvedTitle !== currentTitle
      ? resolvedTitle
      : null;

  useEffect(() => {
    if (!titleSuggestion) {
      return;
    }
    autoTitleRef.current = titleSuggestion;
    setValue("title", titleSuggestion, {
      shouldValidate: false,
      shouldDirty: false,
    });
  }, [titleSuggestion, setValue]);

  // Clear our own title while a new destination resolves, so a title read from
  // the previous page never sits under the new URL.
  useEffect(() => {
    if (status !== "resolving" || !titleIsOurs || !currentTitle) {
      return;
    }
    autoTitleRef.current = null;
    setValue("title", "", { shouldValidate: false, shouldDirty: false });
  }, [status, titleIsOurs, currentTitle, setValue]);

  return {
    slugSuggestion:
      !slugValue?.trim() && status === "ready" ? availableSlug : null,
    isResolvingSlugSuggestion: !slugValue?.trim() && status === "resolving",
    titleSuggestion,
    // The single suggestion request doubles as the metadata fetch, so there is no
    // separate "loading metadata" state to surface in the URL field.
    isLoadingMeta: false,
  };
}
