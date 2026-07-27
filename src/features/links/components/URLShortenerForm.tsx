"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Globe, Link2 } from "lucide-react";
import { m } from "framer-motion";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { usePublicSlugSuggestion } from "@/features/links/hooks/usePublicSlugSuggestion";
import { usePublicURLShortener } from "@/features/links/hooks/usePublicURLShortener";
import { useSlugAvailability } from "@/features/links/hooks/useSlugAvailability";
import { useUrlSafetyCheck } from "@/features/links/hooks/useUrlSafetyCheck";
import { PUBLIC_SLUG_PATTERN } from "@/features/links/utils/slugAvailabilityCheck";
import { ApiError } from "@/lib/api/client";
import { useMessage } from "@/lib/providers/MessageProvider";
import {
  getPublicBlockDescriptionSx,
  getPublicBlockTitleSx,
  getPublicFocalSx,
  getPublicFormFieldSx,
} from "@/lib/theme/publicPageStyles";
import { SHORTER_CONTENT_MAX_WIDTH } from "@/shared/constants";
import { PublicBlockIcon } from "@/shared/ui/base";
import { ICON_SM } from "@/lib/theme/iconDefaults";

import { SlugAvailabilityHint } from "./forms/SlugAvailabilityHint";
import { UrlSafetyHint } from "./forms/UrlSafetyHint";
import { ShortenSubmitButton } from "./forms/ShortenSubmitButton";
import {
  getUrlShortenerInputSx,
  getUrlShortenerLabelSx,
} from "./urlShortenerFormStyles";

import type { PublicLinkResponse } from "@/services/link-public.service";

interface IFormData {
  originalUrl: string;
  customSlug: string;
}

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

export function URLShortenerForm({
  onSuccess,
  onError,
  loading: externalLoading,
  initialUrl,
}: URLShortenerFormProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { showMessage } = useMessage();
  const { t } = useTranslation("public");
  const fieldSx = getPublicFormFieldSx(theme);
  const labelSx = getUrlShortenerLabelSx(theme);
  const inputSx = getUrlShortenerInputSx(theme);
  const iconMuted = alpha(theme.palette.text.primary, isDark ? 0.5 : 0.44);
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

  const { createPublicShortUrl, loading } = usePublicURLShortener();
  const isLoading = !!(loading || externalLoading);

  const urlValue = watch("originalUrl");
  const slugValue = watch("customSlug");
  const { status: safetyStatus, threats } = useUrlSafetyCheck(urlValue ?? "");

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

  // A submit can arrive before its gates settle — the safety check may still be
  // running, or the slug suggestion the user is relying on may not have resolved.
  // Rather than a dead click, the submit is parked here and replayed once both
  // settle (see the flush effect), so we always commit the resolved suggestion
  // instead of racing it to a backend random.
  const pendingSubmitRef = useRef<IFormData | null>(null);
  const [submitQueued, setSubmitQueued] = useState(false);

  const doCreate = useCallback(
    async (formData: IFormData): Promise<void> => {
      // The smart suggestion is the default: when the user didn't type a name,
      // commit the very slug the preview showed (the resolved suggestion), so the
      // created link matches the preview instead of a fresh backend random.
      const typed = formData.customSlug.trim();
      const effectiveSlug =
        typed || (slugSuggestionStatus === "ready" ? availableSlug : null);
      try {
        const result = await createPublicShortUrl({
          original_url: formData.originalUrl,
          custom_slug: effectiveSlug || undefined,
          title: ogTitleRef.current ?? undefined,
        });
        onSuccess?.(result);
      } catch (err) {
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
      }
    },
    [
      createPublicShortUrl,
      onSuccess,
      onError,
      setError,
      showMessage,
      t,
      availableSlug,
      slugSuggestionStatus,
    ],
  );

  const onSubmit = (formData: IFormData): void => {
    // Unsafe is a hard block (defense-in-depth beyond the disabled button). A
    // still-running safety check, or a suggestion the user depends on that hasn't
    // resolved, queues the submit to fire once both settle.
    if (safetyStatus === "unsafe") {
      return;
    }
    const awaitingSuggestion =
      !formData.customSlug.trim() && slugSuggestionStatus === "resolving";
    if (safetyStatus === "checking" || awaitingSuggestion) {
      pendingSubmitRef.current = formData;
      setSubmitQueued(true);
      return;
    }
    void doCreate(formData);
  };

  // Flush a queued submit once both gates settle: the safety check finished
  // (anything but "checking" — "error" fails open) and any suggestion the submit
  // depends on has landed. Drop it on an unsafe verdict or a cleared URL.
  useEffect(() => {
    if (!submitQueued) {
      return;
    }
    if (safetyStatus === "unsafe" || safetyStatus === "idle") {
      pendingSubmitRef.current = null;
      setSubmitQueued(false);
      return;
    }
    const formData = pendingSubmitRef.current;
    const awaitingSuggestion =
      !!formData &&
      !formData.customSlug.trim() &&
      slugSuggestionStatus === "resolving";
    if (safetyStatus !== "checking" && !awaitingSuggestion) {
      pendingSubmitRef.current = null;
      setSubmitQueued(false);
      if (formData) {
        void doCreate(formData);
      }
    }
  }, [safetyStatus, slugSuggestionStatus, submitQueued, doCreate]);

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
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ ...getPublicFocalSx(theme), p: { xs: 2.5, sm: 3, md: 3.5 } }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.25,
            mb: 2.5,
          }}
        >
          <PublicBlockIcon
            icon={Link2}
            sx={{
              color: alpha(theme.palette.common.white, isDark ? 0.96 : 0.94),
            }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              component="h2"
              sx={{ ...getPublicBlockTitleSx(theme), mb: 0.5 }}
            >
              {t("shorter.form.boxTitle")}
            </Typography>
            <Typography sx={getPublicBlockDescriptionSx(theme)}>
              {t("shorter.form.boxSubtitle")}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(0, 1.55fr) minmax(220px, 0.85fr)",
            },
            gap: { xs: 1.35, md: 1.5 },
            mb: 2.25,
            alignItems: "start",
          }}
        >
          {/* URL field */}
          <Box>
            <Typography sx={labelSx}>
              {t("shorter.form.urlLabel")}{" "}
              <Box component="span" sx={{ color: theme.palette.primary.main }}>
                *
              </Box>
            </Typography>
            <Box sx={fieldSx}>
              <Globe {...ICON_SM} color={iconMuted} />
              <Box
                component="input"
                {...register("originalUrl", {
                  required: t("shorter.form.urlRequired"),
                  pattern: {
                    value:
                      /^(https?:\/\/)?[\w.-]+(\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/,
                    message: t("shorter.form.urlInvalid"),
                  },
                })}
                placeholder={t("shorter.form.urlPlaceholder")}
                sx={inputSx}
              />
            </Box>
            {errors.originalUrl ? (
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: alpha(theme.palette.error.main, isDark ? 0.92 : 0.94),
                  mt: 0.5,
                  pl: 0.5,
                }}
              >
                {errors.originalUrl.message}
              </Typography>
            ) : (
              <UrlSafetyHint status={safetyStatus} threats={threats} />
            )}
          </Box>

          {/* Slug field */}
          <Box>
            <Typography sx={labelSx}>
              {t("shorter.form.slugLabel")}{" "}
              <Box
                component="span"
                sx={{
                  fontSize: "0.625rem",
                  fontWeight: 400,
                  textTransform: "none",
                  letterSpacing: 0,
                  color: alpha(theme.palette.text.primary, 0.35),
                }}
              >
                {t("shorter.form.optional")}
              </Box>
            </Typography>
            <Box sx={fieldSx} aria-busy={isResolvingSlugSuggestion}>
              <Link2 {...ICON_SM} color={iconMuted} />

              <Box
                component="input"
                {...register("customSlug", {
                  pattern: {
                    value: PUBLIC_SLUG_PATTERN,
                    message: t("shorter.form.slugInvalid"),
                  },
                })}
                placeholder={
                  showSlugSuggestion
                    ? availableSlug!
                    : t("shorter.form.slugPlaceholder")
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Tab" && showSlugSuggestion) {
                    setValue("customSlug", availableSlug!, {
                      shouldValidate: true,
                    });
                  }
                }}
                sx={{
                  ...(typeof inputSx === "object" && !Array.isArray(inputSx)
                    ? inputSx
                    : {}),
                  ...(showSlugSuggestion && {
                    "&::placeholder": {
                      color: alpha(theme.palette.primary.main, 0.55),
                      opacity: 1,
                    },
                  }),
                }}
              />
              {isResolvingSlugSuggestion ? (
                <CircularProgress
                  size={14}
                  aria-label={t("shorter.form.slugSuggestionChecking")}
                  sx={{
                    flexShrink: 0,
                    color: alpha(theme.palette.text.primary, 0.35),
                  }}
                />
              ) : null}
            </Box>
            {errors.customSlug ? (
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: alpha(theme.palette.error.main, isDark ? 0.92 : 0.94),
                  mt: 0.5,
                  pl: 0.5,
                }}
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

        <ShortenSubmitButton
          loading={isLoading || submitQueued}
          safetyStatus={safetyStatus}
        />
      </Box>
    </m.div>
  );
}

export default URLShortenerForm;
