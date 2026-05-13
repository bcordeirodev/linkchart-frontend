"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, CircularProgress, Stack, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@/shared/hooks";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

import { AppIcon } from "@/shared/ui/icons";
import { ApiError } from "@/lib/api/client";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";

import { LinkFormFields } from "../../components/forms/LinkFormFields";
import {
  createLinkFormSchema,
  defaultLinkFormValues,
} from "../../components/forms/LinkFormSchema";
import { useCreateLink } from "../../hooks/useLinks";

import type { LinkFormData } from "../../components/forms/LinkFormSchema";
import type { CreateLinkFormProps } from "../../types/forms";

/**
 * Form for creating a new link. Wraps `LinkFormFields` with submit/cancel
 * affordances and the `react-hook-form` plumbing. Page identity is provided
 * by the page chrome, so this card renders without an in-card title.
 *
 * On success: cache is invalidated via `useCreateLink` and the user is
 * redirected immediately to `/links` where the new link appears first.
 * Generic API errors are dispatched as toasts by the mutation hook;
 * field-level validation errors are mapped to their respective inputs.
 */
export function CreateLinkForm({
  onSuccess,
  showBackButton = false,
}: CreateLinkFormProps) {
  const navigate = useNavigate();
  const { t } = useTranslation("links");
  const mutation = useCreateLink();

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

    try {
      const response = await mutation.mutateAsync(payload);
      onSuccess?.(response);
      navigate("/links");
    } catch (error: unknown) {
      // Field-level validation errors from the API are mapped to their inputs.
      // Generic errors are already dispatched as a toast by useCreateLink's onError.
      if (error instanceof ApiError && error.details?.errors) {
        const backendErrors = error.details.errors as Record<string, string[]>;
        Object.keys(backendErrors).forEach((field) => {
          setError(field as keyof LinkFormData, {
            message: backendErrors[field][0],
          });
        });
      }
    }
  };

  const handleCancel = () => {
    if (showBackButton) {
      navigate(-1);
    } else {
      navigate("/links");
    }
  };

  return (
    <EnhancedPaper variant="glass" animated>
      <form onSubmit={handleSubmit(onSubmit)}>
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
              disabled={mutation.isPending}
              sx={{ flex: { xs: 1, sm: "initial" } }}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isValid || mutation.isPending}
              startIcon={
                mutation.isPending ? (
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
