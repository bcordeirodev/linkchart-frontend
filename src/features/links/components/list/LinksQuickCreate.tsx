"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  CircularProgress,
  FormLabel,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ArrowUpRight, CheckCircle2, Link2, Zap } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useCreateLink } from "@/features/links/hooks/useLinks";
import { useUrlSafetyCheck } from "@/features/links/hooks/useUrlSafetyCheck";
import { useUrlMeta } from "@/features/links/hooks/useUrlMeta";
import { slugify } from "@/features/links/utils/slugify";
import { getUrlSafetyHelperNode } from "@/features/links/components/forms/UrlSafetyIndicator";
import { ICON_MD, ICON_SM } from "@/lib/theme/iconDefaults";
import { radiusTokens } from "@/lib/theme/designSystem";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import { useNavigate } from "@/shared/hooks";

import { LinksListSectionHeading } from "./LinksListSectionHeading";
import { getLinksQuickCreatePanelSx } from "./linksPanelStyles";

import type { LinkResponse } from "@/types";
import type { ReactNode } from "react";

interface LinksQuickCreateProps {
  /** Called after a link is created (list is invalidated by the mutation). */
  onLinkCreated?: (link: LinkResponse) => void;
}

const RESERVED_SLUGS = ["api", "admin", "www", "mail", "ftp", "r", "redirect"];

type QuickFormData = {
  original_url: string;
  custom_slug?: string;
};

/** Matches MUI medium button height for a single control row. */
const CONTROL_HEIGHT = 40;

const inputRootSx = {
  "& .MuiOutlinedInput-root": {
    height: CONTROL_HEIGHT,
    borderRadius: `${radiusTokens.md}px`,
    bgcolor: "background.default",
    "& input": {
      py: 0,
      height: "100%",
      boxSizing: "border-box",
    },
  },
  "& .MuiFormHelperText-root": {
    mx: 0,
    mt: 0.75,
  },
};

const submitButtonSx = {
  height: CONTROL_HEIGHT,
  minHeight: CONTROL_HEIGHT,
  textTransform: "none",
  fontWeight: 600,
  minWidth: { md: 132 },
  borderRadius: `${radiusTokens.md}px`,
  whiteSpace: "nowrap",
  px: 2.5,
};

/**
 * Inline quick-create form at the top of the links list page.
 */
export function LinksQuickCreate({
  onLinkCreated,
}: LinksQuickCreateProps = {}) {
  const theme = useTheme();
  const { t } = useTranslation("links");
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateLink();
  const [succeeded, setSucceeded] = useState(false);

  const schema = useMemo(
    () =>
      z.object({
        original_url: z
          .string()
          .min(1, t("form.validation.urlRequired"))
          .url(t("form.validation.urlInvalid"))
          .regex(/^https?:\/\//, t("form.validation.urlScheme")),
        custom_slug: z
          .string()
          .min(3, t("form.validation.slugMin"))
          .max(50, t("form.validation.slugMax"))
          .regex(/^[a-zA-Z0-9\-_]+$/, t("form.validation.slugPattern"))
          .refine(
            (s) => !RESERVED_SLUGS.includes(s.toLowerCase()),
            t("form.validation.slugReserved"),
          )
          .optional()
          .or(z.literal("")),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuickFormData>({
    resolver: zodResolver(schema),
    defaultValues: { original_url: "", custom_slug: "" },
  });

  const urlValue = watch("original_url");
  const slugValue = watch("custom_slug");
  const { status: safetyStatus, threats } = useUrlSafetyCheck(urlValue ?? "");

  // Metadata-based slug suggestion
  const { ogTitle, isLoading: isLoadingMeta } = useUrlMeta(urlValue ?? "");
  const slugSuggestion = ogTitle ? slugify(ogTitle) : null;

  const urlIsUnsafe = safetyStatus === "unsafe";
  const urlIsChecking = safetyStatus === "checking";

  const urlHelperText: ReactNode = errors.original_url?.message
    ? errors.original_url.message
    : safetyStatus !== "idle"
      ? getUrlSafetyHelperNode(safetyStatus, threats, t)
      : " ";

  const onSubmit = useCallback<SubmitHandler<QuickFormData>>(
    async (data): Promise<void> => {
      if (urlIsUnsafe || urlIsChecking) return;
      const created = await mutateAsync({
        original_url: data.original_url,
        custom_slug: data.custom_slug || undefined,
      });
      onLinkCreated?.(created);
      setSucceeded(true);
      reset();
      setTimeout(() => setSucceeded(false), 2000);
    },
    [mutateAsync, onLinkCreated, reset, urlIsUnsafe, urlIsChecking],
  );

  return (
    <EnhancedPaper
      variant="outlined"
      animated={false}
      sx={{ mb: 0, ...getLinksQuickCreatePanelSx(theme) }}
    >
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <LinksListSectionHeading
          icon={<Zap {...ICON_MD} />}
          title={t("list.quickCreate.label")}
          description={t("list.quickCreate.description")}
          action={
            <Tooltip title={t("list.quickCreate.moreOptionsTooltip")} arrow>
              <Button
                variant="text"
                size="small"
                onClick={() => navigate("/links/create")}
                endIcon={<ArrowUpRight size={14} strokeWidth={2} />}
                sx={{
                  textTransform: "none",
                  color: "text.secondary",
                  "&:hover": { color: "text.primary", bgcolor: "action.hover" },
                }}
              >
                {t("list.quickCreate.moreOptions")}
              </Button>
            </Tooltip>
          }
        />

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Labels — desktop only (mobile uses placeholders) */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 2,
              mb: 0.75,
            }}
          >
            <FormLabel sx={{ flex: 2, minWidth: 0 }}>
              {t("list.quickCreate.urlLabel")}
            </FormLabel>
            <FormLabel sx={{ flex: 1, minWidth: 0 }}>
              {t("list.quickCreate.slugLabel")}
            </FormLabel>
            <Box sx={{ width: 132, flexShrink: 0 }} aria-hidden />
          </Box>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", md: "center" }}
          >
            <Box sx={{ flex: { md: 2 }, minWidth: 0 }}>
              <FormLabel
                sx={{ display: { xs: "block", md: "none" }, mb: 0.75 }}
              >
                {t("list.quickCreate.urlLabel")}
              </FormLabel>
              <TextField
                {...register("original_url")}
                placeholder={t("list.quickCreate.urlPlaceholder")}
                size="small"
                fullWidth
                error={!!errors.original_url || urlIsUnsafe}
                helperText={urlHelperText}
                disabled={isPending}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Link2
                          {...ICON_SM}
                          color={theme.palette.text.secondary}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: isLoadingMeta ? (
                      <InputAdornment position="end">
                        <CircularProgress
                          size={14}
                          thickness={5}
                          sx={{ color: "text.disabled" }}
                        />
                      </InputAdornment>
                    ) : undefined,
                  },
                  formHelperText: {
                    sx: {
                      display: { md: "none" },
                      minHeight: urlHelperText === " " ? 0 : undefined,
                    },
                  },
                }}
                sx={inputRootSx}
              />
            </Box>

            <Box sx={{ flex: { md: 1 }, minWidth: 0 }}>
              <FormLabel
                sx={{ display: { xs: "block", md: "none" }, mb: 0.75 }}
              >
                {t("list.quickCreate.slugLabel")}
              </FormLabel>
              <TextField
                {...register("custom_slug")}
                placeholder={
                  !slugValue && slugSuggestion
                    ? slugSuggestion
                    : t("list.quickCreate.slugPlaceholder")
                }
                onKeyDown={(e) => {
                  if (e.key === "Tab" && !slugValue && slugSuggestion) {
                    setValue("custom_slug", slugSuggestion, {
                      shouldValidate: true,
                    });
                  }
                }}
                size="small"
                fullWidth
                error={!!errors.custom_slug}
                helperText={errors.custom_slug?.message}
                disabled={isPending}
                slotProps={{
                  input: {
                    sx: { fontFamily: "monospace", fontWeight: 500 },
                  },
                  formHelperText: {
                    sx: { display: { md: "none" } },
                  },
                }}
                sx={inputRootSx}
              />
            </Box>

            <Box sx={{ flexShrink: 0, width: { md: 132 } }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isPending || urlIsUnsafe || urlIsChecking}
                startIcon={
                  succeeded ? (
                    <CheckCircle2 {...ICON_SM} />
                  ) : (
                    <Zap {...ICON_SM} />
                  )
                }
                sx={submitButtonSx}
              >
                {succeeded
                  ? t("list.quickCreate.success")
                  : t("list.quickCreate.submit")}
              </Button>
            </Box>
          </Stack>

          {/* Helpers below the aligned row on desktop */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 2,
              mt: 0.75,
            }}
          >
            <Box sx={{ flex: 2, minWidth: 0 }}>
              {urlHelperText !== " " ? (
                <Typography
                  variant="caption"
                  component="div"
                  color={
                    errors.original_url || urlIsUnsafe
                      ? "error"
                      : "text.secondary"
                  }
                >
                  {urlHelperText}
                </Typography>
              ) : null}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {errors.custom_slug?.message ? (
                <Typography variant="caption" color="error">
                  {errors.custom_slug.message}
                </Typography>
              ) : null}
            </Box>
            <Box sx={{ width: 132, flexShrink: 0 }} />
          </Box>
        </Box>
      </Box>
    </EnhancedPaper>
  );
}

export default LinksQuickCreate;
