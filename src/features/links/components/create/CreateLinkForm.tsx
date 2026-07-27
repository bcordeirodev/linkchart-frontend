"use client";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@/shared/hooks";
import { useSubdomainSelection } from "@/features/subdomains/hooks/useSubdomainSelection";

import { LinkFormActionsFooter } from "../../components/forms/LinkFormActionsFooter";
import { LinkFormFields } from "../../components/forms/LinkFormFields";
import { LinkFormShell } from "../../components/forms/LinkFormShell";
import {
  createLinkFormSchema,
  defaultLinkFormValues,
} from "../../components/forms/LinkFormSchema";
import { useCopyShortUrlForLink } from "../../hooks/useCopyShortUrlForLink";
import { useCreateLink } from "../../hooks/useLinks";
import { useCreateLinkMetaSuggestions } from "../../hooks/useCreateLinkMetaSuggestions";
import { applyBackendFieldErrors } from "../../utils/applyBackendFieldErrors";

import type { LinkFormData } from "../../components/forms/LinkFormSchema";
import type { UrlSafetyStatus } from "../../hooks/useUrlSafetyCheck";
import type { CreateLinkFormProps } from "../../types/forms";

export function CreateLinkForm({
  onSuccess,
  showBackButton = false,
}: CreateLinkFormProps) {
  const navigate = useNavigate();
  const { t } = useTranslation("links");
  const mutation = useCreateLink();
  const copyShortUrlForLink = useCopyShortUrlForLink();
  const { subdomainId, setSubdomainId, subdomainIdField } =
    useSubdomainSelection();
  const [safetyStatus, setSafetyStatus] = useState<UrlSafetyStatus>("idle");
  // Safe Browsing gate: never let an unsafe (or still-being-checked) URL
  // through. "error" stays fail-open, matching the backend behavior.
  const safetyBlocked =
    safetyStatus === "checking" || safetyStatus === "unsafe";

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
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
  } = useCreateLinkMetaSuggestions({ control, setValue });

  const convertDateForSubmit = (
    dateValue: Date | null | undefined,
  ): string | undefined => {
    if (!dateValue) {
      return undefined;
    }

    if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
      return dateValue.toISOString();
    }

    return undefined;
  };

  /**
   * Validates the Safe Browsing gate, commits the effective slug, creates the
   * link, copies its short URL and lands on `/links?created={id}` so the list
   * page highlights the new link (the param is stripped there after firing).
   */
  const onSubmit = async (data: LinkFormData) => {
    // The disabled submit button is UI-only; re-check here so programmatic
    // submits (e.g. Enter key) can't bypass the Safe Browsing gate.
    if (safetyBlocked) {
      return;
    }

    // The smart suggestion is the default: when the user left the name field
    // empty, commit the resolved suggestion (the ghost the field was showing) so
    // the created link matches it, instead of letting the backend mint a
    // different random slug. `slugSuggestion` is already non-null only when it has
    // resolved and the field is empty; a typed name always wins.
    const typedSlug = (data.custom_slug ?? "").trim();
    const effectiveSlug = typedSlug || slugSuggestion || undefined;

    const payload = {
      ...data,
      custom_slug: effectiveSlug,
      expires_at: convertDateForSubmit(data.expires_at),
      starts_in: convertDateForSubmit(data.starts_in),
      utm_source: data.utm_source || undefined,
      utm_medium: data.utm_medium || undefined,
      utm_campaign: data.utm_campaign || undefined,
      utm_term: data.utm_term || undefined,
      utm_content: data.utm_content || undefined,
      // `subdomainIdField` is `{ subdomain_id }` once the subdomains list has
      // loaded (and the feature is on), or `undefined` while still loading —
      // spreading `undefined` omits the key entirely instead of sending an
      // explicit `null`, which the backend would read as "force the default
      // domain" rather than "use the user's oldest active subdomain". See
      // `useSubdomainSelection` for the full rationale.
      ...subdomainIdField,
    };

    try {
      const response = await mutation.mutateAsync(payload);
      await copyShortUrlForLink(response);
      onSuccess?.(response);
      navigate(`/links?created=${encodeURIComponent(String(response.id))}`);
    } catch (error: unknown) {
      // Map 422 field errors inline; the mutation's onError handles the toast.
      applyBackendFieldErrors<LinkFormData>(error, setError);
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
            submitDisabled={!isValid || safetyBlocked}
          />
        }
      >
        <LinkFormFields
          control={control}
          errors={errors}
          isEdit={false}
          slugSuggestion={slugSuggestion}
          isResolvingSlugSuggestion={isResolvingSlugSuggestion}
          titleSuggestion={titleSuggestion}
          isLoadingMeta={isLoadingMeta}
          onSafetyStatusChange={setSafetyStatus}
          subdomainId={subdomainId}
          onSubdomainIdChange={setSubdomainId}
        />
      </LinkFormShell>
    </form>
  );
}

export default CreateLinkForm;
