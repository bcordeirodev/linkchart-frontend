"use client";
import { Box, Typography, Button, Paper } from "@mui/material";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ICON_XL } from "@/lib/theme/iconDefaults";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Root-segment error boundary (pages below the root layout).
 *
 * Shows a generic, translated message — never `error.message`, which can leak
 * stack/internal details in production. The raw message renders only in
 * development; in production the user gets `error.digest` as a small support
 * code they can quote when reporting the problem.
 *
 * @remarks
 * i18n works here because this boundary still renders inside the root layout,
 * whose `Providers` already ran `initI18n()` synchronously — `useTranslation`
 * reads the global i18next singleton (the app uses no `I18nextProvider`
 * context). Errors thrown by the root layout itself go to
 * `app/global-error.tsx` instead, which cannot rely on i18n.
 */
export default function RootError({ error, reset }: ErrorProps) {
  const { t } = useTranslation("common");

  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={3}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 480, textAlign: "center" }}>
        <AlertTriangle {...ICON_XL} style={{ marginBottom: 16 }} />
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {t("errors.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t("errors.description")}
        </Typography>
        {process.env.NODE_ENV === "development" && error.message ? (
          <Typography
            variant="body2"
            color="error.main"
            sx={{
              mb: 3,
              fontFamily: "monospace",
              wordBreak: "break-word",
            }}
          >
            {error.message}
          </Typography>
        ) : null}
        <Button variant="contained" onClick={reset}>
          {t("errors.retry")}
        </Button>
        {error.digest ? (
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ display: "block", mt: 2 }}
          >
            {t("errors.supportCode", { code: error.digest })}
          </Typography>
        ) : null}
      </Paper>
    </Box>
  );
}
