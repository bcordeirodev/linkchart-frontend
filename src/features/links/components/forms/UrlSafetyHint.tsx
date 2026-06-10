"use client";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import type { UrlSafetyStatus } from "@/features/links/hooks/useUrlSafetyCheck";
import {
  buildPublicUrlSafetyLabels,
  FormFieldFeedback,
  getUrlSafetyHelperNode,
} from "./UrlSafetyIndicator";

export interface UrlSafetyHintProps {
  /**
   * The current URL safety status returned by `useUrlSafetyCheck`.
   * When `"idle"`, the hint renders nothing.
   */
  status: UrlSafetyStatus;
  /**
   * Threat categories reported by Safe Browsing when `status === "unsafe"`.
   * Pass the `threats` array from `useUrlSafetyCheck`.
   */
  threats: string[];
}

/**
 * Below-field hint for the URL input in the public shortener form.
 *
 * Delegates to {@link getUrlSafetyHelperNode} from `UrlSafetyIndicator` for
 * the actual visual rendering; this component adds the `FormFieldFeedback`
 * wrapper and the `public` i18n namespace label building, matching the
 * existing behaviour inline in `URLShortenerForm`.
 *
 * Returns null when `status === "idle"`.
 *
 * @param props - See {@link UrlSafetyHintProps}.
 */
export function UrlSafetyHint({ status, threats }: UrlSafetyHintProps): ReactNode {
  const { t } = useTranslation("public");
  const labels = buildPublicUrlSafetyLabels(t);

  if (status === "idle") {
    return null;
  }

  return (
    <FormFieldFeedback>
      {getUrlSafetyHelperNode(status, threats, labels)}
    </FormFieldFeedback>
  );
}
