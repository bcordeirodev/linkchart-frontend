"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@/shared/hooks";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

import { useAppDispatch } from "@/lib/store/hooks";
import { showErrorMessage } from "@/lib/store/messageSlice";
import { linkService } from "@/services";
import { LinkFormSkeleton } from "@/shared/ui/feedback/skeletons";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import { getLinkFormPanelSx } from "@/features/links/components/forms/linkFormPanelStyles";
import { useTheme } from "@mui/material/styles";

import { LinkFormActionsFooter } from "../../components/forms/LinkFormActionsFooter";
import { LinkFormFields } from "../../components/forms/LinkFormFields";
import { LinkFormShell } from "../../components/forms/LinkFormShell";
import {
  createLinkFormSchema,
  defaultLinkFormValues,
} from "../../components/forms/LinkFormSchema";
import { useLinkFormMetaSuggestions } from "../../hooks/useLinkFormMetaSuggestions";

import type { LinkFormData } from "../../components/forms/LinkFormSchema";
import type { EditLinkFormProps } from "../../types/forms";

export function EditLinkForm({
  linkId,
  onSuccess,
  showBackButton = false,
}: EditLinkFormProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation("links");
  const { t: tCommon } = useTranslation("common");
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [ownedSlug, setOwnedSlug] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    setValue,
  } = useForm<LinkFormData>({
    resolver: zodResolver(
      createLinkFormSchema(
        t as (key: string, options?: Record<string, unknown>) => string,
      ),
    ),
    defaultValues: defaultLinkFormValues,
    mode: "onChange",
  });

  const {
    slugSuggestion,
    isResolvingSlugSuggestion,
    titleSuggestion,
    isLoadingMeta,
  } = useLinkFormMetaSuggestions({
    control,
    setValue,
    excludeSlug: ownedSlug,
  });

  const convertApiDateToDayjs = (
    dateString: string | null | undefined,
  ): Dayjs | null => {
    if (!dateString) {
      return null;
    }

    try {
      let date: Date;

      if (dateString.includes("/")) {
        const [datePart, timePart] = dateString.split(" ");
        const [day, month, year] = datePart.split("/");
        const dateIso = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        date = new Date(timePart ? `${dateIso}T${timePart}` : dateIso);
      } else {
        date = new Date(dateString);
      }

      if (isNaN(date.getTime())) {
        return null;
      }

      return dayjs(date);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchLinkData = async () => {
      try {
        setFetchingData(true);
        setLoadFailed(false);
        const linkData = await linkService.findOne(linkId);

        if (linkData) {
          const formValues: LinkFormData = {
            original_url: linkData.original_url || "",
            title: linkData.title || "",
            custom_slug: linkData.custom_slug || linkData.slug || "",
            description: linkData.description || "",
            is_active: linkData.is_active ?? true,
            expires_at: convertApiDateToDayjs(linkData.expires_at),
            starts_in: convertApiDateToDayjs(linkData.starts_in),
            click_limit: linkData.click_limit || null,
            utm_source: linkData.utm_source || "",
            utm_medium: linkData.utm_medium || "",
            utm_campaign: linkData.utm_campaign || "",
            utm_term: linkData.utm_term || "",
            utm_content: linkData.utm_content || "",
          };

          reset(formValues);
          setOwnedSlug(formValues.custom_slug?.trim() || null);
        } else {
          throw new Error(t("errors.linkNotFound"));
        }
      } catch (error: unknown) {
        setApiError(
          error instanceof Error ? error.message : t("errors.loadLink"),
        );
        setLoadFailed(true);
      } finally {
        setFetchingData(false);
      }
    };

    if (linkId) {
      fetchLinkData();
    }
  }, [linkId, reset, t]);

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
    } catch {
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

      const response = await linkService.update(linkId, payload);

      onSuccess?.(response);

      reset(data);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        (
          error as {
            response?: { data?: { errors?: Record<string, string[]> } };
          }
        ).response?.data?.errors
      ) {
        const backendErrors = (
          error as { response: { data: { errors: Record<string, string[]> } } }
        ).response.data.errors;
        Object.keys(backendErrors).forEach((field) => {
          setError(field as keyof LinkFormData, {
            message: backendErrors[field][0],
          });
        });
      } else {
        const errorMessage =
          (error && typeof error === "object" && "message" in error
            ? (error.message as string)
            : null) || t("errors.unexpectedUpdate");
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

  if (fetchingData) {
    return <LinkFormSkeleton isEdit />;
  }

  if (loadFailed) {
    return (
      <EnhancedPaper
        variant="outlined"
        animated={false}
        sx={{ ...getLinkFormPanelSx(theme), p: 2.5 }}
      >
        <Alert
          severity="error"
          action={
            <Button size="small" onClick={handleCancel}>
              {tCommon("actions.back")}
            </Button>
          }
        >
          <Typography variant="subtitle2" component="div" gutterBottom>
            {t("form.loadErrorTitle")}
          </Typography>
          <Typography variant="body2">
            {apiError || t("form.loadErrorDesc")}
          </Typography>
        </Alert>
      </EnhancedPaper>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <LinkFormShell
        alert={
          apiError ? <Alert severity="error">{apiError}</Alert> : undefined
        }
        footer={
          <LinkFormActionsFooter
            onCancel={handleCancel}
            submitLabel={t("form.submitEdit")}
            loading={loading}
          />
        }
      >
        <LinkFormFields
          control={control}
          errors={errors}
          isEdit
          slugSuggestion={slugSuggestion}
          isResolvingSlugSuggestion={isResolvingSlugSuggestion}
          titleSuggestion={titleSuggestion}
          isLoadingMeta={isLoadingMeta}
        />
      </LinkFormShell>
    </form>
  );
}

export default EditLinkForm;
