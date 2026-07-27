"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Skeleton,
  Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { useMessage } from "@/lib/providers/MessageProvider";
import useThemeMediaQuery from "@/shared/hooks/useThemeMediaQuery";
import { AppIcon } from "@/shared/ui/icons";

import { useBioPage, useUpsertBioPage } from "../hooks/useBioPage";
import { useHandleAvailability } from "../hooks/useHandleAvailability";
import { applyBioFieldErrors } from "../utils/applyBioFieldErrors";
import {
  bioPageFormSchema,
  defaultBioPageFormValues,
} from "../utils/bioPageFormSchema";
import { getPublicBioUrl } from "../utils/publicBioUrl";
import { BioCreateIntro } from "./BioCreateIntro";
import { BioItemsSection } from "./BioItemsSection";
import { BioPageFormFields } from "./BioPageFormFields";
import { BioPreviewPhone } from "./BioPreviewPhone";
import { BioPublicUrlBar } from "./BioPublicUrlBar";

import type { BioPage } from "../types";
import type { BioPageFormData } from "../utils/bioPageFormSchema";

/** Maps a persisted `BioPage` to the form's editable shape. */
function mapPageToFormValues(page: BioPage): BioPageFormData {
  return {
    handle: page.handle,
    title: page.title,
    bio: page.bio ?? "",
    theme: page.theme,
    isActive: page.isActive,
  };
}

/**
 * Top-level bio page editor: owns the shared `react-hook-form` instance (so
 * `BioPreviewPhone` can watch it live), the create/edit mode switch, and the
 * two-column responsive layout (form left, live preview right on desktop;
 * stacked with a collapsible preview on phones).
 */
export function BioEditor() {
  const { t } = useTranslation("bio");
  const { showMessage } = useMessage();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("md"));

  const { page, isLoading } = useBioPage();
  const upsertPage = useUpsertBioPage();
  const mode: "create" | "edit" = page ? "edit" : "create";

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BioPageFormData>({
    resolver: zodResolver(
      bioPageFormSchema(
        t as (key: string, options?: Record<string, unknown>) => string,
      ),
    ),
    defaultValues: defaultBioPageFormValues,
    mode: "onChange",
  });

  // Hydrate the form once the page loads — mirrors `EditLinkForm`'s
  // load-then-reset pattern. The ref guard keeps a background refetch (e.g.
  // after a save) from clobbering in-progress edits.
  const hydratedRef = useRef(false);
  useEffect(() => {
    if (page && !hydratedRef.current) {
      hydratedRef.current = true;
      reset(mapPageToFormValues(page));
    }
  }, [page, reset]);

  // Watched live so `BioPreviewPhone` re-renders on every keystroke — all
  // called unconditionally, before any early return, per Rules of Hooks.
  const handleValue = useWatch({ control, name: "handle" });
  const titleValue = useWatch({ control, name: "title" });
  const bioValue = useWatch({ control, name: "bio" });
  const themeValue = useWatch({ control, name: "theme" });
  const handleAvailability = useHandleAvailability(handleValue, page?.handle);

  const [previewOpen, setPreviewOpen] = useState(false);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await upsertPage.mutateAsync({
        handle: values.handle,
        title: values.title,
        bio: values.bio,
        theme: values.theme,
        isActive: mode === "edit" ? values.isActive : undefined,
      });
      showMessage({
        message: t(mode === "create" ? "form.createdToast" : "form.savedToast"),
        variant: "success",
      });
    } catch (err) {
      applyBioFieldErrors<BioPageFormData>(err, setError);
    }
  });

  if (isLoading) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={220} />
        <Skeleton variant="rounded" height={160} />
      </Stack>
    );
  }

  const previewNode = (
    <BioPreviewPhone
      handle={handleValue || ""}
      title={titleValue || ""}
      bio={bioValue || ""}
      theme={themeValue || "dark"}
      items={page?.items ?? []}
    />
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 3, md: 4 },
        alignItems: "flex-start",
      }}
    >
      <Stack spacing={3} sx={{ flex: 1, minWidth: 0, width: "100%" }}>
        {mode === "create" ? <BioCreateIntro /> : null}
        {mode === "edit" && page ? (
          <BioPublicUrlBar url={getPublicBioUrl(page.handle)} />
        ) : null}

        {isMobile ? (
          <Button
            variant="text"
            size="small"
            startIcon={
              <AppIcon intent={previewOpen ? "collapse" : "expand"} size={16} />
            }
            onClick={() => setPreviewOpen((v) => !v)}
            sx={{ alignSelf: "flex-start" }}
          >
            {t(previewOpen ? "preview.hideAction" : "preview.showAction")}
          </Button>
        ) : null}
        {isMobile && previewOpen ? (
          <Box sx={{ maxWidth: 300, mx: "auto", width: "100%" }}>
            {previewNode}
          </Box>
        ) : null}

        <form onSubmit={onSubmit} noValidate>
          <Stack spacing={3}>
            <BioPageFormFields
              control={control}
              errors={errors}
              mode={mode}
              handleAvailability={handleAvailability}
            />
            <Box>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || upsertPage.isPending}
                sx={{ minHeight: 44 }}
              >
                {isSubmitting || upsertPage.isPending ? (
                  <CircularProgress size={16} sx={{ mr: 1 }} color="inherit" />
                ) : null}
                {t(mode === "create" ? "form.createSubmit" : "form.saveSubmit")}
              </Button>
            </Box>
          </Stack>
        </form>

        {mode === "edit" && page ? (
          <>
            <Divider />
            <BioItemsSection page={page} />
          </>
        ) : null}
      </Stack>

      {!isMobile ? (
        <Box
          sx={{
            width: 320,
            flexShrink: 0,
            position: "sticky",
            top: 24,
          }}
        >
          {previewNode}
        </Box>
      ) : null}
    </Box>
  );
}

export default BioEditor;
