"use client";
import { useEffect, useState, type ReactNode } from "react";
import {
  Button,
  TextField,
  Switch,
  FormControlLabel,
  FormLabel,
  Grid,
  Box,
  Stack,
  InputAdornment,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Controller, useWatch } from "react-hook-form";
import { DateTimePicker } from "@mui/x-date-pickers";

import useThemeMediaQuery from "@/shared/hooks/useThemeMediaQuery";
import { SubdomainSelect } from "@/features/subdomains/components/SubdomainSelect";
import { useSubdomains } from "@/features/subdomains/hooks/useSubdomains";
import { typographyScale } from "@/lib/theme";
import {
  getShortUrlPrefixForSubdomain,
  getShortUrlPrefixFromShortUrl,
} from "@/lib/utils/shortUrl";

import { useUrlSafetyCheck } from "../../hooks/useUrlSafetyCheck";

import type { UrlSafetyStatus } from "../../hooks/useUrlSafetyCheck";
import {
  buildSlugAvailabilityLabels,
  buildUrlSafetyLabels,
  getSlugAvailabilityHelperNode,
  getUrlSafetyHelperNode,
} from "./UrlSafetyIndicator";
import { useSlugAvailability } from "../../hooks/useSlugAvailability";
import { FormSection } from "./FormSection";
import { LinkPasswordField } from "./LinkPasswordField";
import { LinkTagPicker } from "./LinkTagPicker";
import { ManageTagsDialog } from "./ManageTagsDialog";

import type { LinkFormData } from "./LinkFormSchema";
import type { Control, FieldErrors } from "react-hook-form";

interface LinkFormFieldsProps {
  control: Control<LinkFormData>;
  errors: FieldErrors<LinkFormData>;
  isEdit?: boolean;
  /**
   * Slugified og:title suggestion to show as ghost text in the slug field.
   * Only rendered when the field is empty and no error is present.
   */
  slugSuggestion?: string | null;
  /**
   * When true, shows a subtle loading spinner in the URL field's end adornment
   * while metadata is being fetched in the background.
   */
  isLoadingMeta?: boolean;
  /** og:title ghost text / auto-fill source while the title field is empty. */
  titleSuggestion?: string | null;
  /** True while an available slug variant is being resolved. */
  isResolvingSlugSuggestion?: boolean;
  /**
   * Notifies the parent form whenever the Google Safe Browsing status of the
   * URL field changes. Parents must use this to disable submission while the
   * status is `"checking"` or `"unsafe"` (project rule: every URL goes
   * through Safe Browsing before a link is created or edited).
   */
  onSafetyStatusChange?: (status: UrlSafetyStatus) => void;
  /**
   * Create only: id of the subdomain selected for the link about to be
   * created (`null` = default domain). Drives both the `SubdomainSelect`
   * control and the slug field's prefix preview. Ignored in edit mode — the
   * domain is immutable once a link exists.
   */
  subdomainId?: number | null;
  /** Create only: called when the user changes the subdomain selection. */
  onSubdomainIdChange?: (id: number | null) => void;
  /**
   * Edit only: the link's own recorded `short_url`, used to display (as
   * read-only text) the domain it was created with. Ignored in create mode.
   */
  existingShortUrl?: string;
  /**
   * Edit only: whether the link is currently password-protected
   * (`has_password` from the API). Switches the password control to its
   * protected state (change/remove) and opens the advanced section by
   * default so the protection is visible on load. Ignored in create mode.
   */
  hasPassword?: boolean;
  /**
   * Edit only: the slug the link already has, as loaded (before any edits in
   * this session). Passed straight into `useSlugAvailability` so the live
   * availability check treats this value as available instead of flagging
   * the link's own slug as taken — the lookup it calls has no way to know
   * "this match IS the link being edited" on its own. Ignored in create mode
   * (there is no owned slug yet).
   */
  ownedSlug?: string | null;
}

/**
 * Renders the input fields for creating and editing a link. Field surface and
 * names match `LinkFormSchema`; only the visual grouping changes from the
 * previous "Configurações Avançadas / UTM" Collapse pattern to quiet section
 * headers via `FormSection`. `custom_slug` lives in the basic section because
 * it defines the final short URL.
 *
 * When `slugSuggestion` is provided and the `custom_slug` field is empty, the
 * suggestion is shown as ghost text (via `placeholder`). Pressing Tab while the
 * field is focused and empty accepts the suggestion into the field value.
 */
export function LinkFormFields({
  control,
  errors,
  isEdit = false,
  slugSuggestion,
  isLoadingMeta = false,
  titleSuggestion = null,
  isResolvingSlugSuggestion = false,
  onSafetyStatusChange,
  subdomainId = null,
  onSubdomainIdChange,
  existingShortUrl,
  hasPassword = false,
  ownedSlug = null,
}: LinkFormFieldsProps) {
  const { t } = useTranslation("links");
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("sm"));
  // Dialog de gestão de tags (renomear/recolorir/excluir) — aberto pelo
  // botão "Gerenciar" ao lado do label do campo Tags.
  const [manageTagsOpen, setManageTagsOpen] = useState(false);

  // Create: the prefix follows whichever subdomain is currently selected in
  // `SubdomainSelect`. Edit: the domain is immutable, so it's derived from
  // the link's own recorded `short_url` instead of any live selection.
  const { subdomains, isLoading: isLoadingSubdomains } = useSubdomains();
  const selectedSubdomain = !isEdit
    ? subdomains.find((item) => item.id === subdomainId) ?? null
    : null;
  const shortUrlPrefix = isEdit
    ? existingShortUrl
      ? getShortUrlPrefixFromShortUrl(existingShortUrl)
      : getShortUrlPrefixForSubdomain(null)
    : getShortUrlPrefixForSubdomain(selectedSubdomain);
  // Mirrors `SubdomainSelect`'s own hide condition so the external
  // `<FormLabel>` never renders above an empty control.
  const showSubdomainSelector =
    !isEdit &&
    process.env.NEXT_PUBLIC_SUBDOMAINS_ENABLED === "true" &&
    (isLoadingSubdomains || subdomains.length > 0);

  const urlValue = useWatch({ control, name: "original_url" });
  const slugValue = useWatch({ control, name: "custom_slug" });
  const { status: safetyStatus, threats } = useUrlSafetyCheck(urlValue ?? "");
  const slugAvailability = useSlugAvailability(
    slugValue?.trim() ?? "",
    "auth",
    ownedSlug,
  );
  const urlSafetyLabels = buildUrlSafetyLabels(t);
  const slugAvailabilityLabels = buildSlugAvailabilityLabels(t);

  useEffect(() => {
    onSafetyStatusChange?.(safetyStatus);
  }, [safetyStatus, onSafetyStatusChange]);

  const urlIsUnsafe = !errors.original_url && safetyStatus === "unsafe";

  const urlHelperContent: ReactNode = errors.original_url
    ? errors.original_url.message
    : safetyStatus !== "idle"
      ? getUrlSafetyHelperNode(safetyStatus, threats, urlSafetyLabels)
      : t("form.originalUrlHelper");

  return (
    <Stack
      spacing={2}
      sx={{
        "& .MuiFormHelperText-root:not(.Mui-error)": { color: "text.disabled" },
      }}
    >
      <FormSection label={t("form.sections.basic")} isFirst>
        <Stack spacing={2}>
          <Box>
            <FormLabel
              htmlFor="link-form-original-url"
              required
              error={!!errors.original_url || urlIsUnsafe}
              sx={{ display: "block", mb: 0.75 }}
            >
              {t("form.originalUrl")}
            </FormLabel>
            <Controller
              name="original_url"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="link-form-original-url"
                  fullWidth
                  placeholder={t("form.originalUrlPlaceholder")}
                  error={!!errors.original_url || urlIsUnsafe}
                  helperText={urlHelperContent}
                  FormHelperTextProps={
                    safetyStatus === "safe"
                      ? {
                          sx: {
                            color: "inherit",
                            lineHeight: 1.5,
                            mt: 0.75,
                          },
                        }
                      : undefined
                  }
                  InputProps={{
                    endAdornment: isLoadingMeta ? (
                      <InputAdornment position="end">
                        <CircularProgress
                          size={14}
                          thickness={5}
                          sx={{ color: "text.disabled" }}
                        />
                      </InputAdornment>
                    ) : undefined,
                  }}
                />
              )}
            />
          </Box>

          {showSubdomainSelector ? (
            <Box>
              <FormLabel
                htmlFor="link-form-subdomain"
                sx={{ display: "block", mb: 0.75 }}
              >
                {t("form.subdomainSelect.label")}
              </FormLabel>
              <SubdomainSelect
                id="link-form-subdomain"
                value={subdomainId}
                onChange={(id) => onSubdomainIdChange?.(id)}
              />
            </Box>
          ) : null}

          <Box>
            <FormLabel
              htmlFor="link-form-custom-slug"
              error={!!errors.custom_slug}
              sx={{ display: "block", mb: 0.75 }}
            >
              {t("form.customSlug")}
            </FormLabel>
            <Controller
              name="custom_slug"
              control={control}
              render={({ field }) => {
                // Show ghost text suggestion only when the field is empty and
                // a suggestion is available. Pressing Tab accepts it.
                const showSuggestion = !field.value?.trim() && !!slugSuggestion;

                return (
                  <TextField
                    {...field}
                    id="link-form-custom-slug"
                    fullWidth
                    placeholder={
                      showSuggestion
                        ? slugSuggestion!
                        : t("form.customSlugPlaceholder")
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Tab" && showSuggestion) {
                        field.onChange(slugSuggestion);
                        // Allow Tab to continue moving focus naturally
                      }
                    }}
                    error={!!errors.custom_slug}
                    helperText={
                      errors.custom_slug?.message ||
                      (slugValue?.trim() && slugAvailability !== "idle"
                        ? getSlugAvailabilityHelperNode(
                            slugAvailability,
                            slugAvailabilityLabels,
                          )
                        : showSuggestion
                          ? t("form.slugTabHint")
                          : isResolvingSlugSuggestion
                            ? t("form.slugSuggestionChecking")
                            : isMobile
                              ? `${shortUrlPrefix} · ${t("form.slugPrefixHint")}`
                              : t("form.customSlugHelper"))
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{
                              fontFamily: typographyScale.code.fontFamily,
                              color: "text.secondary",
                              pr: 0.5,
                              maxWidth: isMobile ? 140 : 280,
                              fontSize: isMobile ? "0.7rem" : undefined,
                            }}
                          >
                            {shortUrlPrefix}
                          </Typography>
                        </InputAdornment>
                      ),
                      endAdornment:
                        isResolvingSlugSuggestion && !showSuggestion ? (
                          <InputAdornment position="end">
                            <CircularProgress
                              size={14}
                              thickness={5}
                              sx={{ color: "text.disabled" }}
                            />
                          </InputAdornment>
                        ) : undefined,
                    }}
                    sx={{
                      "& .MuiInputBase-input": {
                        fontFamily: typographyScale.code.fontFamily,
                      },
                    }}
                  />
                );
              }}
            />
          </Box>

          <Box>
            <FormLabel
              htmlFor="link-form-title"
              error={!!errors.title}
              sx={{ display: "block", mb: 0.75 }}
            >
              {t("form.title")}
            </FormLabel>
            <Controller
              name="title"
              control={control}
              render={({ field }) => {
                const showTitleSuggestion =
                  !field.value?.trim() && !!titleSuggestion;

                return (
                  <TextField
                    {...field}
                    id="link-form-title"
                    fullWidth
                    placeholder={
                      showTitleSuggestion
                        ? titleSuggestion!
                        : t("form.titlePlaceholder")
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Tab" && showTitleSuggestion) {
                        field.onChange(titleSuggestion);
                      }
                    }}
                    error={!!errors.title}
                    helperText={
                      errors.title?.message ||
                      (showTitleSuggestion ? t("form.titleTabHint") : " ")
                    }
                  />
                );
              }}
            />
          </Box>

          <Box>
            <FormLabel
              htmlFor="link-form-description"
              error={!!errors.description}
              sx={{ display: "block", mb: 0.75 }}
            >
              {t("form.descriptionLabel")}
            </FormLabel>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="link-form-description"
                  fullWidth
                  multiline
                  rows={3}
                  placeholder={t("form.descriptionPlaceholder")}
                  error={!!errors.description}
                  helperText={errors.description?.message ?? " "}
                />
              )}
            />
          </Box>

          <Box>
            {/* Label + "Gerenciar": o dialog é a única porta para renomear,
                recolorir ou excluir tags (a criação é inline no picker). */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 0.75,
              }}
            >
              <FormLabel htmlFor="link-form-tags" error={!!errors.tag_ids}>
                {t("form.tags.label")}
              </FormLabel>
              <Button
                size="small"
                onClick={() => setManageTagsOpen(true)}
                sx={{
                  minWidth: 0,
                  py: 0,
                  px: 0.5,
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  textTransform: "none",
                  color: "text.secondary",
                  "&:hover": { color: "primary.main", background: "none" },
                }}
              >
                {t("form.tags.manage.open")}
              </Button>
            </Box>
            <LinkTagPicker control={control} />
            <ManageTagsDialog
              open={manageTagsOpen}
              onClose={() => setManageTagsOpen(false)}
            />
          </Box>
        </Stack>
      </FormSection>

      <FormSection
        label={t("form.sections.advanced")}
        caption={t("form.sections.advancedCaption")}
        collapsible
        // Um link protegido não pode esconder a própria proteção: a seção já
        // abre aberta para o estado "protegido" (trocar/remover) ficar visível.
        defaultOpen={isEdit && hasPassword}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box>
              <FormLabel
                htmlFor="link-form-click-limit"
                error={!!errors.click_limit}
                sx={{ display: "block", mb: 0.75 }}
              >
                {t("form.clickLimit")}
              </FormLabel>
              <Controller
                name="click_limit"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <TextField
                    {...field}
                    id="link-form-click-limit"
                    fullWidth
                    type="number"
                    placeholder={t("form.clickLimitPlaceholder")}
                    value={value || ""}
                    onChange={(e) =>
                      onChange(e.target.value ? Number(e.target.value) : null)
                    }
                    error={!!errors.click_limit}
                    helperText={
                      errors.click_limit?.message || t("form.clickLimitHelper")
                    }
                    InputProps={{
                      inputProps: { min: 1, max: 1000000 },
                    }}
                  />
                )}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
              <FormLabel
                htmlFor="link-form-starts-in"
                error={!!errors.starts_in}
                sx={{ display: "block", mb: 0.75 }}
              >
                {t("form.startDate")}
              </FormLabel>
              <Controller
                name="starts_in"
                control={control}
                render={({ field: { value, ...field } }) => (
                  <DateTimePicker
                    {...field}
                    value={value ?? null}
                    slotProps={{
                      textField: {
                        id: "link-form-starts-in",
                        fullWidth: true,
                        error: !!errors.starts_in,
                        helperText:
                          errors.starts_in?.message ||
                          t("form.startDateHelper"),
                      },
                    }}
                  />
                )}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
              <FormLabel
                htmlFor="link-form-expires-at"
                error={!!errors.expires_at}
                sx={{ display: "block", mb: 0.75 }}
              >
                {t("form.expiresAt")}
              </FormLabel>
              <Controller
                name="expires_at"
                control={control}
                render={({ field: { value, ...field } }) => (
                  <DateTimePicker
                    {...field}
                    value={value}
                    slotProps={{
                      textField: {
                        id: "link-form-expires-at",
                        fullWidth: true,
                        error: !!errors.expires_at,
                        helperText:
                          errors.expires_at?.message ||
                          t("form.expiresAtHelper"),
                      },
                    }}
                  />
                )}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <LinkPasswordField
              control={control}
              errors={errors}
              isEdit={isEdit}
              hasPassword={hasPassword}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="is_active"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={t("form.activeLabel")}
                />
              )}
            />
          </Grid>
        </Grid>
      </FormSection>

      <FormSection
        label={t("form.sections.utm")}
        caption={t("form.sections.utmCaption")}
        collapsible
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box>
              <FormLabel
                htmlFor="link-form-utm-source"
                error={!!errors.utm_source}
                sx={{ display: "block", mb: 0.75 }}
              >
                {t("form.utmSourceLabel")}
              </FormLabel>
              <Controller
                name="utm_source"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="link-form-utm-source"
                    fullWidth
                    placeholder={t("form.utmSourcePlaceholder")}
                    error={!!errors.utm_source}
                    helperText={
                      errors.utm_source?.message || t("form.utmSourceHelper")
                    }
                  />
                )}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
              <FormLabel
                htmlFor="link-form-utm-medium"
                error={!!errors.utm_medium}
                sx={{ display: "block", mb: 0.75 }}
              >
                {t("form.utmMediumLabel")}
              </FormLabel>
              <Controller
                name="utm_medium"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="link-form-utm-medium"
                    fullWidth
                    placeholder={t("form.utmMediumPlaceholder")}
                    error={!!errors.utm_medium}
                    helperText={
                      errors.utm_medium?.message || t("form.utmMediumHelper")
                    }
                  />
                )}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
              <FormLabel
                htmlFor="link-form-utm-campaign"
                error={!!errors.utm_campaign}
                sx={{ display: "block", mb: 0.75 }}
              >
                {t("form.utmCampaignLabel")}
              </FormLabel>
              <Controller
                name="utm_campaign"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="link-form-utm-campaign"
                    fullWidth
                    placeholder={t("form.utmCampaignPlaceholder")}
                    error={!!errors.utm_campaign}
                    helperText={
                      errors.utm_campaign?.message ||
                      t("form.utmCampaignHelper")
                    }
                  />
                )}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
              <FormLabel
                htmlFor="link-form-utm-term"
                error={!!errors.utm_term}
                sx={{ display: "block", mb: 0.75 }}
              >
                {t("form.utmTermLabel")}
              </FormLabel>
              <Controller
                name="utm_term"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="link-form-utm-term"
                    fullWidth
                    placeholder={t("form.utmTermPlaceholder")}
                    error={!!errors.utm_term}
                    helperText={
                      errors.utm_term?.message || t("form.utmTermHelper")
                    }
                  />
                )}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box>
              <FormLabel
                htmlFor="link-form-utm-content"
                error={!!errors.utm_content}
                sx={{ display: "block", mb: 0.75 }}
              >
                {t("form.utmContentLabel")}
              </FormLabel>
              <Controller
                name="utm_content"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="link-form-utm-content"
                    fullWidth
                    placeholder={t("form.utmContentPlaceholder")}
                    error={!!errors.utm_content}
                    helperText={
                      errors.utm_content?.message || t("form.utmContentHelper")
                    }
                  />
                )}
              />
            </Box>
          </Grid>
        </Grid>
      </FormSection>
    </Stack>
  );
}

export default LinkFormFields;
