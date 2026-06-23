"use client";
import type { ReactNode } from "react";
import { Box, CircularProgress } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { GradientButton } from "@/shared/ui/base";
import type { UrlSafetyStatus } from "@/features/links/hooks/useUrlSafetyCheck";

export interface ShortenSubmitButtonProps {
  /**
   * True while the form submission is in flight (from `usePublicURLShortener`
   * or the optional external `loading` prop forwarded by the parent page).
   * Triggers shimmer animation and loading label.
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
 * Full-width submit button for the public URL shortener form.
 *
 * The safety gate is enforced here: the button is disabled whenever
 * `safetyStatus` is `"checking"` or `"unsafe"`, preventing form submission
 * while a Google Safe Browsing check is pending or has flagged the URL as
 * dangerous. This mirrors the inline disabled logic that was previously
 * inlined in `URLShortenerForm`.
 *
 * @param props - See {@link ShortenSubmitButtonProps}.
 */
export function ShortenSubmitButton({
  loading,
  safetyStatus,
}: ShortenSubmitButtonProps): ReactNode {
  const theme = useTheme();
  const { t } = useTranslation("public");

  const safetyBlocked =
    safetyStatus === "checking" || safetyStatus === "unsafe";
  const isDisabled = loading || safetyBlocked;

  return (
    <GradientButton
      type="submit"
      size="large"
      loading={loading}
      disabled={isDisabled}
      shimmerEffect
      sx={{
        width: "100%",
        minHeight: 54,
        fontWeight: 800,
        letterSpacing: "-0.01em",
        borderRadius: 2,
      }}
    >
      {loading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            justifyContent: "center",
          }}
        >
          <CircularProgress
            size={16}
            thickness={5}
            sx={{ color: alpha(theme.palette.common.white, 0.82) }}
          />
          {t("shorter.shortening")}
        </Box>
      ) : (
        t("shorter.form.submitButton")
      )}
    </GradientButton>
  );
}
