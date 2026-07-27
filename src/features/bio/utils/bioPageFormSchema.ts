import { z } from "zod";

import {
  BIO_DESCRIPTION_MAX_LENGTH,
  HANDLE_MAX_LENGTH,
  HANDLE_MIN_LENGTH,
  HANDLE_PATTERN,
  TITLE_MAX_LENGTH,
} from "../constants";

import type { BioTheme } from "../types";

/** Shape of the bio page editor form — one form for both create and edit. */
export interface BioPageFormData {
  handle: string;
  title: string;
  bio: string;
  theme: BioTheme;
  /** Edit mode only; ignored by the service on create (backend defaults to active). */
  isActive: boolean;
  /** Selected address: `null` = default `/@{handle}`, otherwise an active subdomain id. */
  subdomainId: number | null;
}

/** Blank starting point for the "no page yet" (create) state. */
export const defaultBioPageFormValues: BioPageFormData = {
  handle: "",
  title: "",
  bio: "",
  theme: "dark",
  isActive: true,
  subdomainId: null,
};

type Translate = (key: string, options?: Record<string, unknown>) => string;

/**
 * Builds the zod schema for the bio page form, translated via the `bio`
 * i18n namespace. Mirrors the server's own handle rule
 * (`^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$`, 3–30 chars) so most invalid handles
 * are caught before a round trip — reserved words and "already taken" still
 * only ever come back from the server (422).
 *
 * @param t - translation function scoped to the `bio` namespace.
 */
export function bioPageFormSchema(t: Translate) {
  return z.object({
    handle: z
      .string()
      .trim()
      .min(HANDLE_MIN_LENGTH, t("form.errors.handleTooShort"))
      .max(HANDLE_MAX_LENGTH, t("form.errors.handleTooLong"))
      .regex(HANDLE_PATTERN, t("form.errors.handleFormat")),
    title: z
      .string()
      .trim()
      .min(1, t("form.errors.titleRequired"))
      .max(TITLE_MAX_LENGTH, t("form.errors.titleTooLong")),
    bio: z
      .string()
      .max(BIO_DESCRIPTION_MAX_LENGTH, t("form.errors.bioTooLong"))
      .optional()
      .default(""),
    theme: z.enum(["dark", "light"]),
    isActive: z.boolean(),
    subdomainId: z.number().nullable(),
  });
}
