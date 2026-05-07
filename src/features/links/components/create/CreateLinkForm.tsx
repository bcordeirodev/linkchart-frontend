"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Typography,
  Button,
  CircularProgress,
  Stack,
  Alert,
  Box,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@/shared/hooks";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

import { AppIcon } from "@/shared/ui/icons";
import { useAppDispatch } from "@/lib/store/hooks";
import { showErrorMessage } from "@/lib/store/messageSlice";
import { ApiError } from "@/lib/api/client";
import { linkService } from "@/services";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import { ResponsiveContainer } from "@/shared/ui/base/ResponsiveContainer";

import { LinkFormFields } from "../../components/forms/LinkFormFields";
import {
  createLinkFormSchema,
  defaultLinkFormValues,
} from "../../components/forms/LinkFormSchema";

import type { LinkFormData } from "../../components/forms/LinkFormSchema";
import type { CreateLinkFormProps } from "../../types/forms";

/**
 * Formulário de criação de links com React Hook Form + Zod
 * Validação robusta e interface simplificada
 */
export function CreateLinkForm({
  onSuccess,
  showBackButton = false,
}: CreateLinkFormProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation("links");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    setError,
  } = useForm<LinkFormData>({
    resolver: zodResolver(
      createLinkFormSchema(
        t as (key: string, options?: Record<string, unknown>) => string,
      ),
    ),
    defaultValues: defaultLinkFormValues,
    mode: "onChange",
  });

  const convertDateForSubmit = (
    dateValue: Dayjs | null | undefined,
  ): string | undefined => {
    if (!dateValue) {
      return undefined;
    }

    try {
      if (dayjs.isDayjs(dateValue)) {
        return dateValue.toISOString();
      }

      // Fallback para string ISO se por algum motivo não for DayJS
      if (typeof dateValue === "string") {
        return dateValue;
      }
    } catch (_error) {
      return undefined;
    }
  };

  const onSubmit = async (data: LinkFormData) => {
    try {
      setLoading(true);
      setApiError(null);

      const payload = {
        ...data,
        expires_at: convertDateForSubmit(data.expires_at),
        starts_in: convertDateForSubmit(data.starts_in),

        // Remover campos UTM vazios
        utm_source: data.utm_source || undefined,
        utm_medium: data.utm_medium || undefined,
        utm_campaign: data.utm_campaign || undefined,
        utm_term: data.utm_term || undefined,
        utm_content: data.utm_content || undefined,
      };

      const response = await linkService.save(payload);

      // O linkService retorna LinkResponse diretamente
      setSuccess(true);

      onSuccess?.(response);

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate("/links");
      }, 2000);
    } catch (error: unknown) {
      if (error instanceof ApiError && error.details?.errors) {
        const backendErrors = error.details.errors as Record<string, string[]>;
        Object.keys(backendErrors).forEach((field) => {
          setError(field as keyof LinkFormData, {
            message: backendErrors[field][0],
          });
        });
      } else {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Erro inesperado ao criar link";
        setApiError(errorMessage);
        dispatch(showErrorMessage(errorMessage));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    reset(defaultLinkFormValues);
    setApiError(null);
  };

  const handleCancel = () => {
    if (showBackButton) {
      navigate(-1);
    } else {
      navigate("/links");
    }
  };

  if (success) {
    return (
      <EnhancedPaper
        variant="glass"
        animated
        sx={{ p: 4, textAlign: "center", width: "100%" }}
      >
        <Typography variant="h5" color="success.main" gutterBottom>
          {t("form.successCreate")}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Redirecionando para a lista de links...
        </Typography>
      </EnhancedPaper>
    );
  }

  return (
    <ResponsiveContainer variant="form" maxWidth="md">
      <EnhancedPaper variant="glass" animated>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 3, pb: 2 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              {t("form.createTitle")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Transforme URLs longas em links curtos e rastreáveis
            </Typography>
          </Box>

          {apiError ? (
            <Box sx={{ px: 3, pb: 2 }}>
              <Alert severity="error">{apiError}</Alert>
            </Box>
          ) : null}

          <Box sx={{ px: 3, pb: 3 }}>
            <LinkFormFields control={control} errors={errors} isEdit={false} />
          </Box>

          <Box
            sx={{
              px: 3,
              py: 2.5,
              borderTop: 1,
              borderColor: "divider",
              backgroundColor: "action.hover",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="space-between"
              sx={{ width: "100%" }}
            >
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </Button>

              <Stack direction="row" spacing={2}>
                {isDirty ? (
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={handleReset}
                    disabled={loading}
                  >
                    Resetar
                  </Button>
                ) : null}

                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  disabled={!isValid || loading}
                  startIcon={
                    loading ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <AppIcon intent="save" />
                    )
                  }
                >
                  {loading ? t("form.submit") : t("form.submit")}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </form>
      </EnhancedPaper>
    </ResponsiveContainer>
  );
}

export default CreateLinkForm;
