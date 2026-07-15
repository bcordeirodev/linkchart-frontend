"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  alpha,
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
import { useSubdomain } from "@/features/profile/hooks/useSubdomain";
import { getShortUrlPrefixForSubdomain } from "@/lib/utils/shortUrl";
import { RESERVED_SLUGS } from "@/features/links/utils/slugAvailabilityCheck";
import {
  buildSlugAvailabilityLabels,
  buildUrlSafetyLabels,
  getUrlSafetyHelperNode,
} from "@/features/links/components/forms/UrlSafetyIndicator";
import { ICON_MD, ICON_SM } from "@/lib/theme/iconDefaults";
import { darkNeutral } from "@/lib/theme/colors";
import { HelpHint } from "@/shared/ui/base";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import { useNavigate } from "@/shared/hooks";

import { LinksListSectionHeading } from "./LinksListSectionHeading";
import {
  linksRadius,
  getLinksBorderColor,
  getLinkCardInnerBorderColor,
  getLinksInsetBg,
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
 * Field grid: three labeled cells on one row (link · custom name · submit).
 * Each cell stacks its own `FormLabel` above its control, so the row reads as
 * a proper form instead of bare inputs floating in space. `alignItems: start`
 * keeps every control's top edge on the same axis; the submit cell carries an
 * invisible label spacer so its button lines up with the two inputs below their
 * labels. On mobile the three cells stack in DOM order.
 */
const formGridSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    md: "minmax(0, 2fr) minmax(0, 1fr) 132px",
  },
  columnGap: 2,
  rowGap: { xs: 1.75, md: 0 },
  alignItems: "start",
} as const;

/** Small field label above each quick-create control. */
const fieldLabelSx = {
  display: "block",
  mb: 0.75,
  fontSize: "0.75rem",
  fontWeight: 600,
  lineHeight: 1.3,
  letterSpacing: "0.01em",
  color: "text.secondary",
  // Neutral even while the input inside the cell is focused.
  "&.Mui-focused": { color: "text.secondary" },
} as const;

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
  const { subdomain } = useSubdomain();
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
      // The smart suggestion is the default: when the user hasn't typed a name,
      // submit the very slug the preview is showing (the resolved suggestion), so
      // the saved link matches the preview instead of getting a fresh random slug
      // from the backend. A typed name always wins; a not-yet-ready suggestion
      // (the submit was queued below) falls through to a backend random, which is
      // honest because in that state the preview was only showing the placeholder.
      const typed = data.custom_slug?.trim();
      const effectiveSlug =
        typed || (slugSuggestionStatus === "ready" ? availableSlug : null);
      try {
        const created = await mutateAsync({
          original_url: data.original_url,
          custom_slug: effectiveSlug || undefined,
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
    [mutateAsync, onLinkCreated, reset, availableSlug, slugSuggestionStatus],
  );

  const onSubmit = useCallback<SubmitHandler<QuickFormData>>(
    async (data): Promise<void> => {
      // Unsafe is a hard block. A still-running check queues the submit instead
      // of greying the button — it fires automatically once the check settles,
      // so the button never flickers disabled mid-check.
      if (urlIsUnsafe) return;
      // A slug we already know is taken would just come back as a 422.
      if (slugIsTaken) return;
      // Two things can make a click wait, both via the same queue: a still-running
      // safety check, or — when the user is relying on the suggestion — a slug
      // that hasn't resolved yet. Queuing (instead of greying the button) lets the
      // submit fire the moment both settle, and guarantees we commit the resolved
      // suggestion rather than racing it to a backend random.
      const awaitingSuggestion =
        !data.custom_slug?.trim() && slugSuggestionStatus === "resolving";
      if (urlIsChecking || awaitingSuggestion) {
        pendingSubmitDataRef.current = data;
        setSubmitQueued(true);
        return;
      }
      await createLink(data);
    },
    [urlIsUnsafe, urlIsChecking, slugIsTaken, slugSuggestionStatus, createLink],
  );

  // Flush a queued submit once BOTH gates settle: the safety check finished
  // (safe/error — error fails open, matching the submit gate) and any suggestion
  // the submit depends on has landed. Drop it on an unsafe verdict or a
  // cleared/changed URL (safety back to idle).
  useEffect(() => {
    if (!submitQueued) {
      return;
    }
    if (safetyStatus === "unsafe" || safetyStatus === "idle") {
      pendingSubmitDataRef.current = null;
      setSubmitQueued(false);
      return;
    }
    const data = pendingSubmitDataRef.current;
    const awaitingSuggestion =
      !!data &&
      !data.custom_slug?.trim() &&
      slugSuggestionStatus === "resolving";
    if (
      (safetyStatus === "safe" || safetyStatus === "error") &&
      !awaitingSuggestion
    ) {
      pendingSubmitDataRef.current = null;
      setSubmitQueued(false);
      if (data) {
        void createLink(data);
      }
    }
  }, [safetyStatus, slugSuggestionStatus, submitQueued, createLink]);

  const inputRootSx = getInputRootSx(theme);
  const primary = theme.palette.primary.main;
  // Only real problems get a helper row — a taken slug or a malformed one. The
  // in-progress and all-clear states of the availability check live inside the
  // field (spinner / check icon) so the helper row never appears and disappears
  // under the input, which used to shift the whole form vertically.
  const slugHelperText =
    errors.custom_slug?.message ??
    (slugIsTaken ? slugAvailabilityLabels.taken : undefined);

  // Live preview of the resulting short URL. It turns the abstract "custom name"
  // field into something concrete — the beginner sees exactly what they're
  // building (host + final part) as they type, without ever meeting the word
  // "slug". Host is stripped of its protocol to read like the copied URL does.
  const previewPrefix = getShortUrlPrefixForSubdomain(
    subdomain?.status === "active" ? subdomain : null,
  ).replace(/^https?:\/\//, "");
  const typedFinal = slugValue?.trim() ?? "";
  // The preview must show only what submitting *now* would actually produce.
  // A server suggestion is NOT it: unless the user accepts it (which fills the
  // field, becoming `typedFinal`), an empty name submits as `undefined` and the
  // backend mints a random code. Showing the suggestion here promised a URL the
  // user wouldn't get. So an empty field previews a generic auto-code marker in
  // the quiet placeholder tone; only a real typed/accepted name reads in accent.
  const previewFinalIsPlaceholder = !typedFinal;
  const previewFinal = typedFinal || t("list.quickCreate.previewAutoName");
  const showPreview = Boolean(urlValue?.trim());

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
          <Box sx={formGridSx}>
            <Box>
              <FormLabel htmlFor="quick-create-url" sx={fieldLabelSx}>
                {t("list.quickCreate.urlLabel")}
              </FormLabel>
              <TextField
                id="quick-create-url"
                {...register("original_url")}
                placeholder={t("list.quickCreate.urlPlaceholder")}
                size="small"
                fullWidth
                error={!!errors.original_url || urlIsUnsafe}
                helperText={urlHelperText === " " ? undefined : urlHelperText}
                disabled={isPending}
                sx={inputRootSx}
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
                    sx: {
                      color: "text.secondary",
                      fontSize: "0.72rem",
                      lineHeight: 1.4,
                    },
                  },
                }}
              />
            </Box>

            <Box>
              <FormLabel htmlFor="quick-create-name" sx={fieldLabelSx}>
                {t("list.quickCreate.slugLabel")}
              </FormLabel>
              <TextField
                id="quick-create-name"
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
                      color: "text.secondary",
                      fontSize: "0.72rem",
                      lineHeight: 1.4,
                    },
                  },
                }}
              />
            </Box>

            <Box>
              <FormLabel
                aria-hidden
                sx={{
                  ...fieldLabelSx,
                  minHeight: "1.3em",
                  display: { xs: "none", md: "block" },
                }}
              >
                {" "}
              </FormLabel>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={
                  isPending || urlIsUnsafe || submitQueued || slugIsTaken
                }
                startIcon={
                  succeeded ? (
                    <CheckCircle2 {...ICON_SM} />
                  ) : isPending || submitQueued ? (
                    <CircularProgress size={16} color="inherit" />
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
          </Box>

          {/* Prévia ao vivo como bloco de resultado: superfície neutra suave +
              chip de ícone preenchido (ícone branco, como o ⚡ do cabeçalho) dão
              presença de "painel de resultado" sem tingir o fundo. A cor do
              estado (destaque vs. discreto) carrega a distinção
              comprometido/automático. */}
          {showPreview ? (
            <Box
              sx={{
                mt: { xs: 2, md: 2.5 },
                p: { xs: 1.5, sm: 1.75 },
                borderRadius: `${linksRadius.control}px`,
                border: `1px solid ${getLinkCardInnerBorderColor(theme)}`,
                backgroundColor: getLinksInsetBg(theme),
                display: "flex",
                alignItems: "flex-start",
                gap: 1.25,
              }}
            >
              <Box
                aria-hidden
                sx={{
                  width: 30,
                  height: 30,
                  mt: 0.125,
                  flexShrink: 0,
                  borderRadius: `${linksRadius.control}px`,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme.palette.common.white,
                  bgcolor: primary,
                }}
              >
                <Link2 size={15} strokeWidth={2} />
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    color: "text.secondary",
                    fontSize: "0.6875rem",
                    fontWeight: 500,
                    mb: 0.375,
                  }}
                >
                  {t("list.quickCreate.previewLabel")}
                </Typography>
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    fontFamily: "monospace",
                    fontSize: "0.8125rem",
                    lineHeight: 1.45,
                    wordBreak: "break-all",
                  }}
                >
                  <Box component="span" sx={{ color: "text.secondary" }}>
                    {previewPrefix}
                  </Box>
                  <Box
                    component="span"
                    sx={{
                      // Placeholder marker reads tentative (italic, quiet, not
                      // mono-bold) so it never looks like a committed slug; a
                      // real typed/accepted name reads solid in the accent tone.
                      fontStyle: previewFinalIsPlaceholder
                        ? "italic"
                        : "normal",
                      fontWeight: previewFinalIsPlaceholder ? 500 : 700,
                      color: previewFinalIsPlaceholder
                        ? "text.disabled"
                        : "primary.main",
                    }}
                  >
                    {previewFinal}
                  </Box>
                </Box>

                {/* While the name is empty, spell out that the shown ending is a
                    stand-in for a random code — not the suggestion, not final. */}
                {previewFinalIsPlaceholder ? (
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 0.625,
                      color: "text.secondary",
                      fontSize: "0.6875rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {t("list.quickCreate.previewAutoHint")}
                  </Typography>
                ) : null}
              </Box>
            </Box>
          ) : null}
        </Box>
      </Box>
    </EnhancedPaper>
  );
}

export default LinksQuickCreate;
