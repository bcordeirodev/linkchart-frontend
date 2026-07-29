"use client";

import NextLink from "next/link";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { AppIcon } from "@/shared/ui/icons";

import { getPublicBioUrlPrefix } from "../utils/publicBioUrl";
import { BioPreviewPhone } from "./BioPreviewPhone";

import type { BioItem } from "../types";

/**
 * Illustrative (never persisted) items feeding the gate's phone mock, so it
 * reads as a populated example page rather than the live editor's genuinely
 * empty "your links will show up here" state. Built inside the component
 * (not module scope) because labels are translated; ids are negative
 * sentinels — nothing here is ever sent to the API.
 */
function buildExampleItems(t: (key: string) => string): BioItem[] {
  return [
    {
      id: -1,
      linkId: -1,
      label: t("gate.exampleItems.site"),
      position: 0,
      isActive: true,
      url: "#",
      clicks: 0,
      faviconUrl: null,
    },
    {
      id: -2,
      linkId: -2,
      label: t("gate.exampleItems.instagram"),
      position: 1,
      isActive: true,
      url: "#",
      clicks: 0,
      faviconUrl: null,
    },
    {
      id: -3,
      linkId: -3,
      label: t("gate.exampleItems.shop"),
      position: 2,
      isActive: true,
      url: "#",
      clicks: 0,
      faviconUrl: null,
    },
  ];
}

/**
 * Entry gate for the bio editor: replaces the create form entirely for a
 * user who holds no active subdomain yet, rather than showing a disabled
 * form with no clear way forward.
 *
 * Subdomain-first product decision: a bio page's identity IS its subdomain
 * (`voce.linkcharts.com.br`, not a generic shared link), and the backend
 * enforces this by rejecting page creation without one — so there is
 * nothing valid to fill in until an address exists. `BioEditor` renders this
 * in place of the whole two-column form+preview layout when `mode ===
 * "create"` and `useSubdomains()` resolves to an empty list; it disappears
 * for good the moment the user claims their first subdomain (`/subdomains`)
 * and comes back.
 *
 * The headline reuses the same address-as-identity idea the rest of the
 * feature leans on (monospace, `{handle}.{host}`) so the pitch and the real
 * editor read as one continuous idea rather than a separate marketing
 * screen; the phone mock reuses `BioPreviewPhone` with static example
 * content instead of live (empty) form values, so it shows what a finished
 * page looks like rather than an empty editor preview.
 */
export function BioSubdomainGate() {
  const theme = useTheme();
  const { t } = useTranslation("bio");

  const host = getPublicBioUrlPrefix().replace(/\/@$/, "");
  const placeholderHandle = t("preview.placeholderHandle");
  // Cast, not a raw pass-through: react-i18next's heavily overloaded
  // `TFunction` crashes this TypeScript version's overload resolution when
  // passed as-is into a differently (plainly) typed parameter — same
  // workaround already used for `bioPageFormSchema(t as ...)` in
  // `BioEditor.tsx` and `validateAvatarFile(t as ...)` in `BioAvatarField.tsx`.
  const exampleItems = buildExampleItems(t as (key: string) => string);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 3, md: 5 },
        alignItems: "center",
      }}
    >
      <Stack spacing={2.5} sx={{ flex: 1, minWidth: 0, width: "100%" }}>
        <Box
          sx={{
            fontFamily: "monospace",
            fontSize: { xs: "1.375rem", sm: "1.625rem" },
            fontWeight: 700,
            lineHeight: 1.25,
            wordBreak: "break-all",
          }}
        >
          <Box component="span" sx={{ color: theme.palette.primary.main }}>
            {placeholderHandle}
          </Box>
          <Box component="span" sx={{ color: "text.secondary" }}>
            .{host}
          </Box>
        </Box>

        <Box>
          <Typography
            variant="h6"
            component="p"
            sx={{ fontWeight: 700, fontSize: "1.125rem", mb: 0.75 }}
          >
            {t("gate.title")}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 440 }}
          >
            {t("gate.description")}
          </Typography>
        </Box>

        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            justifyContent: "center",
            width: "100%",
            py: 1,
          }}
        >
          <Box sx={{ maxWidth: 260, width: "100%" }}>
            <BioPreviewPhone
              address={`${placeholderHandle}.${host}`}
              title={t("preview.placeholderTitle")}
              bio={t("gate.exampleBio")}
              theme="dark"
              items={exampleItems}
            />
          </Box>
        </Box>

        <Box>
          <Button
            component={NextLink}
            href="/subdomains"
            variant="contained"
            size="large"
            startIcon={<AppIcon intent="subdomain" size={18} />}
            sx={{ minHeight: 44, width: { xs: "100%", sm: "auto" } }}
          >
            {t("gate.cta")}
          </Button>
        </Box>
      </Stack>

      <Box
        sx={{
          display: { xs: "none", md: "block" },
          width: 300,
          flexShrink: 0,
        }}
      >
        <BioPreviewPhone
          address={`${placeholderHandle}.${host}`}
          title={t("preview.placeholderTitle")}
          bio={t("gate.exampleBio")}
          theme="dark"
          items={exampleItems}
        />
      </Box>
    </Box>
  );
}

export default BioSubdomainGate;
