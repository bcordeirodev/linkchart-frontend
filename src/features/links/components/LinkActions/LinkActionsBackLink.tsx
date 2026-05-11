"use client";
import { Box } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";

/**
 * Back link rendered at the top of the LinkActions toolbar.
 *
 * Behavior: on click, calls `router.back()` when the current tab has
 * prior history (`window.history.length > 1`), otherwise navigates to
 * `/links` so cold-loaded pages still have a sensible fallback.
 *
 * The element is a real anchor (`<a href="/links">`) so that
 * middle-click / cmd-click open the fallback destination in a new tab.
 * The smart-back behavior is wired in `onClick`, which preventDefaults
 * the normal navigation.
 */
export function LinkActionsBackLink() {
  const router = useRouter();
  const { t } = useTranslation("links");

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
      } else {
        router.push("/links");
      }
    },
    [router],
  );

  return (
    <Box
      component="a"
      href="/links"
      onClick={handleClick}
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
