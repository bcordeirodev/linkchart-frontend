"use client";
import { Box, Typography, Button } from "@mui/material";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ICON_LG } from "@/lib/theme/iconDefaults";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary for the authenticated `(app)` segment.
 *
 * Shows a generic, translated message — never `error.message`, which can leak
 * stack/internal details in production. The raw message renders only in
 * development; in production the user gets `error.digest` as a small support
 * code they can quote when reporting the problem.
 *
 * @remarks
 * i18n works here because this boundary renders inside the root layout, whose
 * `Providers` already ran `initI18n()` synchronously — `useTranslation` reads
 * the global i18next singleton (the app uses no `I18nextProvider` context).
 */
export default function AppError({ error, reset }: ErrorProps) {
  const { t } = useTranslation("common");

  useEffect(() => {
    console.error("App area error:", error);
  }, [error]);

  return (
    <Box
      p={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
    >
      <AlertCircle {...ICON_LG} />
      <Typography variant="h6">{t("errors.title")}</Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 480, textAlign: "center" }}
      >
        {t("errors.description")}
      </Typography>
      {process.env.NODE_ENV === "development" && error.message ? (
        <Typography
          variant="body2"
          color="error.main"
          sx={{
            fontFamily: "monospace",
            maxWidth: 560,
            wordBreak: "break-word",
            textAlign: "center",
          }}
        >
          {error.message}
        </Typography>
      ) : null}
      <Button variant="outlined" onClick={reset}>
        {t("errors.retry")}
      </Button>
      {error.digest ? (
        <Typography variant="caption" color="text.disabled">
          {t("errors.supportCode", { code: error.digest })}
        </Typography>
      ) : null}
    </Box>
  );
}
