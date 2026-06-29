"use client";

import { useEffect } from "react";
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

  const titleSuggestion =
    ogTitle?.trim() && !titleValue?.trim() ? ogTitle.trim() : null;

  useEffect(() => {
    if (!titleSuggestion) {
      return;
    }
    setValue("title", titleSuggestion, {
      shouldValidate: false,
      shouldDirty: false,
    });
  }, [titleSuggestion, setValue]);

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
