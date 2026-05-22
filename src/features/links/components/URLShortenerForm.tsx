"use client";
import { useRef } from "react";
import type React from "react";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Globe,
  Link2,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { usePublicURLShortener } from "@/features/links/hooks/usePublicURLShortener";
import { useSlugAvailability } from "@/features/links/hooks/useSlugAvailability";
import { useUrlSafetyCheck } from "@/features/links/hooks/useUrlSafetyCheck";
import { useUrlMeta } from "@/features/links/hooks/useUrlMeta";
import { slugify } from "@/features/links/utils/slugify";
import { ApiError } from "@/lib/api/client";
import { useAppDispatch } from "@/lib/store/hooks";
import { showErrorMessage } from "@/lib/store/messageSlice";
import {
  getPublicFormFieldSx,
  getPublicFormShellSx,
} from "@/lib/theme/publicPageStyles";
import { GradientButton } from "@/shared/ui/base/GradientButton";
import { ICON_SM } from "@/lib/theme/iconDefaults";

import {
  getUrlShortenerInputSx,
  getUrlShortenerLabelSx,
} from "./urlShortenerFormStyles";

import type { UrlSafetyStatus } from "@/features/links/hooks/useUrlSafetyCheck";
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

const safetyColors: Record<UrlSafetyStatus, string> = {
  idle: "transparent",
  checking: "rgba(255,255,255,0.3)",
  safe: "#34d399",
  unsafe: "#f87171",
  error: "rgba(255,255,255,0.2)",
};

const safetyIcons: Record<UrlSafetyStatus, React.ReactNode> = {
  idle: null,
  checking: null,
  safe: <ShieldCheck {...ICON_SM} color="#34d399" />,
  unsafe: <ShieldAlert {...ICON_SM} color="#f87171" />,
  error: <ShieldOff {...ICON_SM} color="rgba(255,255,255,0.2)" />,
};

export function URLShortenerForm({
  onSuccess,
  onError,
  loading: externalLoading,
}: URLShortenerFormProps) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { t } = useTranslation("public");
  const fieldSx = getPublicFormFieldSx(theme);
  const labelSx = getUrlShortenerLabelSx(theme);
  const inputSx = getUrlShortenerInputSx(theme);
  const iconMuted = alpha(theme.palette.text.primary, 0.38);
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
  const isLoading = loading || externalLoading;

  const urlValue = watch("originalUrl");
  const slugValue = watch("customSlug");
  const { status: safetyStatus, threats } = useUrlSafetyCheck(urlValue ?? "");
  const slugAvailability = useSlugAvailability(slugValue ?? "");

  // Metadata-based slug suggestion — authenticated users only (endpoint
  // requires api.auth; unauthenticated users silently get ogTitle=null)
  const { ogTitle } = useUrlMeta(urlValue ?? "");
  const slugSuggestion = ogTitle ? slugify(ogTitle) : null;

  // Keep a ref so the submit handler always reads the latest og:title without
  // needing it in the callback's dependency list
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

  const safetyLabel =
    safetyStatus === "unsafe"
      ? t("shorter.form.safetyBlocked", { threats: threats.join(", ") })
      : safetyStatus === "checking"
        ? t("shorter.form.safetyChecking")
        : safetyStatus === "safe"
          ? t("shorter.form.safetySafe")
          : safetyStatus === "error"
            ? t("shorter.form.safetyError")
            : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{
        opacity: isLoading ? 0.7 : 1,
        y: 0,
        scale: isLoading ? 0.985 : 1,
      }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ maxWidth: 800, margin: "0 auto" }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={getPublicFormShellSx(theme)}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "minmax(0, 7fr) minmax(0, 3fr)",
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
                sx={{ fontSize: "0.75rem", color: "#f87171", mt: 0.5, pl: 0.5 }}
              >
                {errors.originalUrl.message}
              </Typography>
            ) : safetyStatus === "safe" ? (
              <motion.span
                key="safe-chip"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 4,
                  marginLeft: 4,
                  padding: "2px 8px 2px 6px",
                  borderRadius: 100,
                  background: "rgba(52, 211, 153, 0.08)",
                  border: "1px solid rgba(52, 211, 153, 0.20)",
                  color: "#34d399",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                {safetyIcons.safe}
                {safetyLabel}
              </motion.span>
            ) : safetyStatus !== "idle" ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  mt: 0.5,
                  pl: 0.5,
                }}
              >
                {safetyIcons[safetyStatus]}
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: safetyColors[safetyStatus],
                    fontWeight: safetyStatus === "unsafe" ? 600 : 400,
                  }}
                >
                  {safetyLabel}
                </Typography>
              </Box>
            ) : null}
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
                    value: /^[a-z0-9-]{3,50}$/,
                    message: t("shorter.form.slugInvalid"),
                  },
                })}
                placeholder={
                  !slugValue && slugSuggestion
                    ? slugSuggestion
                    : t("shorter.form.slugPlaceholder")
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Tab" && !slugValue && slugSuggestion) {
                    setValue("customSlug", slugSuggestion, {
                      shouldValidate: true,
                    });
                  }
                }}
                sx={inputSx}
              />
            </Box>
            {errors.customSlug ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mt: 0.5,
                  pl: 0.5,
                }}
              >
                <XCircle size={12} color="#f87171" />
                <Typography sx={{ fontSize: "0.6875rem", color: "#f87171" }}>
                  {errors.customSlug.message}
                </Typography>
              </Box>
            ) : slugAvailability === "checking" ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mt: 0.5,
                  pl: 0.5,
                }}
              >
                <Loader2
                  size={12}
                  color="rgba(255,255,255,0.3)"
                  style={{ animation: "spin 1s linear infinite" }}
                />
                <Typography
                  sx={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.3)" }}
                >
                  {t("shorter.form.slugChecking")}
                </Typography>
              </Box>
            ) : slugAvailability === "available" ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mt: 0.5,
                  pl: 0.5,
                }}
              >
                <CheckCircle2 size={12} color="#34d399" />
                <Typography
                  sx={{
                    fontSize: "0.6875rem",
                    color: "#34d399",
                    fontWeight: 500,
                  }}
                >
                  {t("shorter.form.slugAvailable")}
                </Typography>
              </Box>
            ) : slugAvailability === "taken" ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mt: 0.5,
                  pl: 0.5,
                }}
              >
                <XCircle size={12} color="#f87171" />
                <Typography
                  sx={{
                    fontSize: "0.6875rem",
                    color: "#f87171",
                    fontWeight: 500,
                  }}
                >
                  {t("shorter.form.slugTaken")}
                </Typography>
              </Box>
            ) : null}
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </Box>
        </Box>

        <GradientButton
          type="submit"
          size="large"
          loading={isLoading}
          shimmerEffect
          sx={{ width: "100%", minHeight: 52, fontWeight: 700 }}
        >
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                justifyContent: "center",
              }}
            >
              <CircularProgress
                size={16}
                thickness={5}
                sx={{ color: "rgba(255,255,255,0.75)" }}
              />
              {t("shorter.shortening")}
            </Box>
          ) : (
            t("shorter.form.submitButton")
          )}
        </GradientButton>
      </Box>
    </motion.div>
  );
}

export default URLShortenerForm;
