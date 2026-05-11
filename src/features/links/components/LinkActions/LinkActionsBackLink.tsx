"use client";
import { Box } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import NextLink from "next/link";
import { useTranslation } from "react-i18next";

import { ICON_SM } from "@/lib/theme/iconDefaults";

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
      sx={(theme) => ({
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.25,
        py: 0.625,
        borderRadius: 999,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: "transparent",
        color: "text.secondary",
        textDecoration: "none",
        fontSize: "0.8125rem",
        fontWeight: 500,
        lineHeight: 1,
        transition: theme.transitions.create(
          ["color", "background-color", "border-color", "box-shadow"],
          { duration: theme.transitions.duration.shorter },
        ),
        "& .LinkActionsBackLink-icon": {
          transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shorter,
          }),
        },
        "&:hover": {
          color: "text.primary",
          backgroundColor: theme.palette.action.hover,
          borderColor: theme.palette.text.primary,
        },
        "&:hover .LinkActionsBackLink-icon": {
          transform: "translateX(-2px)",
        },
        "&:focus-visible": {
          outline: "none",
          borderColor: theme.palette.primary.main,
          boxShadow: `0 0 0 3px ${theme.palette.action.focus}`,
          color: "text.primary",
        },
      })}
    >
      <ArrowLeft className="LinkActionsBackLink-icon" {...ICON_SM} />
      {t("actions.back")}
    </Box>
  );
}

export default LinkActionsBackLink;
