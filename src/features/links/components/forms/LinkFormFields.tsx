"use client";
import type { ReactNode } from "react";
import {
  TextField,
  Switch,
  FormControlLabel,
  FormLabel,
  Grid,
  Box,
  Stack,
  InputAdornment,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Controller, useWatch } from "react-hook-form";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import "dayjs/locale/en-gb";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import useThemeMediaQuery from "@/shared/hooks/useThemeMediaQuery";
import { getShortUrlPrefix } from "@/lib/utils/shortUrl";

import { useUrlSafetyCheck } from "../../hooks/useUrlSafetyCheck";
import { getUrlSafetyHelperNode } from "./UrlSafetyIndicator";
import { FormSection } from "./FormSection";

import type { LinkFormData } from "./LinkFormSchema";
import type { Control, FieldErrors } from "react-hook-form";

interface LinkFormFieldsProps {
  control: Control<LinkFormData>;
  errors: FieldErrors<LinkFormData>;
  isEdit?: boolean;
}

/**
 * Renders the input fields for creating and editing a link. Field surface and
 * names match `LinkFormSchema`; only the visual grouping changes from the
 * previous "Configurações Avançadas / UTM" Collapse pattern to quiet section
 * headers via `FormSection`. `custom_slug` lives in the basic section because
 * it defines the final short URL.
 */
export function LinkFormFields({
  control,
  errors,
  isEdit: _isEdit = false,
}: LinkFormFieldsProps) {
  const { t } = useTranslation("links");
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("sm"));
  const shortUrlPrefix = getShortUrlPrefix();

  const urlValue = useWatch({ control, name: "original_url" });
  const { status: safetyStatus, threats } = useUrlSafetyCheck(urlValue ?? "");

  const urlIsUnsafe = !errors.original_url && safetyStatus === "unsafe";
  const urlIsSafe = !errors.original_url && safetyStatus === "safe";

  const urlHelperContent: ReactNode = errors.original_url
    ? errors.original_url.message
    : safetyStatus !== "idle"
      ? getUrlSafetyHelperNode(safetyStatus, threats, t)
      : t("form.originalUrlHelper");

  // Only 'safe' needs an explicit color override; 'unsafe' is handled by
  // error={true} adding .Mui-error, and 'checking'/'error' fall through to the
  // global text.disabled selector on the Stack.
  const urlHelperSx = urlIsSafe ? { color: "success.main" } : undefined;

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
                  fullWidth
                  placeholder={t("form.originalUrlPlaceholder")}
                  error={!!errors.original_url || urlIsUnsafe}
                  helperText={urlHelperContent}
                  FormHelperTextProps={
                    urlHelperSx ? { sx: urlHelperSx } : undefined
                  }
                />
              )}
            />
          </Box>

          <Box>
            <FormLabel
              error={!!errors.custom_slug}
              sx={{ display: "block", mb: 0.75 }}
            >
              {t("form.customSlug")}
            </FormLabel>
            <Controller
              name="custom_slug"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder={t("form.customSlugPlaceholder")}
                  error={!!errors.custom_slug}
                  helperText={
                    errors.custom_slug?.message ||
                    (isMobile
                      ? `${shortUrlPrefix} · ${t("form.slugPrefixHint")}`
                      : t("form.customSlugHelper"))
                  }
                  InputProps={
                    isMobile
                      ? undefined
                      : {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Typography
                                variant="body2"
                                sx={{
                                  fontFamily: "monospace",
                                  color: "text.secondary",
                                  pr: 0.5,
                                }}
                              >
                                {shortUrlPrefix}
                              </Typography>
                            </InputAdornment>
                          ),
                        }
                  }
                  sx={{
                    "& .MuiInputBase-input": { fontFamily: "monospace" },
                  }}
                />
              )}
            />
          </Box>

          <Box>
            <FormLabel
              error={!!errors.title}
              sx={{ display: "block", mb: 0.75 }}
            >
              {t("form.title")}
            </FormLabel>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder={t("form.titlePlaceholder")}
                  error={!!errors.title}
                  helperText={errors.title?.message ?? " "}
                />
              )}
            />
          </Box>

          <Box>
            <FormLabel
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
        </Stack>
      </FormSection>

      <FormSection
        label={t("form.sections.advanced")}
        caption={t("form.sections.advancedCaption")}
        collapsible
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box>
              <FormLabel
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
                error={!!errors.starts_in}
                sx={{ display: "block", mb: 0.75 }}
              >
                {t("form.startDate")}
              </FormLabel>
              <Controller
                name="starts_in"
                control={control}
                render={({ field: { value, ...field } }) => (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="en-gb"
                  >
                    <DateTimePicker
                      {...field}
                      value={value ?? null}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.starts_in,
                          helperText:
                            errors.starts_in?.message ||
                            t("form.startDateHelper"),
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
              <FormLabel
                error={!!errors.expires_at}
                sx={{ display: "block", mb: 0.75 }}
              >
                {t("form.expiresAt")}
              </FormLabel>
              <Controller
                name="expires_at"
                control={control}
                render={({ field: { value, ...field } }) => (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="en-gb"
                  >
                    <DateTimePicker
                      {...field}
                      value={value}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.expires_at,
                          helperText:
                            errors.expires_at?.message ||
                            t("form.expiresAtHelper"),
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Box>
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
