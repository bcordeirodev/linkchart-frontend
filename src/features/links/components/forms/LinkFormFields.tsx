"use client";
import {
  TextField,
  Switch,
  FormControlLabel,
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
import { UrlSafetyIndicator } from "./UrlSafetyIndicator";
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

  return (
    <Stack spacing={2}>
      <FormSection label={t("form.sections.basic")} isFirst>
        <Stack spacing={2}>
          <Box>
            <Controller
              name="original_url"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t("form.originalUrl")}
                  placeholder={t("form.originalUrlPlaceholder")}
                  error={!!errors.original_url}
                  helperText={
                    errors.original_url?.message || t("form.originalUrlHelper")
                  }
                />
              )}
            />
            <UrlSafetyIndicator status={safetyStatus} threats={threats} />
          </Box>

          <Box>
            <Controller
              name="custom_slug"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t("form.customSlug")}
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

          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t("form.title")}
                placeholder={t("form.titlePlaceholder")}
                error={!!errors.title}
                helperText={errors.title?.message ?? " "}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                rows={3}
                label={t("form.descriptionLabel")}
                placeholder={t("form.descriptionPlaceholder")}
                error={!!errors.description}
                helperText={errors.description?.message ?? " "}
              />
            )}
          />
        </Stack>
      </FormSection>

      <FormSection
        label={t("form.sections.advanced")}
        caption={t("form.sections.advancedCaption")}
        collapsible
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Controller
              name="click_limit"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="number"
                  label={t("form.clickLimit")}
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
          </Grid>

          <Grid item xs={12} md={6}>
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
                    label={t("form.startDate")}
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
          </Grid>

          <Grid item xs={12} md={6}>
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
                    label={t("form.expiresAt")}
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
            <Controller
              name="utm_source"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t("form.utmSourceLabel")}
                  placeholder={t("form.utmSourcePlaceholder")}
                  error={!!errors.utm_source}
                  helperText={
                    errors.utm_source?.message || t("form.utmSourceHelper")
                  }
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="utm_medium"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t("form.utmMediumLabel")}
                  placeholder={t("form.utmMediumPlaceholder")}
                  error={!!errors.utm_medium}
                  helperText={
                    errors.utm_medium?.message || t("form.utmMediumHelper")
                  }
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="utm_campaign"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t("form.utmCampaignLabel")}
                  placeholder={t("form.utmCampaignPlaceholder")}
                  error={!!errors.utm_campaign}
                  helperText={
                    errors.utm_campaign?.message || t("form.utmCampaignHelper")
                  }
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="utm_term"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t("form.utmTermLabel")}
                  placeholder={t("form.utmTermPlaceholder")}
                  error={!!errors.utm_term}
                  helperText={
                    errors.utm_term?.message || t("form.utmTermHelper")
                  }
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="utm_content"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t("form.utmContentLabel")}
                  placeholder={t("form.utmContentPlaceholder")}
                  error={!!errors.utm_content}
                  helperText={
                    errors.utm_content?.message || t("form.utmContentHelper")
                  }
                />
              )}
            />
          </Grid>
        </Grid>
      </FormSection>
    </Stack>
  );
}

export default LinkFormFields;
