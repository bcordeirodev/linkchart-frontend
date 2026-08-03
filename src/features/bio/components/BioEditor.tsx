"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { useSubdomains } from "@/features/subdomains/hooks/useSubdomains";
import { useMessage } from "@/lib/providers/MessageProvider";
import useThemeMediaQuery from "@/shared/hooks/useThemeMediaQuery";
import { SectionLabel } from "@/shared/ui/base";
import { AppIcon } from "@/shared/ui/icons";

import { useBioPage, useUpsertBioPage } from "../hooks/useBioPage";
import { getBioCardSx } from "../utils/cardSurface";
import { applyBioFieldErrors } from "../utils/applyBioFieldErrors";
import {
  bioPageFormSchema,
  defaultBioPageFormValues,
} from "../utils/bioPageFormSchema";
import { resolvePublicPageUrl } from "../utils/publicBioUrl";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";

import { BioAvatarField } from "./BioAvatarField";
import { BioCreateIntro } from "./BioCreateIntro";
import { BioItemsSection } from "./BioItemsSection";
import {
  BioIdentityFields,
  BioPublishingFields,
  BioThemePicker,
} from "./BioPageFormFields";
import { BioPreviewPhone } from "./BioPreviewPhone";
import { BioPublicUrlBar } from "./BioPublicUrlBar";
import { BioSubdomainGate } from "./BioSubdomainGate";

import type { BioPage } from "../types";
import type { BioPageFormData } from "../utils/bioPageFormSchema";

/** How long the submit button keeps showing its "Saved" microstate after a successful save, in ms. */
const SAVED_STATE_DURATION_MS = 2500;

/** Maps a persisted `BioPage` to the form's editable shape. Excludes `handle` — see `BioPageFormData`. */
function mapPageToFormValues(page: BioPage): BioPageFormData {
  return {
    title: page.title,
    bio: page.bio ?? "",
    theme: page.theme,
    isActive: page.isActive,
    subdomainId: page.subdomainId,
  };
}

/**
 * Top-level bio page editor: owns the shared `react-hook-form` instance (so
 * `BioPreviewPhone` can watch it live), the create/edit mode switch, and the
 * two-column responsive layout (form left, live preview right on desktop;
 * stacked with a collapsible preview on phones).
 *
 * Subdomain-first gate: a user in `"create"` mode with zero active
 * subdomains never sees this layout at all — `BioSubdomainGate` replaces it
 * entirely (see the early return below), since the backend now refuses to
 * create a page without one. A legacy page saved before this change (an
 * existing page with `subdomainId: null`) still reaches the normal form,
 * with a banner asking for an address and the save blocked by
 * `bioPageFormSchema`'s now-required `subdomainId` rule until one is picked.
 */
export function BioEditor() {
  const { t } = useTranslation("bio");
  const theme = useTheme();
  const { showMessage } = useMessage();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("md"));

  const { page, isLoading } = useBioPage();
  const upsertPage = useUpsertBioPage();
  const mode: "create" | "edit" = page ? "edit" : "create";
  const isLegacyWithoutSubdomain =
    mode === "edit" && !!page && page.subdomainId === null;

  // Only consulted to decide the create-mode gate below — `BioAddressSelect`
  // (inside `BioPageFormFields`) reads the same list independently for the
  // actual picker; react-query dedups both calls against one cache entry.
  const { subdomains, isLoading: isSubdomainsLoading } = useSubdomains();
  const isGated =
    mode === "create" && !isSubdomainsLoading && subdomains.length === 0;

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BioPageFormData>({
    resolver: zodResolver(
      bioPageFormSchema(
        t as (key: string, options?: Record<string, unknown>) => string,
      ),
    ),
    defaultValues: defaultBioPageFormValues,
    mode: "onChange",
  });

  // Hydrate the form once the page loads — mirrors `EditLinkForm`'s
  // load-then-reset pattern. The ref guard keeps a background refetch (e.g.
  // after a save) from clobbering in-progress edits.
  const hydratedRef = useRef(false);
  useEffect(() => {
    if (page && !hydratedRef.current) {
      hydratedRef.current = true;
      reset(mapPageToFormValues(page));
    }
  }, [page, reset]);

  // Watched live so `BioPreviewPhone` re-renders on every keystroke — all
  // called unconditionally, before any early return, per Rules of Hooks.
  // `subdomainId` is watched so the preview's address line follows the
  // "Endereço da página" select in real time, before saving.
  const titleValue = useWatch({ control, name: "title" });
  const bioValue = useWatch({ control, name: "bio" });
  const themeValue = useWatch({ control, name: "theme" });
  const subdomainIdValue = useWatch({ control, name: "subdomainId" });

  const [previewOpen, setPreviewOpen] = useState(false);

  // Drives the submit button's transient "Saved" microstate — a lasting (if
  // brief) confirmation next to the action itself, on top of the one-shot
  // toast, since a toast can go unnoticed or get dismissed before it's read.
  const [justSaved, setJustSaved] = useState(false);
  const savedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current);
    };
  }, []);

  const onSubmit = handleSubmit(async (values) => {
    try {
      // No `handle` key: never sent from this form (subdomain-first — the
      // backend derives it from the subdomain label on create and leaves it
      // untouched on update). See `BioPageUpsertInput.handle`.
      await upsertPage.mutateAsync({
        title: values.title,
        bio: values.bio,
        theme: values.theme,
        isActive: mode === "edit" ? values.isActive : undefined,
        subdomainId: values.subdomainId,
      });
      showMessage({
        message: t(mode === "create" ? "form.createdToast" : "form.savedToast"),
        variant: "success",
      });
      if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current);
      setJustSaved(true);
      savedTimeoutRef.current = setTimeout(
        () => setJustSaved(false),
        SAVED_STATE_DURATION_MS,
      );
    } catch (err) {
      applyBioFieldErrors<BioPageFormData>(err, setError);
    }
  });

  if (isLoading || (mode === "create" && isSubdomainsLoading)) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={220} />
        <Skeleton variant="rounded" height={160} />
      </Stack>
    );
  }

  if (isGated) {
    return (
      <Box className="reveal reveal-2">
        <BioSubdomainGate />
      </Box>
    );
  }

  const isSaving = isSubmitting || upsertPage.isPending;

  // Address shown in the preview: the live form selection wins; a bound page
  // falls back to its saved absolute URL. Legacy pages with no address show
  // nothing — the product has no "@handle" to fall back to.
  const selectedSubdomain = subdomains.find((s) => s.id === subdomainIdValue);
  const previewAddress = selectedSubdomain
    ? selectedSubdomain.fullUrl.replace(/^https?:\/\//, "")
    : page?.url?.startsWith("http")
      ? page.url.replace(/^https?:\/\//, "")
      : "";

  const previewNode = (
    <Stack spacing={1} alignItems="center">
      <Stack direction="row" spacing={0.75} alignItems="center">
        <Box
          sx={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            bgcolor: "success.main",
          }}
        />
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: 600, letterSpacing: 0.2 }}
        >
          {t("preview.liveBadge")}
        </Typography>
      </Stack>
      <BioPreviewPhone
        address={previewAddress}
        title={titleValue || ""}
        bio={bioValue || ""}
        theme={themeValue || "dark"}
        items={page?.items ?? []}
        avatarUrl={page?.avatarThumbUrl ?? page?.avatarUrl}
      />
    </Stack>
  );

  /**
   * One field-group section of the editor: a `/ LABEL` {@link SectionLabel}
   * (`headingLevel={2}` — replaces the old ad hoc `subtitle2` heading and
   * keeps the section in the screen-reader heading list), a one-line hint
   * below it, then a translucent hairline card ({@link getBioCardSx}) holding
   * the section's fields. Groups what the person is deciding (identity,
   * address & publishing, appearance) instead of one flat field column.
   */
  const section = (
    heading: string,
    hint: string,
    children: React.ReactNode,
  ) => (
    <Stack spacing={1.25}>
      <SectionLabel headingLevel={2}>{heading}</SectionLabel>
      <Typography variant="body2" color="text.secondary">
        {hint}
      </Typography>
      <EnhancedPaper
        variant="outlined"
        animated={false}
        sx={{ ...getBioCardSx(theme), mb: 0 }}
      >
        <Stack spacing={2} sx={{ p: { xs: 2, sm: 2.5 } }}>
          {children}
        </Stack>
      </EnhancedPaper>
    </Stack>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 3, md: 4 },
        alignItems: "flex-start",
      }}
    >
      <Stack
        spacing={{ xs: 3, sm: 3.5 }}
        sx={{ flex: 1, minWidth: 0, width: "100%" }}
      >
        <Stack spacing={2} className="reveal reveal-2">
          {mode === "create" ? <BioCreateIntro /> : null}

          {isLegacyWithoutSubdomain ? (
            <Alert severity="info">{t("legacyBanner")}</Alert>
          ) : null}

          {isMobile ? (
            <Button
              variant="text"
              size="small"
              startIcon={
                <AppIcon
                  intent={previewOpen ? "collapse" : "expand"}
                  size={16}
                />
              }
              onClick={() => setPreviewOpen((v) => !v)}
              sx={{ alignSelf: "flex-start" }}
            >
              {t(previewOpen ? "preview.hideAction" : "preview.showAction")}
            </Button>
          ) : null}
          {isMobile && previewOpen ? (
            <Box sx={{ maxWidth: 300, mx: "auto", width: "100%" }}>
              {previewNode}
            </Box>
          ) : null}
        </Stack>

        <form onSubmit={onSubmit} noValidate className="reveal reveal-3">
          <Stack spacing={{ xs: 2.5, sm: 3 }}>
            {section(
              t("sections.identity"),
              t("sections.identityHint"),
              <>
                {mode === "edit" && page ? (
                  <BioAvatarField page={page} />
                ) : null}
                <BioIdentityFields control={control} errors={errors} />
              </>,
            )}

            {section(
              t("sections.publishing"),
              t("sections.publishingHint"),
              <>
                <BioPublishingFields
                  control={control}
                  errors={errors}
                  mode={mode}
                />
                {/* Só para página com endereço vinculado: o fallback técnico
                    /@handle não é uma URL que o produto apresenta. Sem card
                    próprio — já vive dentro do card desta seção (evita card
                    dentro de card). */}
                {mode === "edit" && page && page.subdomainId !== null ? (
                  <BioPublicUrlBar url={resolvePublicPageUrl(page.url)} />
                ) : null}
              </>,
            )}

            {section(
              t("sections.appearance"),
              t("sections.appearanceHint"),
              <BioThemePicker control={control} />,
            )}

            <Box>
              <Button
                type="submit"
                variant="contained"
                disabled={isSaving}
                startIcon={
                  isSaving ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : justSaved ? (
                    <AppIcon intent="success" size={16} />
                  ) : undefined
                }
                sx={{ minHeight: 44, minWidth: 176 }}
              >
                {isSaving
                  ? t("form.saveSubmitSaving")
                  : justSaved
                    ? t("form.saveSubmitSaved")
                    : t(
                        mode === "create"
                          ? "form.createSubmit"
                          : "form.saveSubmit",
                      )}
              </Button>
            </Box>
          </Stack>
        </form>

        {/* Sem card próprio nesta camada — `BioItemsSection` já é a lista de
            cards (uma por link) com o próprio `SectionLabel`; um invólucro
            aqui seria card dentro de card. */}
        {mode === "edit" && page ? (
          <Box className="reveal reveal-4">
            <BioItemsSection page={page} />
          </Box>
        ) : null}
      </Stack>

      {!isMobile ? (
        <Box
          className="reveal reveal-2"
          sx={{
            width: 320,
            flexShrink: 0,
            position: "sticky",
            top: 24,
          }}
        >
          {previewNode}
        </Box>
      ) : null}
    </Box>
  );
}

export default BioEditor;
