"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { CheckCircle2, Link2, Zap } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useCreateLink } from "@/features/links/hooks/useLinks";
import { useUrlSafetyCheck } from "@/features/links/hooks/useUrlSafetyCheck";
import { getUrlSafetyHelperNode } from "@/features/links/components/forms/UrlSafetyIndicator";
import { ICON_SM } from "@/lib/theme/iconDefaults";
import { useNavigate } from "@/shared/hooks";

const RESERVED_SLUGS = ["api", "admin", "www", "mail", "ftp", "r", "redirect"];

type TranslateFn = (key: string) => string;

function buildSchema(t: TranslateFn) {
  return z.object({
    original_url: z
      .string()
      .min(1, t("form.validation.urlRequired"))
      .url(t("form.validation.urlInvalid"))
      .regex(/^https?:\/\//, t("form.validation.urlScheme")),
    custom_slug: z
      .string()
      .min(3, t("form.validation.slugMin"))
      .max(50, t("form.validation.slugMax"))
      .regex(/^[a-zA-Z0-9\-_]+$/, t("form.validation.slugPattern"))
      .refine(
        (s) => !RESERVED_SLUGS.includes(s.toLowerCase()),
        t("form.validation.slugReserved"),
      )
      .optional()
      .or(z.literal("")),
  });
}

type QuickFormData = {
  original_url: string;
  custom_slug?: string;
};

/**
 * Inline quick-create form at the top of the links list page.
 * Exposes only URL and optional slug; full options are one click away via "More options".
 * Runs Google Safe Browsing on the URL before allowing submission.
 * Relies on `useCreateLink` so the list query is invalidated automatically on success.
 */
export function LinksQuickCreate() {
  const theme = useTheme();
  const { t } = useTranslation("links");
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateLink();
  const [succeeded, setSucceeded] = useState(false);

  const schema = useMemo(() => buildSchema(t), [t]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<QuickFormData>({
    resolver: zodResolver(schema),
    defaultValues: { original_url: "", custom_slug: "" },
  });

  const urlValue = watch("original_url");
  const { status: safetyStatus, threats } = useUrlSafetyCheck(urlValue ?? "");

  const urlIsUnsafe = safetyStatus === "unsafe";
  const urlIsChecking = safetyStatus === "checking";

  const urlHelperText = errors.original_url?.message
    ? errors.original_url.message
    : safetyStatus !== "idle"
      ? getUrlSafetyHelperNode(safetyStatus, threats, t)
      : undefined;

  const onSubmit = useCallback(
    async (data: QuickFormData) => {
      if (urlIsUnsafe || urlIsChecking) return;
      await mutateAsync({
        original_url: data.original_url,
        custom_slug: data.custom_slug || undefined,
      });
      setSucceeded(true);
      reset();
      setTimeout(() => setSucceeded(false), 2000);
    },
    [mutateAsync, reset, urlIsUnsafe, urlIsChecking],
  );

  return (
    <Paper
      variant="outlined"
      sx={{
        px: { xs: 2, sm: 2.5 },
        pt: { xs: 1.75, sm: 2 },
        pb: { xs: 2, sm: 2.5 },
        mb: 3,
        borderRadius: 2,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1.5 }}>
        <Zap {...ICON_SM} color={theme.palette.primary.main} />
        <Typography
          variant="body2"
          fontWeight={600}
          color="text.primary"
          sx={{ letterSpacing: "0.02em" }}
        >
          {t("list.quickCreate.label")}
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          gap: 1.5,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "flex-start" },
        }}
      >
        <TextField
          {...register("original_url")}
          placeholder={t("list.quickCreate.urlPlaceholder")}
          size="small"
          error={!!errors.original_url || urlIsUnsafe}
          helperText={urlHelperText}
          disabled={isPending}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Link2 {...ICON_SM} color={theme.palette.text.secondary} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ flex: 2, minWidth: 0 }}
        />

        <TextField
          {...register("custom_slug")}
          placeholder={t("list.quickCreate.slugPlaceholder")}
          size="small"
          error={!!errors.custom_slug}
          helperText={errors.custom_slug?.message}
          disabled={isPending}
          sx={{ flex: 1, minWidth: 0 }}
        />

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexShrink: 0,
            alignSelf: { xs: "stretch", sm: "flex-start" },
          }}
        >
          <Button
            type="submit"
            variant="contained"
            disabled={isPending || urlIsUnsafe || urlIsChecking}
            startIcon={succeeded ? <CheckCircle2 {...ICON_SM} /> : undefined}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              minWidth: 110,
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: theme.transitions.create("background-color"),
              ...(succeeded && {
                backgroundColor: theme.palette.success.main,
                "&:hover": { backgroundColor: theme.palette.success.dark },
              }),
            }}
          >
            {succeeded
              ? t("list.quickCreate.success")
              : t("list.quickCreate.submit")}
          </Button>
          <Button
            variant="text"
            onClick={() => navigate("/links/create")}
            sx={{
              textTransform: "none",
              color: "text.secondary",
              whiteSpace: "nowrap",
              flexShrink: 0,
              fontSize: "0.8125rem",
            }}
          >
            {t("list.quickCreate.moreOptions")}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default LinksQuickCreate;
