"use client";
import { useCallback, useRef } from "react";
import type React from "react";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { Link2 } from "lucide-react";
import { m } from "framer-motion";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useLinkCreationOrchestration } from "@/features/links/hooks/useLinkCreationOrchestration";
import { usePublicSlugSuggestion } from "@/features/links/hooks/usePublicSlugSuggestion";
import { usePublicURLShortener } from "@/features/links/hooks/usePublicURLShortener";
import { useSlugAvailability } from "@/features/links/hooks/useSlugAvailability";
import { PUBLIC_SLUG_PATTERN } from "@/features/links/utils/slugAvailabilityCheck";
import { ApiError } from "@/lib/api/client";
import { useMessage } from "@/lib/providers/MessageProvider";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import { getShortUrlPrefix } from "@/lib/utils/shortUrl";
import { SHORTER_CONTENT_MAX_WIDTH } from "@/shared/constants";
import { getCardSurfaceSx } from "@/shared/ui/base";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";

import { PublicShortLinkStrip } from "./forms/PublicShortLinkStrip";
import { SlugAvailabilityHint } from "./forms/SlugAvailabilityHint";
import { UrlSafetyHint } from "./forms/UrlSafetyHint";
import { ShortenSubmitButton } from "./forms/ShortenSubmitButton";
import {
  getPublicShortenerFieldSx,
  publicGroupLabelSx,
} from "./urlShortenerFormStyles";

import type { PublicLinkResponse } from "@/services/link-public.service";

interface IFormData {
  originalUrl: string;
  customSlug: string;
}

/**
 * Reserves the helper row under the short-link group so the card does not grow
 * and shrink as hints (Tab-to-accept, "name taken", a pattern error) come and
 * go. One line of 0.75rem text plus its top margin.
 */
const HELPER_ROW_MIN_HEIGHT = 22;

interface URLShortenerFormProps {
  onSuccess?: (result: PublicLinkResponse) => void;
  onError?: (error: string) => void;
  loading?: boolean;
  /**
   * Pre-fills the URL field on mount (pre-fill only — never auto-submits).
   * Callers must pass an already-validated absolute http(s) URL; the landing
   * derives it from the `?url=` query param via `useShortenerPrefill`.
   */
  initialUrl?: string;
}

/**
 * The guest shortener — the product's front door on the acquisition page.
 *
 * Reads top to bottom as one argument, the same way the logged-in
 * quick-create does (`list/LinksQuickCreate.tsx`, the reference for this
 * surface): a heading and a single line that says what you get, the
 * destination field — the only thing that has to be filled in — with the
 * action beside it, and then the short link itself as an input group
 * (`{@link PublicShortLinkStrip}`): domain addon, the `/` glyph, and an
 * editable name that fills itself in from the destination page's title.
 *
 * What changed in the 2026-08-04 pass, and why:
 * - The icon-chip beside the heading is gone (the app-wide banned pattern),
 *   and the heading now renders through a real display variant.
 * - The card is a hairline `EnhancedPaper` over the page background instead
 *   of `getPublicFocalSx`'s navy gradient wash.
 * - The two caps Inter labels ("LINK QUE VOCÊ QUER ENCURTAR *" / "NOME
 *   PERSONALIZADO opcional") are gone. The destination field carries its
 *   label as an `aria-label` only — the heading's value line already says
 *   what to paste — and the name field became the strip's mono micro-label.
 * - The full-width gradient CTA became a contained-primary button sized to
 *   the destination row beside it.
 *
 * Behaviour is untouched: same endpoint, same Safe Browsing gate (via
 * `useLinkCreationOrchestration` + {@link ShortenSubmitButton}), same slug
 * suggestion race handling, same field validation and error mapping.
 */
export function URLShortenerForm({
  onSuccess,
  onError,
  loading: externalLoading,
  initialUrl,
}: URLShortenerFormProps) {
  const theme = useTheme();
  const { showMessage } = useMessage();
  const { t } = useTranslation("public");
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<IFormData>({
    defaultValues: { originalUrl: initialUrl ?? "", customSlug: "" },
  });

  const { createPublicShortUrl } = usePublicURLShortener();

  const urlValue = watch("originalUrl");
  const slugValue = watch("customSlug");

  // `NEXT_PUBLIC_REDIRECT_URL` still carries the legacy `/r` segment in local
  // dev; production already points at a bare redirect host. The addon drops it
  // either way, and what it shows still resolves — `routes/web.php` serves the
  // clean `/{slug}` alias alongside `/r/{slug}`.
  const defaultHost = getShortUrlPrefix()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "")
    .replace(/\/r$/, "");

  // One unauthenticated request resolves both the available slug and the page's
  // og:title. ogTitle silently fills the `title` payload below regardless of the
  // slug field; the slug ghost text only shows while that field is empty.
  const {
    slug: availableSlug,
    ogTitle,
    status: slugSuggestionStatus,
  } = usePublicSlugSuggestion(urlValue ?? null);

  const showSlugSuggestion =
    !slugValue?.trim() && slugSuggestionStatus === "ready" && !!availableSlug;
  const isResolvingSlugSuggestion =
    !slugValue?.trim() && slugSuggestionStatus === "resolving";

  const slugAvailability = useSlugAvailability(
    slugValue?.trim() ?? "",
    "public",
  );
  const showSlugAvailabilityUI = !!slugValue?.trim();

  const ogTitleRef = useRef<string | null>(null);
  ogTitleRef.current = ogTitle;

  const doCreate = useCallback(
    (formData: IFormData) => {
      // The smart suggestion is the default: when the user didn't type a name,
      // commit the very slug the preview showed (the resolved suggestion), so the
      // created link matches the preview instead of a fresh backend random.
      const typed = formData.customSlug.trim();
      const effectiveSlug =
        typed || (slugSuggestionStatus === "ready" ? availableSlug : null);
      return createPublicShortUrl({
        original_url: formData.originalUrl,
        custom_slug: effectiveSlug || undefined,
        title: ogTitleRef.current ?? undefined,
      });
    },
    [createPublicShortUrl, availableSlug, slugSuggestionStatus],
  );

  // Centralized Safe Browsing gate + queue-while-settling behaviour (shared
  // with the quick-create and full create forms) — see
  // `useLinkCreationOrchestration`. This surface additionally waits out a
  // slug suggestion the empty-name submit depends on, so the created link
  // matches the preview instead of racing it to a fresh backend random.
  const { safetyStatus, threats, isSubmitting, submitQueued, guardedSubmit } =
    useLinkCreationOrchestration<IFormData, PublicLinkResponse>({
      strategy: "public",
      url: urlValue ?? "",
      create: doCreate,
      queueWhileSettling: true,
      isExtraSettling: isResolvingSlugSuggestion,
      onSuccess: (result) => {
        onSuccess?.(result);
      },
      onError: (err) => {
        if (err instanceof ApiError && err.details?.errors) {
          const fieldErrors = err.details.errors as Record<string, string[]>;
          if (fieldErrors.custom_slug) {
            setError("customSlug", { message: fieldErrors.custom_slug[0] });
            return;
          }
        }
        const msg = t("shorter.form.errorMessage");
        showMessage({ variant: "error", message: msg });
        onError?.(msg);
      },
    });

  const isLoading = !!(isSubmitting || externalLoading);
  const slugRegister = register("customSlug", {
    pattern: {
      value: PUBLIC_SLUG_PATTERN,
      message: t("shorter.form.slugInvalid"),
    },
  });

  return (
    <m.div
      initial={{ opacity: 0, y: 28 }}
      animate={{
        opacity: isLoading ? 0.7 : 1,
        y: 0,
        scale: isLoading ? 0.985 : 1,
      }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ maxWidth: SHORTER_CONTENT_MAX_WIDTH, margin: "0 auto" }}
    >
      <EnhancedPaper
        variant="outlined"
        animated={false}
        sx={{ p: { xs: 2, sm: 2.5, md: 3 }, ...getCardSurfaceSx(theme) }}
      >
        {/* The card's own heading is the section heading — no icon-chip beside
            it, and `variant="h3"` is what puts it in the display face
            (`component` alone would leave it in MUI's default body type). */}
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontSize: { xs: "1.125rem", sm: "1.25rem" },
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
          }}
        >
          {t("shorter.form.boxTitle")}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5, maxWidth: "72ch" }}
        >
          {t("shorter.form.boxSubtitle")}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(guardedSubmit)}
          noValidate
          sx={{ mt: { xs: 2, sm: 2.25 } }}
        >
          {/* Row 1 — the destination: what you paste, and the action. */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { sm: "center" },
              gap: { xs: 1.25, sm: 1.5 },
            }}
          >
            <TextField
              {...register("originalUrl", {
                required: t("shorter.form.urlRequired"),
                pattern: {
                  value:
                    /^(https?:\/\/)?[\w.-]+(\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/,
                  message: t("shorter.form.urlInvalid"),
                },
              })}
              placeholder={t("shorter.form.urlPlaceholder")}
              size="small"
              fullWidth
              error={!!errors.originalUrl}
              sx={[
                getPublicShortenerFieldSx(theme),
                { flexGrow: 1, minWidth: 0 },
              ]}
              slotProps={{
                // The field's visible caps label is gone; the accessible name
                // is not. Same string, same i18n key.
                htmlInput: { "aria-label": t("shorter.form.urlLabel") },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Link2
                        {...ICON_MD}
                        color={theme.palette.text.secondary}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <ShortenSubmitButton
              loading={isLoading || submitQueued}
              safetyStatus={safetyStatus}
            />
          </Box>

          {/* The destination's own message sits against the destination field:
              a validation error, or the Safe Browsing verdict. Only
              materialises when there is something to say. */}
          {errors.originalUrl ? (
            <Typography
              variant="caption"
              component="div"
              color="error"
              sx={{ mt: 0.5 }}
            >
              {errors.originalUrl.message}
            </Typography>
          ) : (
            <UrlSafetyHint status={safetyStatus} threats={threats} />
          )}

          {/* Row 2 — the short link itself: group label, the input group
              `[ host | / name ]`, and one helper line. */}
          <Box sx={{ mt: { xs: 1.75, sm: 2 } }}>
            <Typography component="span" sx={publicGroupLabelSx}>
              {t("shorter.form.slugLabel")}{" "}
              <Box
                component="span"
                sx={{
                  // Sentence case against the caps label: "opcional" is an
                  // aside about the field, not part of its name.
                  textTransform: "none",
                  fontWeight: 500,
                  letterSpacing: 0,
                  color: alpha(theme.palette.text.primary, 0.38),
                }}
              >
                {t("shorter.form.optional")}
              </Box>
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <PublicShortLinkStrip
                name={slugRegister.name}
                inputRef={slugRegister.ref}
                value={slugValue ?? ""}
                onChange={slugRegister.onChange}
                onBlur={slugRegister.onBlur}
                defaultHost={defaultHost}
                placeholder={
                  showSlugSuggestion
                    ? availableSlug!
                    : t("shorter.form.slugPlaceholder")
                }
                suggestionActive={showSlugSuggestion}
                inputAriaLabel={t("shorter.form.slugLabel")}
                ariaLabel={t("shorter.form.slugLabel")}
                busy={isResolvingSlugSuggestion}
                busyLabel={t("shorter.form.slugSuggestionChecking")}
                error={!!errors.customSlug}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Tab" && showSlugSuggestion) {
                    setValue("customSlug", availableSlug!, {
                      shouldValidate: true,
                    });
                  }
                }}
              />
            </Box>
            {/* One helper slot, three possible tenants — a pattern error, a
                "name taken" verdict, or the Tab-to-accept nudge. The row keeps
                its height either way so nothing below it shifts. */}
            <Box sx={{ minHeight: HELPER_ROW_MIN_HEIGHT }}>
              {errors.customSlug ? (
                <Typography
                  variant="caption"
                  component="div"
                  color="error"
                  sx={{ mt: 0.5 }}
                >
                  {errors.customSlug.message}
                </Typography>
              ) : (
                <SlugAvailabilityHint
                  slugAvailability={slugAvailability}
                  showAvailability={showSlugAvailabilityUI}
                  showSuggestion={showSlugSuggestion}
                />
              )}
            </Box>
          </Box>
        </Box>
      </EnhancedPaper>
    </m.div>
  );
}

export default URLShortenerForm;
