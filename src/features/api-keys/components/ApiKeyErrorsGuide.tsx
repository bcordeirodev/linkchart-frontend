"use client";

import { Box, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

/** i18n keys (within `apiKeys:usage.errors.items`) in display order. */
const ERROR_ITEM_KEYS = [
  "unauthenticated",
  "validation",
  "invalidSubdomain",
  "notFound",
  "rateLimited",
] as const;

/**
 * "Errors" section of the usage guide: the `{error: {code, message}}`
 * envelope every failure comes in, the stable codes a robust script should
 * branch on, and a closing note that unsafe destination URLs are rejected by
 * the same anti-phishing pipeline as the dashboard. Codes are the contract
 * (English, stable); messages are human-facing helper text.
 */
export function ApiKeyErrorsGuide() {
  const { t } = useTranslation("apiKeys");

  return (
    <Box>
      <Typography variant="subtitle2" component="h3" sx={{ mb: 0.5 }}>
        {t("usage.errors.heading")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {t("usage.errors.intro")}
      </Typography>
      <Stack component="ul" spacing={0.5} sx={{ m: 0, pl: 2.5 }}>
        {ERROR_ITEM_KEYS.map((key) => (
          <Typography
            key={key}
            component="li"
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "0.8125rem" }}
          >
            {t(`usage.errors.items.${key}`)}
          </Typography>
        ))}
      </Stack>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 1 }}
      >
        {t("usage.errors.safetyNote")}
      </Typography>
    </Box>
  );
}

export default ApiKeyErrorsGuide;
