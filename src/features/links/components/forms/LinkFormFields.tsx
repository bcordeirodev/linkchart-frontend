"use client";
import {
  TextField,
  Switch,
  FormControlLabel,
  Collapse,
  Grid,
  Typography,
  Box,
  Chip,
  Stack,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Info } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useWatch } from "react-hook-form";

import { AppIcon } from "@/shared/ui/icons";
import { useUrlSafetyCheck } from "../../hooks/useUrlSafetyCheck";
import { UrlSafetyIndicator } from "./UrlSafetyIndicator";

import type { LinkFormData } from "./LinkFormSchema";
import type { Control, FieldErrors } from "react-hook-form";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import "dayjs/locale/en-gb";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface LinkFormFieldsProps {
  control: Control<LinkFormData>;
  errors: FieldErrors<LinkFormData>;
  isEdit?: boolean;
}

export function LinkFormFields({
  control,
  errors,
  isEdit: _isEdit = false,
}: LinkFormFieldsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showUTM, setShowUTM] = useState(false);
  const { t } = useTranslation("links");

  const urlValue = useWatch({ control, name: "original_url" });
  const { status: safetyStatus, threats } = useUrlSafetyCheck(urlValue ?? "");

  return (
    <Stack spacing={2.5}>
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
            helperText={errors.title?.message || t("form.titleHelper")}
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
            helperText={
              errors.description?.message || t("form.descriptionHelper")
            }
          />
        )}
      />

      <Box sx={{ mt: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.5,
          }}
        >
          <Typography variant="subtitle1">
            {t("form.advancedSettings")}
          </Typography>
          <Chip
            label={showAdvanced ? "Ocultar" : "Mostrar"}
            onClick={() => setShowAdvanced(!showAdvanced)}
            color={showAdvanced ? "primary" : "default"}
            variant={showAdvanced ? "filled" : "outlined"}
            size="small"
            icon={
              <AppIcon
                intent={showAdvanced ? "collapse" : "expand"}
                size={16}
              />
            }
          />
        </Box>

        <Collapse in={showAdvanced}>
          <Box
            sx={{
              p: 2.5,
              backgroundColor: "action.hover",
              borderRadius: 1.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                p: 2,
                mb: 2.5,
                backgroundColor: (theme) =>
                  alpha(theme.palette.info.main, 0.08),
                border: "1px solid",
                borderColor: (theme) => alpha(theme.palette.info.main, 0.2),
                borderRadius: 1.5,
              }}
            >
              <Box sx={{ color: "info.main", mt: 0.15, flexShrink: 0 }}>
                <Info size={16} />
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Use estas opções para ter mais controle sobre o comportamento
                  do seu link. Não é obrigatório preencher nenhum campo aqui —
                  são recursos extras para quem precisa.
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  component="ul"
                  sx={{ m: 0, pl: 2, lineHeight: 1.8 }}
                >
                  <li>
                    <strong>Slug personalizado</strong>: define o final da URL
                    curta (ex: <em>seudominio.com/r/meu-link</em>)
                  </li>
                  <li>
                    <strong>Limite de cliques</strong>: desativa o link
                    automaticamente quando atingir esse número de acessos
                  </li>
                  <li>
                    <strong>Data de início / expiração</strong>: programa quando
                    o link começa e quando para de funcionar
                  </li>
                </Typography>
              </Box>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
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
                        t("form.customSlugHelper")
                      }
                    />
                  )}
                />
              </Grid>

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
                      placeholder="1000"
                      value={value || ""}
                      onChange={(e) =>
                        onChange(e.target.value ? Number(e.target.value) : null)
                      }
                      error={!!errors.click_limit}
                      helperText={
                        errors.click_limit?.message ||
                        t("form.clickLimitHelper")
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
                            sx: {
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 1.5,
                              },
                            },
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
                            sx: {
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 1.5,
                              },
                            },
                          },
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
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
          </Box>
        </Collapse>
      </Box>

      <Box sx={{ mt: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.5,
          }}
        >
          <Typography variant="subtitle1">{t("form.utmTitle")}</Typography>
          <Chip
            label={showUTM ? "Ocultar" : "Mostrar"}
            onClick={() => setShowUTM(!showUTM)}
            color={showUTM ? "secondary" : "default"}
            variant={showUTM ? "filled" : "outlined"}
            size="small"
            icon={
              <AppIcon intent={showUTM ? "collapse" : "expand"} size={16} />
            }
          />
        </Box>

        <Collapse in={showUTM}>
          <Box
            sx={{
              p: 2.5,
              backgroundColor: "action.hover",
              borderRadius: 1.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                p: 2,
                mb: 2.5,
                backgroundColor: (theme) =>
                  alpha(theme.palette.secondary.main, 0.06),
                border: "1px solid",
                borderColor: (theme) =>
                  alpha(theme.palette.secondary.main, 0.2),
                borderRadius: 1.5,
              }}
            >
              <Box sx={{ color: "secondary.main", mt: 0.15, flexShrink: 0 }}>
                <Info size={16} />
              </Box>
              <Box>
                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                  O que são parâmetros UTM?
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  São marcações adicionadas ao link que permitem saber
                  exatamente de onde vieram seus visitantes. Por exemplo: se
                  você divulgar o mesmo link no Instagram e em um e-mail, os
                  UTMs deixam o relatório mostrar quantos cliques vieram de cada
                  canal.
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  component="ul"
                  sx={{ m: 0, pl: 2, lineHeight: 1.8 }}
                >
                  <li>
                    <strong>Source</strong>: de onde veio o visitante (ex:{" "}
                    <em>instagram</em>, <em>google</em>, <em>newsletter</em>)
                  </li>
                  <li>
                    <strong>Medium</strong>: o tipo de canal (ex: <em>post</em>,{" "}
                    <em>anuncio</em>, <em>email</em>)
                  </li>
                  <li>
                    <strong>Campaign</strong>: nome da campanha ou ação que
                    gerou o link (ex: <em>lancamento-produto</em>)
                  </li>
                  <li>
                    <strong>Term / Content</strong>: detalhes extras para
                    campanhas pagas ou testes A/B
                  </li>
                </Typography>
              </Box>
            </Box>
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
                        errors.utm_campaign?.message ||
                        t("form.utmCampaignHelper")
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
                        errors.utm_content?.message ||
                        t("form.utmContentHelper")
                      }
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </Box>
    </Stack>
  );
}

export default LinkFormFields;
