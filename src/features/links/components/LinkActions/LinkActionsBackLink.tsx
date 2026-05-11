"use client";
import { Box } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import NextLink from "next/link";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";

/**
 * Back link rendered at the top of the LinkActions toolbar.
 *
 * Always navigates to `/links` (the links list page), regardless of
 * browser history. The previous smart-history behavior was dropped
 * because users reported losing a reliable way to return to the list
 * when jumping between sibling views of the same link.
 *
 * Uses Next.js `<Link>` so the anchor is real (middle-click / cmd-click
 * open `/links` in a new tab) AND the in-tab click is client-side
 * routing (no full page reload).
 */
export function LinkActionsBackLink() {
  const { t } = useTranslation("links");

  return (
    <Box
      component={NextLink}
      href="/links"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        color: "text.secondary",
        textDecoration: "none",
        fontSize: "0.8125rem",
        fontWeight: 500,
        "&:hover": { color: "text.primary" },
      }}
    >
      <ArrowLeft {...ICON_MD} />
      {t("actions.back")}
    </Box>
  );
}

export default LinkActionsBackLink;
