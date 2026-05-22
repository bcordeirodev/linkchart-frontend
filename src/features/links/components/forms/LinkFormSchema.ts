import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { z } from "zod";

type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

const BLOCKED_DOMAINS = ["malware.com", "phishing.net", "spam.org"];
const RESERVED_SLUGS = ["api", "admin", "www", "mail", "ftp", "r", "redirect"];

export function createLinkFormSchema(t: TranslateFn) {
  return z
    .object({
      original_url: z
        .string()
        .min(1, t("form.validation.urlRequired"))
        .max(4096, t("form.validation.urlMaxLength"))
        .url(t("form.validation.urlInvalid"))
        .regex(/^https?:\/\//, t("form.validation.urlScheme"))
        .refine((url) => {
          try {
            const domain = new URL(url).hostname;
            return !BLOCKED_DOMAINS.includes(domain);
          } catch {
            return false;
          }
        }, t("form.validation.urlBlocked")),

      title: z
        .string()
        .max(255, t("form.validation.titleMax"))
        .optional()
        .or(z.literal("")),

      custom_slug: z
        .string()
        .min(3, t("form.validation.slugMin"))
        .max(100, t("form.validation.slugMax"))
        .regex(/^[a-zA-Z0-9\-_]+$/, t("form.validation.slugPattern"))
        .refine(
          (slug) => !RESERVED_SLUGS.includes(slug?.toLowerCase()),
          t("form.validation.slugReserved"),
        )
        .optional()
        .or(z.literal("")),

      description: z
        .string()
        .max(1000, t("form.validation.descriptionMax"))
        .optional()
        .or(z.literal("")),

      expires_at: z
        .custom<Dayjs | null>((val) => {
          return val === null || dayjs.isDayjs(val);
        }, t("form.validation.dateInvalid"))
        .refine(
          (val) => {
            if (!val) return true;
            return val.toDate() <= dayjs().add(5, "year").toDate();
          },
          { message: t("form.validation.expiresMax") },
        )
        .optional()
        .nullable(),

      starts_in: z
        .custom<Dayjs | null>((val) => {
          return val === null || dayjs.isDayjs(val);
        }, t("form.validation.dateInvalid"))
        .optional()
        .nullable(),

      click_limit: z
        .number()
        .int(t("form.validation.clickLimitInt"))
        .min(1, t("form.validation.clickLimitMin"))
        .max(1000000, t("form.validation.clickLimitMax"))
        .optional()
        .nullable(),

      is_active: z.boolean().default(true),

      utm_source: z
        .string()
        .max(100, t("form.validation.utmMax", { field: "UTM Source" }))
        .optional()
        .or(z.literal("")),
      utm_medium: z
        .string()
        .max(100, t("form.validation.utmMax", { field: "UTM Medium" }))
        .optional()
        .or(z.literal("")),
      utm_campaign: z
        .string()
        .max(100, t("form.validation.utmMax", { field: "UTM Campaign" }))
        .optional()
        .or(z.literal("")),
      utm_term: z
        .string()
        .max(100, t("form.validation.utmMax", { field: "UTM Term" }))
        .optional()
        .or(z.literal("")),
      utm_content: z
        .string()
        .max(100, t("form.validation.utmMax", { field: "UTM Content" }))
        .optional()
        .or(z.literal("")),
    })
    .refine(
      (data) => {
        if (!data.starts_in || !data.expires_at) return true;
        return data.starts_in.toDate() < data.expires_at.toDate();
      },
      {
        message: t("form.validation.startsBeforeExpires"),
        path: ["starts_in"],
      },
    );
}

const _schemaForTypes = createLinkFormSchema((key: string) => key);
export type LinkFormData = z.infer<typeof _schemaForTypes>;

export const defaultLinkFormValues: Partial<LinkFormData> = {
  original_url: "",
  title: "",
  custom_slug: "",
  description: "",
  is_active: true,
  expires_at: null,
  starts_in: null,
  click_limit: null,
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_term: "",
  utm_content: "",
};
