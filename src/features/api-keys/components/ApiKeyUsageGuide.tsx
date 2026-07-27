"use client";

import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useTranslation } from "react-i18next";

import { radiusTokens } from "@/lib/theme/designSystem";
import useClipboard from "@/shared/hooks/useClipboard";

import { PUBLIC_API_BASE_URL } from "../constants";

interface CurlExampleProps {
  title: string;
  description: string;
  command: string;
}

/**
 * One copy-pasteable `curl` example: title, one-line explanation and the
 * command in a terminal-styled block. The block stays dark in BOTH themes on
 * purpose — a terminal is dark, and keeping it so makes the command read as
 * "paste me in a shell" rather than as page prose. Wide commands scroll
 * horizontally inside the block; the page never scrolls sideways.
 */
function CurlExample({ title, description, command }: CurlExampleProps) {
  const { t } = useTranslation("apiKeys");
  const { copied, copy } = useClipboard();

  return (
    <Box>
      <Typography variant="subtitle2" component="h3" sx={{ mb: 0.25 }}>
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 1, fontSize: "0.8125rem" }}
      >
        {description}
      </Typography>
      <Box
        sx={{
          position: "relative",
          borderRadius: `${radiusTokens.md}px`,
          bgcolor: "grey.900",
          color: "grey.100",
          border: "1px solid",
          borderColor: "grey.800",
        }}
      >
        <Box
          component="pre"
          sx={{
            m: 0,
            p: { xs: 1.5, sm: 2 },
            pr: 7,
            overflowX: "auto",
            fontFamily: "monospace",
            fontSize: "0.78rem",
            lineHeight: 1.7,
            whiteSpace: "pre",
          }}
        >
          <code>{command}</code>
        </Box>
        <Tooltip title={copied ? t("usage.copied") : t("usage.copy")}>
          <IconButton
            size="small"
            aria-label={t("usage.copy")}
            onClick={() => copy(command)}
            sx={{
              position: "absolute",
              top: 6,
              right: 6,
              width: { xs: 44, sm: 36 },
              height: { xs: 44, sm: 36 },
              color: copied ? "success.light" : "grey.400",
              "&:hover": { color: "common.white" },
            }}
          >
            {copied ? (
              <CheckIcon fontSize="small" />
            ) : (
              <ContentCopyIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

/**
 * Didactic "how to use" section of the `/api-keys` page: a short explanation
 * of the Bearer flow, a keep-it-secret note, and three ready-to-paste `curl`
 * examples (create a link, create it on a custom address via `subdomain_id`,
 * read its stats) against the public `/api/v1` API.
 * Commands are built here — not in i18n files — so the endpoints stay in one
 * place; only the token placeholder is localized.
 */
export function ApiKeyUsageGuide() {
  const { t } = useTranslation("apiKeys");

  const tokenPlaceholder = t("usage.placeholderToken");

  const createLinkCommand = [
    `curl -X POST ${PUBLIC_API_BASE_URL}/api/v1/links \\`,
    `  -H "Authorization: Bearer ${tokenPlaceholder}" \\`,
    `  -H "Content-Type: application/json" \\`,
    `  -d '{"original_url": "https://exemplo.com/campanha"}'`,
  ].join("\n");

  const subdomainCommand = [
    `curl -X POST ${PUBLIC_API_BASE_URL}/api/v1/links \\`,
    `  -H "Authorization: Bearer ${tokenPlaceholder}" \\`,
    `  -H "Content-Type: application/json" \\`,
    `  -d '{"original_url": "https://exemplo.com/campanha", "subdomain_id": 3}'`,
  ].join("\n");

  const statsCommand = [
    `curl ${PUBLIC_API_BASE_URL}/api/v1/links/42/stats \\`,
    `  -H "Authorization: Bearer ${tokenPlaceholder}"`,
  ].join("\n");

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle2" component="h2">
        {t("usage.heading")}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t("usage.intro")}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {t("usage.keepSecret")}
      </Typography>

      <CurlExample
        title={t("usage.createExample.title")}
        description={t("usage.createExample.description")}
        command={createLinkCommand}
      />
      <CurlExample
        title={t("usage.subdomainExample.title")}
        description={t("usage.subdomainExample.description")}
        command={subdomainCommand}
      />
      <CurlExample
        title={t("usage.statsExample.title")}
        description={t("usage.statsExample.description")}
        command={statsCommand}
      />
    </Stack>
  );
}

export default ApiKeyUsageGuide;
