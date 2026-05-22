"use client";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@/shared/hooks";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

import { ApiError } from "@/lib/api/client";

import { LinkFormActionsFooter } from "../../components/forms/LinkFormActionsFooter";
import { LinkFormFields } from "../../components/forms/LinkFormFields";
import { LinkFormShell } from "../../components/forms/LinkFormShell";
import {
  createLinkFormSchema,
  defaultLinkFormValues,
} from "../../components/forms/LinkFormSchema";
import { useCopyShortUrlForLink } from "../../hooks/useCopyShortUrlForLink";
import { useCreateLink } from "../../hooks/useLinks";
import { useUrlMeta } from "../../hooks/useUrlMeta";
import { slugify } from "../../utils/slugify";

import type { LinkFormData } from "../../components/forms/LinkFormSchema";
import type { CreateLinkFormProps } from "../../types/forms";

export function CreateLinkForm({
  onSuccess,
  showBackButton = false,
}: CreateLinkFormProps) {
  const navigate = useNavigate();
  const { t } = useTranslation("links");
  const mutation = useCreateLink();
  const copyShortUrlForLink = useCopyShortUrlForLink();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    setValue,
    getValues,
  } = useForm<LinkFormData>({
    resolver: zodResolver(
      createLinkFormSchema(
        t as (key: string, options?: Record<string, unknown>) => string,
      ),
    ),
    defaultValues: defaultLinkFormValues,
    mode: "onChange",
  });

  // Watch the URL field to trigger metadata lookup
  const urlValue = useWatch({ control, name: "original_url" });
  const { ogTitle, isLoading: isLoadingMeta } = useUrlMeta(urlValue ?? "");
  const slugSuggestion = ogTitle ? slugify(ogTitle) : null;

  // Silently fill the title field when og:title arrives and the field is still empty
  useEffect(() => {
    if (ogTitle && !getValues("title")) {
      setValue("title", ogTitle, { shouldValidate: false, shouldDirty: false });
    }
  }, [ogTitle, setValue, getValues]);

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
      await copyShortUrlForLink(response);
      onSuccess?.(response);
      navigate("/links");
    } catch (error: unknown) {
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <LinkFormShell
        footer={
          <LinkFormActionsFooter
            onCancel={handleCancel}
            submitLabel={t("form.submit")}
            loading={mutation.isPending}
            submitDisabled={!isValid}
          />
        }
      >
        <LinkFormFields
          control={control}
          errors={errors}
          isEdit={false}
          slugSuggestion={slugSuggestion}
          isLoadingMeta={isLoadingMeta}
        />
      </LinkFormShell>
    </form>
  );
}

export default CreateLinkForm;
