"use client";
import { useMemo, useRef } from "react";
import type React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Globe, Link2 } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useAvailableSlugSuggestion } from "@/features/links/hooks/useAvailableSlugSuggestion";
import { usePublicURLShortener } from "@/features/links/hooks/usePublicURLShortener";
import { useSlugAvailability } from "@/features/links/hooks/useSlugAvailability";
import { useUrlSafetyCheck } from "@/features/links/hooks/useUrlSafetyCheck";
import { useUrlMeta } from "@/features/links/hooks/useUrlMeta";
import { PUBLIC_SLUG_PATTERN } from "@/features/links/utils/slugAvailabilityCheck";
import {
  slugifyFromUrlPublic,
  slugifyPublic,
} from "@/features/links/utils/slugify";
import { ApiError } from "@/lib/api/client";
import { useAppDispatch } from "@/lib/store/hooks";
import { showErrorMessage } from "@/lib/store/messageSlice";
import {
  getPublicBlockDescriptionSx,
  getPublicBlockTitleSx,
  getPublicFormFieldSx,
  getPublicFormShellSx,
} from "@/lib/theme/publicPageStyles";
import { SHORTER_CONTENT_MAX_WIDTH } from "@/features/shorter/constants";
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
}

export function URLShortenerForm({
  onSuccess,
  onError,
  loading: externalLoading,
}: URLShortenerFormProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const dispatch = useAppDispatch();
  const { t } = useTranslation("public");
  const fieldSx = getPublicFormFieldSx(theme);
  const labelSx = getUrlShortenerLabelSx(theme);
  const inputSx = getUrlShortenerInputSx(theme);
  const iconMuted = alpha(theme.palette.text.primary, isDark ? 0.44 : 0.38);
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<IFormData>({
    defaultValues: { originalUrl: "", customSlug: "" },
  });

  const { createPublicShortUrl, loading } = usePublicURLShortener();
  const isLoading = !!(loading || externalLoading);

  const urlValue = watch("originalUrl");
  const slugValue = watch("customSlug");
  const { status: safetyStatus, threats } = useUrlSafetyCheck(urlValue ?? "");

  const { ogTitle, isLoading: isLoadingMeta } = useUrlMeta(urlValue ?? "");

  const baseSlugSuggestion = useMemo(() => {
    if (!urlValue?.trim()) {
      return null;
    }
    if (ogTitle) {
      const fromTitle = slugifyPublic(ogTitle);
      if (fromTitle) {
        return fromTitle;
      }
    }
    return slugifyFromUrlPublic(urlValue) || null;
  }, [ogTitle, urlValue]);

  const { availableSlug, status: slugSuggestionStatus } =
    useAvailableSlugSuggestion(!slugValue?.trim() ? baseSlugSuggestion : null, {
      mode: "public",
    });

  const showSlugSuggestion =
    !slugValue?.trim() && slugSuggestionStatus === "ready" && !!availableSlug;
  const isResolvingSlugSuggestion =
    !slugValue?.trim() &&
    !!baseSlugSuggestion &&
    (isLoadingMeta || slugSuggestionStatus === "resolving");

  const slugAvailability = useSlugAvailability(
    slugValue?.trim() ?? "",
    "public",
  );
  const showSlugAvailabilityUI = !!slugValue?.trim();

  const ogTitleRef = useRef<string | null>(null);
  ogTitleRef.current = ogTitle;

  const onSubmit = async (formData: IFormData) => {
    try {
      const result = await createPublicShortUrl({
        original_url: formData.originalUrl,
        custom_slug: formData.customSlug.trim() || undefined,
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
      dispatch(showErrorMessage(msg));
      onError?.(msg);
    }
  };

  return (
    <motion.div
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
        sx={getPublicFormShellSx(theme)}
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
              sm: "minmax(0, 6fr) minmax(0, 4fr)",
            },
            gap: 1.5,
            mb: 2,
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
            <Box sx={fieldSx}>
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
                    : isResolvingSlugSuggestion && baseSlugSuggestion
                      ? baseSlugSuggestion
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
                  ...((showSlugSuggestion || isResolvingSlugSuggestion) && {
                    "&::placeholder": {
                      color: alpha(
                        theme.palette.primary.main,
                        showSlugSuggestion ? 0.55 : 0.35,
                      ),
                      opacity: 1,
                    },
                  }),
                }}
              />
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
                isResolvingSuggestion={isResolvingSlugSuggestion}
              />
            )}
          </Box>
        </Box>

        <ShortenSubmitButton loading={isLoading} safetyStatus={safetyStatus} />
      </Box>
    </motion.div>
  );
}

export default URLShortenerForm;
