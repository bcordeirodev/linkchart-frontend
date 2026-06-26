"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  alpha,
  Box,
  Button,
  FormLabel,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ArrowUpRight,
  CheckCircle2,
  Link2,
  SlidersHorizontal,
  Zap,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useCreateLink } from "@/features/links/hooks/useLinks";
import { useUrlSafetyCheck } from "@/features/links/hooks/useUrlSafetyCheck";
import { usePublicSlugSuggestion } from "@/features/links/hooks/usePublicSlugSuggestion";
import { RESERVED_SLUGS } from "@/features/links/utils/slugAvailabilityCheck";
import {
  buildUrlSafetyLabels,
  getUrlSafetyHelperNode,
} from "@/features/links/components/forms/UrlSafetyIndicator";
import { ICON_MD, ICON_SM } from "@/lib/theme/iconDefaults";
import { radiusTokens } from "@/lib/theme/designSystem";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import { useNavigate } from "@/shared/hooks";

import { LinksListSectionHeading } from "./LinksListSectionHeading";
import {
  getLinksBorderColor,
  getLinksQuickCreatePanelSx,
} from "./linksPanelStyles";

import type { LinkResponse } from "@/types";
import type { Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

interface LinksQuickCreateProps {
  /** Called after a link is created (list is invalidated by the mutation). */
  onLinkCreated?: (link: LinkResponse) => void;
}

type QuickFormData = {
  original_url: string;
  custom_slug?: string;
};

/** Matches MUI medium button height for a single control row. */
const CONTROL_HEIGHT = 40;

const getInputRootSx = (theme: Theme) => {
  const bg = theme.palette.background.default;

  return {
    "& .MuiOutlinedInput-root": {
      height: CONTROL_HEIGHT,
      borderRadius: `${radiusTokens.md}px`,
      bgcolor: bg,
      "&:hover": { bgcolor: bg },
      "&.Mui-focused": { bgcolor: `${bg} !important` },
      "& input": {
        py: 0,
        height: "100%",
        boxSizing: "border-box",
      },
      "& input:-webkit-autofill": {
        WebkitBoxShadow: `0 0 0 100px ${bg} inset`,
        WebkitTextFillColor: theme.palette.text.primary,
      },
    },
    "& .MuiFormHelperText-root": {
      mx: 0,
      mt: 0.75,
    },
  };
};

/** Extra styles when slug field shows the «Usar» accept control. */
const slugAcceptAdornmentSx = {
  "& .MuiOutlinedInput-root": {
    height: CONTROL_HEIGHT,
    minHeight: CONTROL_HEIGHT,
    alignItems: "center",
    pr: 1.25,
    "& .MuiOutlinedInput-input": {
      pr: "6px",
    },
  },
  "& .MuiInputAdornment-positionEnd": {
    height: "auto",
    maxHeight: 24,
    ml: 0.75,
    mr: 0.5,
    flexShrink: 0,
  },
} as const;

/** One grid for all breakpoints — avoids duplicate `register()` on hidden fields. */
const formGridSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    md: "minmax(0, 2fr) minmax(0, 1fr) 132px",
  },
  columnGap: 2,
  rowGap: { xs: 1, md: 0.75 },
  alignItems: "start",
} as const;

const mdCell = (row: number, col: number) => ({
  gridRow: { md: row },
  gridColumn: { md: col },
});

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

const getAdvancedOptionsButtonSx = (theme: Theme) => {
  const isDark = theme.palette.mode === "dark";
  const borderColor = getLinksBorderColor(theme);
  const ink = theme.palette.text.primary;

  return {
    "&.MuiButton-sizeSmall": {
      minHeight: 26,
      padding: "2px 8px",
    },
    textTransform: "none",
    fontWeight: 500,
    fontSize: "0.75rem",
    lineHeight: 1.2,
    borderRadius: `${radiusTokens.sm}px`,
    color: "text.secondary",
    borderColor,
    bgcolor: "transparent",
    px: 0.875,
    py: 0.25,
    minHeight: 26,
    whiteSpace: "nowrap",
    boxShadow: "none",
    transition: theme.transitions.create(
      ["background-color", "border-color", "color"],
      { duration: 150 },
    ),
    "& .MuiButton-startIcon": {
      marginRight: 0.375,
      marginLeft: -0.125,
      "& svg": { width: 13, height: 13 },
    },
    "& .MuiButton-endIcon": {
      marginLeft: 0.125,
      marginRight: -0.125,
      "& svg": { width: 12, height: 12 },
    },
    "&:hover": {
      color: "text.primary",
      bgcolor: alpha(ink, isDark ? 0.06 : 0.04),
      borderColor: alpha(ink, isDark ? 0.28 : 0.2),
      boxShadow: "none",
    },
  };
};

/**
 * Inline quick-create form at the top of the links list page.
 */
export function LinksQuickCreate({
  onLinkCreated,
}: LinksQuickCreateProps = {}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
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
          .max(100, t("form.validation.slugMax"))
          .regex(/^[a-zA-Z0-9\-_]+$/, t("form.validation.slugPattern"))
          .refine(
            (s) =>
              !(RESERVED_SLUGS as readonly string[]).includes(s.toLowerCase()),
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

  // One server-side request resolves the slug: it derives the base from the
  // page's og:title (falling back to the URL path/host) and checks global
  // availability in a single call. Replaces the previous client-side approach,
  // which computed two different bases (URL first, then og:title once it loaded
  // asynchronously) and fired a cascade of availability checks — making the
  // suggestion flip from one slug to another mid-resolution. The server check is
  // also global (any link), matching the create's uniqueness rule, whereas the
  // old client check only saw active public links.
  const { slug: availableSlug, status: slugSuggestionStatus } =
    usePublicSlugSuggestion(!slugValue ? urlValue ?? null : null);

  // The suggestion is ambient: a ready slug surfaces as ghost text the user can
  // accept (or ignore). Resolution stays silent — no "searching…" state — so the
  // field never flickers feedback while suggestions are being looked up.
  const showSlugSuggestion =
    !slugValue && slugSuggestionStatus === "ready" && !!availableSlug;

  const acceptSlugSuggestion = useCallback(() => {
    if (availableSlug) {
      setValue("custom_slug", availableSlug, { shouldValidate: true });
    }
  }, [availableSlug, setValue]);

  const urlIsUnsafe = safetyStatus === "unsafe";
  const urlIsChecking = safetyStatus === "checking";

  const urlSafetyLabels = buildUrlSafetyLabels(t);
  // Safety is silent by default: a confirmed-safe URL or an in-flight check shows
  // nothing. The field speaks only to report a real problem — an invalid URL
  // (zod) or an unsafe destination (in error tone). The submit guard below still
  // blocks unsafe/checking regardless of what is shown here.
  const urlHelperText: ReactNode =
    errors.original_url?.message ??
    (urlIsUnsafe
      ? getUrlSafetyHelperNode("unsafe", threats, urlSafetyLabels)
      : " ");

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

  const inputRootSx = getInputRootSx(theme);
  const primary = theme.palette.primary.main;
  // Slug field stays silent unless the value is actually invalid. The suggestion
  // affordance lives inline (ghost text + accept button), not in helper copy.
  const slugHelperText = errors.custom_slug?.message;

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
          descriptionSx={{ display: { xs: "none", sm: "block" } }}
          sx={{ mb: { xs: 1.25, sm: 1.75 } }}
          action={
            <Tooltip title={t("list.quickCreate.moreOptionsTooltip")} arrow>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate("/links/create")}
                startIcon={<SlidersHorizontal size={13} strokeWidth={1.75} />}
                endIcon={<ArrowUpRight size={12} strokeWidth={2} />}
                sx={getAdvancedOptionsButtonSx(theme)}
              >
                {t("list.quickCreate.moreOptions")}
              </Button>
            </Tooltip>
          }
        />

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={formGridSx}>
            <FormLabel
              sx={{
                ...mdCell(1, 1),
                display: "block",
                lineHeight: 1.25,
                order: { xs: 1, md: "unset" },
              }}
            >
              {t("list.quickCreate.urlLabel")}
            </FormLabel>
            <FormLabel
              sx={{
                ...mdCell(1, 2),
                display: "block",
                lineHeight: 1.25,
                order: { xs: 4, md: "unset" },
              }}
            >
              {t("list.quickCreate.slugLabel")}
            </FormLabel>
            <Box
              aria-hidden
              sx={{ ...mdCell(1, 3), display: { xs: "none", md: "block" } }}
            />

            <TextField
              {...register("original_url")}
              placeholder={t("list.quickCreate.urlPlaceholder")}
              size="small"
              fullWidth
              error={!!errors.original_url || urlIsUnsafe}
              helperText={urlHelperText === " " ? undefined : urlHelperText}
              disabled={isPending}
              sx={[
                inputRootSx,
                mdCell(2, 1),
                { order: { xs: 2, md: "unset" } },
              ]}
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
                },
                formHelperText: {
                  sx: { display: { md: "none" } },
                },
              }}
            />

            <TextField
              {...register("custom_slug")}
              placeholder={
                showSlugSuggestion
                  ? availableSlug!
                  : t("list.quickCreate.slugPlaceholder")
              }
              onKeyDown={(e) => {
                if (e.key === "Tab" && showSlugSuggestion) {
                  acceptSlugSuggestion();
                }
              }}
              size="small"
              fullWidth
              error={!!errors.custom_slug}
              helperText={slugHelperText}
              disabled={isPending}
              sx={[
                inputRootSx,
                showSlugSuggestion && slugAcceptAdornmentSx,
                mdCell(2, 2),
                { order: { xs: 5, md: "unset" } },
              ]}
              slotProps={{
                input: {
                  sx: {
                    fontFamily: "monospace",
                    fontWeight: 500,
                    ...(showSlugSuggestion
                      ? {
                          "&::placeholder": {
                            color: alpha(primary, 0.55),
                            opacity: 1,
                          },
                        }
                      : undefined),
                  },
                  endAdornment: showSlugSuggestion ? (
                    <InputAdornment position="end">
                      <Box
                        component="button"
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                          e.stopPropagation();
                          acceptSlugSuggestion();
                        }}
                        sx={{
                          border: "none",
                          cursor: "pointer",
                          font: "inherit",
                          fontSize: "0.6875rem",
                          fontWeight: 600,
                          lineHeight: 1,
                          py: 0.25,
                          px: 0.625,
                          borderRadius: `${radiusTokens.sm}px`,
                          color: primary,
                          bgcolor: alpha(primary, isDark ? 0.12 : 0.08),
                          transition: "background-color 120ms ease",
                          "&:hover": {
                            bgcolor: alpha(primary, isDark ? 0.2 : 0.14),
                          },
                        }}
                      >
                        {t("list.quickCreate.slugAccept")}
                      </Box>
                    </InputAdornment>
                  ) : undefined,
                },
                formHelperText: {
                  sx: {
                    display: { md: "none" },
                    color: "text.secondary",
                    fontSize: "0.75rem",
                    lineHeight: 1.45,
                  },
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isPending || urlIsUnsafe || urlIsChecking}
              startIcon={
                succeeded ? <CheckCircle2 {...ICON_SM} /> : <Zap {...ICON_SM} />
              }
              sx={[
                submitButtonSx,
                mdCell(2, 3),
                { order: { xs: 6, md: "unset" } },
              ]}
            >
              {succeeded
                ? t("list.quickCreate.success")
                : t("list.quickCreate.submit")}
            </Button>

            <Box
              sx={{
                ...mdCell(3, 1),
                minWidth: 0,
                display: { xs: "none", md: "block" },
              }}
            >
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
            <Box
              sx={{
                ...mdCell(3, 2),
                minWidth: 0,
                display: { xs: "none", md: "block" },
              }}
            >
              {errors.custom_slug?.message ? (
                <Typography variant="caption" color="error">
                  {errors.custom_slug.message}
                </Typography>
              ) : slugHelperText ? (
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", lineHeight: 1.45 }}
                >
                  {slugHelperText}
                </Typography>
              ) : null}
            </Box>
            <Box
              aria-hidden
              sx={{ ...mdCell(3, 3), display: { xs: "none", md: "block" } }}
            />
          </Box>
        </Box>
      </Box>
    </EnhancedPaper>
  );
}

export default LinksQuickCreate;
