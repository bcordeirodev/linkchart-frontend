import { z } from "zod";

import { BIO_DESCRIPTION_MAX_LENGTH, TITLE_MAX_LENGTH } from "../constants";

import type { BioTheme } from "../types";

/**
 * Shape of the bio page editor form — one form for both create and edit.
 *
 * No `handle` field: subdomain-first, the address (`subdomainId`) IS the
 * page's identity, so the form never collects a handle. On create, the
 * backend derives one from the subdomain's label (adding a numeric suffix
 * on collision); on update, omitting it leaves the current one untouched.
 * The derived/current handle is still shown, read-only, as the secondary
 * `/@{handle}` caption in `BioPublicUrlBar` — sourced from `page.handle`
 * (the server's response), never from this form.
 */
export interface BioPageFormData {
  title: string;
  bio: string;
  theme: BioTheme;
  /** Edit mode only; ignored by the service on create (backend defaults to active). */
  isActive: boolean;
  /** Selected address: an active subdomain id. Required — see `subdomainId`'s schema rule below. */
  subdomainId: number | null;
}

/** Blank starting point for the "no page yet" (create) state. */
export const defaultBioPageFormValues: BioPageFormData = {
  title: "",
  bio: "",
  theme: "dark",
  isActive: true,
  subdomainId: null,
};

type Translate = (key: string, options?: Record<string, unknown>) => string;

/**
 * Builds the zod schema for the bio page form, translated via the `bio`
 * i18n namespace.
 *
 * @param t - translation function scoped to the `bio` namespace.
 */
export function bioPageFormSchema(t: Translate) {
  return z.object({
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
    // Subdomain-first: the backend rejects `subdomain_id: null` unconditionally
    // (see `PUT /api/bio`), so the address is a required pick, not an optional
    // one. Kept `.nullable()` (rather than plain `z.number()`) so the type
    // stays `number | null` — matching the legacy page's unset default — with
    // the `refine` doing the actual "must be chosen" enforcement.
    subdomainId: z
      .number()
      .nullable()
      .refine((value): value is number => value !== null, {
        message: t("form.errors.subdomainRequired"),
      }),
  });
}
