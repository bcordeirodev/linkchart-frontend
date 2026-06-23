"use client";
import type { ReactNode } from "react";
import { CircularProgress, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import type { SlugAvailabilityStatus } from "@/features/links/hooks/useSlugAvailability";
import {
  buildPublicSlugAvailabilityLabels,
  FormFieldFeedback,
  getSlugAvailabilityHelperNode,
  InlineStatusRow,
} from "./UrlSafetyIndicator";

export interface SlugAvailabilityHintProps {
  /**
   * The current slug availability status returned by `useSlugAvailability`.
   * When `"idle"`, the hint renders nothing.
   */
  slugAvailability: SlugAvailabilityStatus;
  /**
   * Whether the slug field has a user-typed value. When false, slug
   * availability UI is suppressed in favour of the suggestion hint.
   */
  showAvailability: boolean;
  /**
   * Whether an auto-generated slug suggestion is ready and the user has not
   * yet typed into the slug field. When true, a "Tab to accept" nudge renders.
   */
  showSuggestion: boolean;
  /**
   * Whether the suggestion resolver is still working (debounce + API). Shows
   * a "finding a slug…" spinner when true and `showSuggestion` is false.
   */
  isResolvingSuggestion: boolean;
}

/**
 * Below-field hint row for the custom-slug input in the public shortener form.
 *
 * Priority order (first matching condition wins):
 * 1. Availability check result — but only the error state (`taken`) is shown.
 *    The public box stays silent while checking and when the slug is available
 *    (we assume the overwhelming majority of slugs are free); feedback only
 *    surfaces when the chosen slug is already in use.
 * 2. "Press Tab" suggestion nudge (`showSuggestion`)
 * 3. "Finding a slug…" spinner (`isResolvingSuggestion`)
 *
 * Returns null when none of the conditions are met.
 *
 * @param props - See {@link SlugAvailabilityHintProps}.
 */
export function SlugAvailabilityHint({
  slugAvailability,
  showAvailability,
  showSuggestion,
  isResolvingSuggestion,
}: SlugAvailabilityHintProps): ReactNode {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const labels = buildPublicSlugAvailabilityLabels(t);

  if (showAvailability && slugAvailability !== "idle") {
    // Only surface the error state; `checking` and `available` are
    // intentionally silent to keep the public shortener box quiet.
    if (slugAvailability !== "taken") {
      return null;
    }
    return (
      <FormFieldFeedback>
        {getSlugAvailabilityHelperNode(slugAvailability, labels)}
      </FormFieldFeedback>
    );
  }

  if (showSuggestion) {
    return (
      <FormFieldFeedback>
        <Typography
          component="span"
          sx={{
            fontSize: "0.75rem",
            color: alpha(theme.palette.text.primary, 0.45),
          }}
        >
          {t("shorter.form.slugTabHint")}
        </Typography>
      </FormFieldFeedback>
    );
  }

  if (isResolvingSuggestion) {
    return (
      <FormFieldFeedback>
        <InlineStatusRow
          icon={
            <CircularProgress
              size={11}
              sx={{ color: alpha(theme.palette.text.primary, 0.35) }}
            />
          }
          label={t("shorter.form.slugSuggestionChecking")}
          color={alpha(theme.palette.text.primary, 0.45)}
        />
      </FormFieldFeedback>
    );
  }

  return null;
}
