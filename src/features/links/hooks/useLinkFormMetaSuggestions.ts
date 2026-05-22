"use client";

import { useEffect, useMemo } from "react";
import type { Control, UseFormSetValue } from "react-hook-form";
import { useWatch } from "react-hook-form";

import type { LinkFormData } from "@/features/links/components/forms/LinkFormSchema";
import { useAvailableSlugSuggestion } from "@/features/links/hooks/useAvailableSlugSuggestion";
import { useUrlMeta } from "@/features/links/hooks/useUrlMeta";
import { slugify, slugifyFromUrl } from "@/features/links/utils/slugify";

type UseLinkFormMetaSuggestionsOptions = {
  control: Control<LinkFormData>;
  setValue: UseFormSetValue<LinkFormData>;
  /**
   * Slug already owned by the link (edit mode). Treated as available so clearing
   * the field does not force `-2` when the same slug still belongs to this link.
   */
  excludeSlug?: string | null;
};

/**
 * URL metadata → title + slug suggestions for create/edit link forms.
 */
export function useLinkFormMetaSuggestions({
  control,
  setValue,
  excludeSlug = null,
}: UseLinkFormMetaSuggestionsOptions) {
  const urlValue = useWatch({ control, name: "original_url" });
  const slugValue = useWatch({ control, name: "custom_slug" });
  const titleValue = useWatch({ control, name: "title" });

  const { ogTitle, isLoading: isLoadingMeta } = useUrlMeta(urlValue ?? "");

  const baseSlugSuggestion = useMemo(() => {
    if (!urlValue) {
      return null;
    }
    if (ogTitle) {
      const fromTitle = slugify(ogTitle);
      if (fromTitle) {
        return fromTitle;
      }
    }
    return slugifyFromUrl(urlValue) || null;
  }, [ogTitle, urlValue]);

  const { availableSlug, status: slugSuggestionStatus } =
    useAvailableSlugSuggestion(!slugValue?.trim() ? baseSlugSuggestion : null, {
      excludeSlug,
    });

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
    slugSuggestion: slugSuggestionStatus === "ready" ? availableSlug : null,
    isResolvingSlugSuggestion:
      !!baseSlugSuggestion &&
      !slugValue?.trim() &&
      (isLoadingMeta || slugSuggestionStatus === "resolving"),
    titleSuggestion,
    isLoadingMeta,
  };
}
