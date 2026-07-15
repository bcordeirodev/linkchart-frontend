"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  alpha,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Stack,
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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useCreateLink } from "@/features/links/hooks/useLinks";
import { useUrlSafetyCheck } from "@/features/links/hooks/useUrlSafetyCheck";
import { usePublicSlugSuggestion } from "@/features/links/hooks/usePublicSlugSuggestion";
import { useSlugAvailability } from "@/features/links/hooks/useSlugAvailability";
import { RESERVED_SLUGS } from "@/features/links/utils/slugAvailabilityCheck";
import {
  buildSlugAvailabilityLabels,
  buildUrlSafetyLabels,
  getUrlSafetyHelperNode,
} from "@/features/links/components/forms/UrlSafetyIndicator";
import { SubdomainSelect } from "@/features/subdomains/components/SubdomainSelect";
import { useSubdomainSelection } from "@/features/subdomains/hooks/useSubdomainSelection";
import { ICON_MD, ICON_SM } from "@/lib/theme/iconDefaults";
import { darkNeutral } from "@/lib/theme/colors";
import { getShortUrlPrefixForSubdomain } from "@/lib/utils/shortUrl";
import { HelpHint } from "@/shared/ui/base";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import { useNavigate } from "@/shared/hooks";

import { LinksListSectionHeading } from "./LinksListSectionHeading";
import {
  linksRadius,
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
  // Nível "input" da escala: em dark o campo é um passo mais claro que o
  // painel (não mais escuro que ele); em light o cinza de página recua bem.
  const bg =
    theme.palette.mode === "dark"
      ? darkNeutral.input
      : theme.palette.background.default;

  return {
    "& .MuiOutlinedInput-root": {
      height: CONTROL_HEIGHT,
      // Radius sm: controles internos um degrau abaixo do painel (md) —
      // hierarquia de arredondamento em vez de tudo igualmente redondo.
      borderRadius: `${linksRadius.control}px`,
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

/**
 * One grid for all breakpoints — avoids duplicate `register()` on hidden
 * fields. Uma linha só de controles (placeholders carregam o significado;
 * labels viram aria-label) + linha de helper que só existe quando há mensagem.
 */
const formGridSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    md: "minmax(0, 2fr) minmax(0, 1fr) 132px",
  },
  columnGap: 2,
  rowGap: { xs: 1.25, md: 0.75 },
  alignItems: "start",
} as const;

const mdCell = (row: number, col: number) => ({
  gridRow: { md: row },
  gridColumn: { md: col },
});

const submitButtonSx = {
  // ≥44px de alvo de toque no mobile; alinhado aos inputs (40) no desktop.
  height: { xs: 44, md: CONTROL_HEIGHT },
  minHeight: { xs: 44, md: CONTROL_HEIGHT },
  textTransform: "none",
  fontWeight: 600,
  minWidth: { md: 132 },
  borderRadius: `${linksRadius.control}px`,
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
    borderRadius: `${linksRadius.control}px`,
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
  const {
    subdomains,
    subdomainId,
    setSubdomainId,
    selected: selectedSubdomain,
  } = useSubdomainSelection();
  // Only shown/considered once the flag is on AND the account actually holds
  // a subdomain — otherwise quick-create stays exactly as it was: no domain
  // prefix, no extra control, one less thing to look at for the common case.
  // Mirrors `SubdomainSelect`'s own hide condition so the label next to it
  // never renders above an empty control.
  const hasSubdomains =
    process.env.NEXT_PUBLIC_SUBDOMAINS_ENABLED === "true" &&
    subdomains.length > 0;
  const shortUrlPrefix = hasSubdomains
    ? getShortUrlPrefixForSubdomain(selectedSubdomain)
    : null;

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

  // A ready slug surfaces as ghost text the user can accept (or ignore).
  //
  // Resolution used to be silent, on the theory that a "searching…" state would
  // make the field flicker. In practice it read as broken: the server has to
  // fetch the destination page to derive the slug from its og:title (~1s), so the
  // field just sat there dead and the suggestion only landed after the user had
  // already given up and tabbed away — which looked like "it only suggests on
  // blur". A quiet spinner costs nothing and makes that second legible.
  const showSlugSuggestion =
    !slugValue && slugSuggestionStatus === "ready" && !!availableSlug;
  const isResolvingSlug = !slugValue && slugSuggestionStatus === "resolving";

  // A *suggested* slug is checked against the DB before it is offered (the
  // server only ever suggests a free one). A slug the user types themselves is
  // not — so it gets its own availability check, the same one the full create
  // form uses. Without it, "already taken" only surfaced as a 422 on submit.
  const typedSlug = slugValue?.trim() ?? "";
  const slugAvailability = useSlugAvailability(typedSlug);
  const slugAvailabilityLabels = buildSlugAvailabilityLabels(t);
  const slugIsTaken = !!typedSlug && slugAvailability === "taken";
  const slugIsChecking = !!typedSlug && slugAvailability === "checking";
  const slugIsAvailable = !!typedSlug && slugAvailability === "available";

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

  // Extracted so a submit that arrived while the safety check was still running
  // can be replayed once the check settles (see the queue effect below).
  const pendingSubmitDataRef = useRef<QuickFormData | null>(null);
  const [submitQueued, setSubmitQueued] = useState(false);

  const createLink = useCallback(
    async (data: QuickFormData): Promise<void> => {
      try {
        const created = await mutateAsync({
          original_url: data.original_url,
          custom_slug: data.custom_slug || undefined,
          // `useSubdomainSelection()` defaults this to the account's oldest
          // active subdomain (or `null` with none held) — same default the
          // backend applies when the field is omitted.
          subdomain_id: subdomainId,
        });
        onLinkCreated?.(created);
        setSucceeded(true);
        reset();
        setTimeout(() => setSucceeded(false), 2000);
      } catch {
        // The mutation's onError already dispatches an error toast; swallow the
        // rejection so the queued (void) call can't become an unhandled one.
      }
    },
    [mutateAsync, onLinkCreated, reset, subdomainId],
  );

  const onSubmit = useCallback<SubmitHandler<QuickFormData>>(
    async (data): Promise<void> => {
      // Unsafe is a hard block. A still-running check queues the submit instead
      // of greying the button — it fires automatically once the check settles,
      // so the button never flickers disabled mid-check.
      if (urlIsUnsafe) return;
      // A slug we already know is taken would just come back as a 422.
      if (slugIsTaken) return;
      if (urlIsChecking) {
        pendingSubmitDataRef.current = data;
        setSubmitQueued(true);
        return;
      }
      await createLink(data);
    },
    [urlIsUnsafe, urlIsChecking, slugIsTaken, createLink],
  );

  // Flush a queued submit when the safety check settles: create on safe/error
  // (error fails open, matching the submit gate), and drop on unsafe or when the
  // URL is cleared/changed (back to idle).
  useEffect(() => {
    if (!submitQueued) {
      return;
    }
    if (safetyStatus === "safe" || safetyStatus === "error") {
      const data = pendingSubmitDataRef.current;
      pendingSubmitDataRef.current = null;
      setSubmitQueued(false);
      if (data) {
        void createLink(data);
      }
    } else if (safetyStatus === "unsafe" || safetyStatus === "idle") {
      pendingSubmitDataRef.current = null;
      setSubmitQueued(false);
    }
  }, [safetyStatus, submitQueued, createLink]);

  const inputRootSx = getInputRootSx(theme);
  const primary = theme.palette.primary.main;
  // Only real problems get a helper row — a taken slug or a malformed one. The
  // in-progress and all-clear states of the availability check live inside the
  // field (spinner / check icon) so the helper row never appears and disappears
  // under the input, which used to shift the whole form vertically.
  const slugHelperText =
    errors.custom_slug?.message ??
    (slugIsTaken ? slugAvailabilityLabels.taken : undefined);

  return (
    <EnhancedPaper
      variant="outlined"
      animated={false}
      sx={{ mb: 0, ...getLinksQuickCreatePanelSx(theme) }}
    >
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <LinksListSectionHeading
          icon={<Zap {...ICON_MD} />}
          iconChip
          title={t("list.quickCreate.label")}
          description={t("list.quickCreate.description")}
          descriptionSx={{ display: { xs: "none", sm: "block" } }}
          sx={{ mb: { xs: 1.5, sm: 2 } }}
          action={
            <Stack direction="row" spacing={0.5} alignItems="center">
              <HelpHint label={t("list.onboarding.hintQuickCreate")} />
              <Tooltip title={t("list.quickCreate.moreOptionsTooltip")} arrow>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate("/links/create")}
                  aria-label={t("list.quickCreate.moreOptions")}
                  startIcon={<SlidersHorizontal size={13} strokeWidth={1.75} />}
                  endIcon={<ArrowUpRight size={12} strokeWidth={2} />}
                  sx={[
                    getAdvancedOptionsButtonSx(theme),
                    {
                      // xs: só o ícone — deixa o título do header em uma linha.
                      "& .MuiButton-startIcon": {
                        mr: { xs: 0, sm: 0.375 },
                      },
                      "& .MuiButton-endIcon": {
                        display: { xs: "none", sm: "inline-flex" },
                      },
                    },
                  ]}
                >
                  <Box
                    component="span"
                    sx={{ display: { xs: "none", sm: "inline" } }}
                  >
                    {t("list.quickCreate.moreOptions")}
                  </Box>
                </Button>
              </Tooltip>
            </Stack>
          }
        />

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {hasSubdomains ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: { xs: 1.25, md: 1 },
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ flexShrink: 0 }}
              >
                {t("list.quickCreate.subdomainLabel")}
              </Typography>
              <Box sx={{ maxWidth: 220 }}>
                <SubdomainSelect
                  value={subdomainId}
                  onChange={setSubdomainId}
                  size="small"
                  aria-label={t("list.quickCreate.subdomainLabel")}
                />
              </Box>
            </Box>
          ) : null}

          <Box sx={formGridSx}>
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
                mdCell(1, 1),
                { order: { xs: 1, md: "unset" } },
              ]}
              slotProps={{
                htmlInput: {
                  "aria-label": t("list.quickCreate.urlLabel"),
                },
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
              error={!!errors.custom_slug || slugIsTaken}
              helperText={slugHelperText}
              disabled={isPending}
              sx={[
                inputRootSx,
                (showSlugSuggestion ||
                  isResolvingSlug ||
                  slugIsChecking ||
                  slugIsAvailable) &&
                  slugAcceptAdornmentSx,
                mdCell(1, 2),
                { order: { xs: 2, md: "unset" } },
              ]}
              slotProps={{
                htmlInput: {
                  "aria-label": t("list.quickCreate.slugLabel"),
                },
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
                  // Only rendered once the account holds a subdomain — it's the
                  // live preview of the resulting short URL, so it must track
                  // `subdomainId` (see `shortUrlPrefix` above) instead of always
                  // assuming the default domain.
                  startAdornment: shortUrlPrefix ? (
                    <InputAdornment position="start">
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{
                          fontFamily: "monospace",
                          color: "text.secondary",
                          pr: 0.5,
                          maxWidth: 120,
                          fontSize: "0.75rem",
                        }}
                      >
                        {shortUrlPrefix}
                      </Typography>
                    </InputAdornment>
                  ) : undefined,
                  // One slot, four states — the indicator swaps in place so the
                  // field never reflows. Suggestion path: resolving (spinner) →
                  // ready («Usar»). Typed-slug path: checking the DB (spinner) →
                  // free (check). A taken slug speaks in the helper row instead.
                  endAdornment:
                    isResolvingSlug || slugIsChecking ? (
                      <InputAdornment position="end">
                        <CircularProgress
                          size={14}
                          thickness={5}
                          aria-label={
                            slugIsChecking
                              ? slugAvailabilityLabels.checking
                              : t("list.quickCreate.slugSuggestionChecking")
                          }
                          sx={{ color: alpha(primary, 0.6) }}
                        />
                      </InputAdornment>
                    ) : slugIsAvailable ? (
                      <InputAdornment position="end">
                        <CheckCircle2
                          size={15}
                          strokeWidth={2.25}
                          aria-label={slugAvailabilityLabels.available}
                          color={theme.palette.success.main}
                        />
                      </InputAdornment>
                    ) : showSlugSuggestion ? (
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
                            borderRadius: `${linksRadius.control}px`,
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
              disabled={isPending || urlIsUnsafe || submitQueued || slugIsTaken}
              startIcon={
                succeeded ? (
                  <CheckCircle2 {...ICON_SM} />
                ) : isPending || submitQueued ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <Zap {...ICON_SM} />
                )
              }
              sx={[
                submitButtonSx,
                mdCell(1, 3),
                { order: { xs: 3, md: "unset" } },
              ]}
            >
              {succeeded
                ? t("list.quickCreate.success")
                : t("list.quickCreate.submit")}
            </Button>

            {/* Helpers desktop: linha 2 só materializa quando há mensagem. */}
            {urlHelperText !== " " ? (
              <Box
                sx={{
                  ...mdCell(2, 1),
                  minWidth: 0,
                  display: { xs: "none", md: "block" },
                }}
              >
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
              </Box>
            ) : null}
            {slugHelperText ? (
              <Box
                sx={{
                  ...mdCell(2, 2),
                  minWidth: 0,
                  display: { xs: "none", md: "block" },
                }}
              >
                <Typography variant="caption" color="error">
                  {slugHelperText}
                </Typography>
              </Box>
            ) : null}
          </Box>
        </Box>
      </Box>
    </EnhancedPaper>
  );
}

export default LinksQuickCreate;
