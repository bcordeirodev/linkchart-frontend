"use client";
import { useCallback, useState } from "react";

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
import { useLinkCreationOrchestration } from "../../hooks/useLinkCreationOrchestration";
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
   * Turns a submitted form value into the API's create payload: commits the
   * effective slug (typed value wins, otherwise the resolved suggestion —
   * `slugSuggestion` is only non-null once resolved and the field is empty),
   * strips the form-only `password_mode` discriminator, omits `password`
   * entirely when blank (write-only field; `""` is reserved for the update
   * flow's "remove password"), and folds in dates/UTMs/subdomain.
   */
  const buildPayload = useCallback(
    (data: LinkFormData) => {
      const typedSlug = (data.custom_slug ?? "").trim();
      const effectiveSlug = typedSlug || slugSuggestion || undefined;

      const { password, password_mode: _passwordMode, ...formData } = data;

      return {
        ...formData,
        ...(password ? { password } : {}),
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
    },
    [slugSuggestion, subdomainIdField],
  );

  const createLink = useCallback(
    async (data: LinkFormData) => {
      const response = await mutation.mutateAsync(buildPayload(data));
      await copyShortUrlForLink(response);
      return response;
    },
    [mutation, buildPayload, copyShortUrlForLink],
  );

  // Centralized Safe Browsing gate (shared with the public shortener and the
  // list page's quick-create) — see `useLinkCreationOrchestration`. The
  // actual debounced check still runs once, inside `LinkFormFields` (shared
  // with the edit form), and is bubbled up here via `onSafetyStatusChange`
  // below rather than re-run a second time against the same URL.
  const { isBlocked, isSettling, guardedSubmit } = useLinkCreationOrchestration<
    LinkFormData,
    Awaited<ReturnType<typeof createLink>>
  >({
    strategy: "authenticated",
    externalSafety: { status: safetyStatus, threats: [] },
    create: createLink,
    onSuccess: (response) => {
      onSuccess?.(response);
      // Lands on `/links?created={id}` so the list page highlights the new
      // link (the param is stripped there after firing).
      navigate(`/links?created=${encodeURIComponent(String(response.id))}`);
    },
    onError: (error) => {
      // Map 422 field errors inline; the mutation's onError handles the toast.
      applyBackendFieldErrors<LinkFormData>(error, setError);
    },
  });

  // "error" (a failed safety check) stays fail-open, matching the backend
  // behavior — only an explicit "unsafe" verdict or a check still in flight
  // disables the submit button.
  const safetyBlocked = isBlocked || isSettling;

  const handleCancel = () => {
    if (showBackButton) {
      navigate(-1);
    } else {
      navigate("/links");
    }
  };

  return (
    <form onSubmit={handleSubmit(guardedSubmit)}>
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
