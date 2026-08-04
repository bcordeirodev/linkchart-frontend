"use client";
import type { ReactNode } from "react";
import { Button, CircularProgress } from "@mui/material";
import { Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ICON_SM } from "@/lib/theme/iconDefaults";
import { linksRadius } from "@/features/links/components/list/linksPanelStyles";
import { PUBLIC_CONTROL_HEIGHT } from "@/features/links/components/urlShortenerFormStyles";

import type { UrlSafetyStatus } from "@/features/links/hooks/useUrlSafetyCheck";

export interface ShortenSubmitButtonProps {
  /**
   * True while the form submission is in flight (from `usePublicURLShortener`
   * or the optional external `loading` prop forwarded by the parent page).
   * Swaps the zap glyph for a spinner and the label for the loading copy.
   */
  loading: boolean;
  /**
   * The current URL safety status. Submit is blocked (button disabled) while
   * `status === "checking"` or `status === "unsafe"`.
   *
   * This is the canonical safety gate: callers MUST pass the live status from
   * `useUrlSafetyCheck` — do not pre-filter or substitute a boolean.
   */
  safetyStatus: UrlSafetyStatus;
}

/**
 * Submit button for the public URL shortener form.
 *
 * The safety gate is enforced here: the button is disabled whenever
 * `safetyStatus` is `"checking"` or `"unsafe"`, preventing form submission
 * while a Google Safe Browsing check is pending or has flagged the URL as
 * dangerous.
 *
 * Visually it is the plain contained-primary button the rest of the product
 * uses, sized to the 52px destination row it sits beside — previously it was
 * a full-width `GradientButton` with a shimmer sweep and an emoji in its
 * label, the loudest "template" element on the acquisition page and the only
 * gradient CTA left in the app. The zap survives as a lucide glyph, so the
 * energy cue is drawn in the same icon set as everything else instead of
 * being a font-rendered emoji that changes shape per platform.
 *
 * Full-width on phones, where it sits under the URL field and a
 * shrink-to-fit button would read as an afterthought; from `sm` up it sizes to
 * its label and sits beside the field, matching the destination row's height.
 *
 * @param props - See {@link ShortenSubmitButtonProps}.
 */
export function ShortenSubmitButton({
  loading,
  safetyStatus,
}: ShortenSubmitButtonProps): ReactNode {
  const { t } = useTranslation("public");

  const safetyBlocked =
    safetyStatus === "checking" || safetyStatus === "unsafe";
  const isDisabled = loading || safetyBlocked;

  return (
    <Button
      type="submit"
      variant="contained"
      color="primary"
      disabled={isDisabled}
      startIcon={
        loading ? (
          <CircularProgress size={16} color="inherit" />
        ) : (
          <Zap {...ICON_SM} />
        )
      }
      sx={{
        height: PUBLIC_CONTROL_HEIGHT,
        minHeight: PUBLIC_CONTROL_HEIGHT,
        borderRadius: `${linksRadius.control}px`,
        textTransform: "none",
        fontWeight: 600,
        fontSize: "0.9375rem",
        px: 2.5,
        whiteSpace: "nowrap",
        flexShrink: 0,
        width: { xs: "100%", sm: "auto" },
      }}
    >
      {loading ? t("shorter.shortening") : t("shorter.form.submitButton")}
    </Button>
  );
}
