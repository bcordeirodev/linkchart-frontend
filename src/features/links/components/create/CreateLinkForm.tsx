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

import { LinkFormFields } from "../../components/forms/LinkFormFields";
import {
  createLinkFormSchema,
  defaultLinkFormValues,
} from "../../components/forms/LinkFormSchema";

import type { LinkFormData } from "../../components/forms/LinkFormSchema";
import type { CreateLinkFormProps } from "../../types/forms";

/**
 * Form for creating a new link. Wraps `LinkFormFields` with submit/cancel
 * affordances and the `react-hook-form` plumbing. Page identity is provided
 * by the page chrome, so this card renders without an in-card title.
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
    formState: { errors, isValid },
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
        utm_source: data.utm_source || undefined,
        utm_medium: data.utm_medium || undefined,
        utm_campaign: data.utm_campaign || undefined,
        utm_term: data.utm_term || undefined,
        utm_content: data.utm_content || undefined,
      };

      const response = await linkService.save(payload);

      setSuccess(true);

      onSuccess?.(response);

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
    <EnhancedPaper variant="glass" animated>
      <form onSubmit={handleSubmit(onSubmit)}>
        {apiError ? (
          <Box sx={{ px: 3, pt: 3 }}>
            <Alert severity="error">{apiError}</Alert>
          </Box>
        ) : null}

        <Box sx={{ px: 3, py: 3 }}>
          <LinkFormFields control={control} errors={errors} isEdit={false} />
        </Box>

        <Box
          sx={{
            px: 3,
            pb: 2.5,
            pt: 1,
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={loading}
              sx={{ flex: { xs: 1, sm: "initial" } }}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isValid || loading}
              startIcon={
                loading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <AppIcon intent="save" />
                )
              }
              sx={{ flex: { xs: 1, sm: "initial" } }}
            >
              {t("form.submit")}
            </Button>
          </Stack>
        </Box>
      </form>
    </EnhancedPaper>
  );
}

export default CreateLinkForm;
