"use client";
import { Alert, Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTheme } from "@mui/material";

import { AdSlot } from "@/shared/components/ads/AdSlot";
import { URLShortenerForm } from "@/features/links/components/URLShortenerForm";
import {
  ShorterHero,
  ShorterStats,
  ShorterHowItWorks,
  ShorterSubdomainPromo,
  ShorterFaq,
} from "@/features/shorter/components";
import {
  SHORTER_CONTENT_MAX_WIDTH,
} from "@/features/shorter/constants";
import { getPublicInsetSx } from "@/lib/theme/publicPageStyles";
import type { PublicLinkResponse } from "@/services/link-public.service";

import { BenefitBadges } from "./BenefitBadges";

/** Props passed from ShorterPage to the landing variant. */
export interface ShorterLandingProps {
  /** Whether the shortener is in the post-submit redirecting/success state. */
  isRedirecting: boolean;
  /** Current error message to display, or null when there is no error. */
  error: string | null;
  /**
   * Monotonically-increasing key that forces `URLShortenerForm` to fully
   * remount on reset, clearing all field values and in-flight hooks.
   */
  formKey: number;
  /** Called by `URLShortenerForm` when a link is created successfully. */
  onSuccess: (res: PublicLinkResponse) => void;
  /** Called by `URLShortenerForm` when a submission error occurs. */
  onError: (message: string) => void;
  /** Dismisses the current error alert. */
  onClearError: () => void;
  /** Resets the form and clears all transient state. */
  onReset: () => void;
}

/**
 * Landing view for the `/shorter` page — renders the hero, form, benefit
 * badges, stats, how-it-works, subdomain promo, FAQ, and ad slots.
 *
 * Rendered only when no `?slug=` query parameter is present. All stateful
 * behaviour is delegated to the parent `ShorterPage` container via props.
 */
export function ShorterLanding({
  isRedirecting,
  error,
  formKey,
  onSuccess,
  onError,
  onClearError,
  onReset,
}: ShorterLandingProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <>
      <ShorterHero state={isRedirecting ? "success" : "idle"} />

      {error ? (
        <Alert
          severity="error"
          onClose={onClearError}
          sx={{
            mb: 2,
            ...getPublicInsetSx(theme),
            maxWidth: SHORTER_CONTENT_MAX_WIDTH,
            mx: "auto",
            borderColor: alpha(
              theme.palette.error.main,
              isDark ? 0.42 : 0.35,
            ),
            bgcolor: alpha(
              theme.palette.error.main,
              isDark ? 0.14 : 0.08,
            ),
            color: theme.palette.text.primary,
            "& .MuiAlert-icon": {
              color: theme.palette.error.main,
            },
          }}
        >
          {error}
        </Alert>
      ) : null}

      <URLShortenerForm
        key={formKey}
        onSuccess={onSuccess}
        onError={onError}
        loading={isRedirecting}
      />

      <Box
        sx={{
          maxWidth: SHORTER_CONTENT_MAX_WIDTH,
          mx: "auto",
        }}
      >
        <AdSlot
          slot={
            process.env.NEXT_PUBLIC_ADSENSE_SLOT_SHORTER_BELOW_FORM ?? ""
          }
          format="rectangle"
        />
      </Box>

      <BenefitBadges
        state={isRedirecting ? "success" : "idle"}
        onReset={onReset}
      />

      {!isRedirecting ? <ShorterSubdomainPromo /> : null}

      <Box
        sx={{
          mt: { xs: 6, md: 7 },
          maxWidth: SHORTER_CONTENT_MAX_WIDTH,
          mx: "auto",
        }}
      >
        <ShorterStats />
      </Box>

      <Box
        sx={{
          maxWidth: SHORTER_CONTENT_MAX_WIDTH,
          mx: "auto",
        }}
      >
        <AdSlot
          slot={
            process.env.NEXT_PUBLIC_ADSENSE_SLOT_SHORTER_BETWEEN_SECTIONS ?? ""
          }
          format="auto"
        />
      </Box>

      {!isRedirecting ? <ShorterHowItWorks /> : null}

      {!isRedirecting ? <ShorterFaq /> : null}
    </>
  );
}
