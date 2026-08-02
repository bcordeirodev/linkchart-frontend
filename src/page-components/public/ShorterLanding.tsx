"use client";
import { useCallback } from "react";
import { Alert, Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTheme } from "@mui/material";

import { AdSlot } from "@/shared/components/ads/AdSlot";
import { URLShortenerForm } from "@/features/links/components/URLShortenerForm";
import { useShortenerPrefill } from "@/features/shorter/hooks/useShortenerPrefill";
import {
  ShorterHero,
  ShorterStats,
  ShorterHowItWorks,
  ShorterSubdomainPromo,
  ShorterFaq,
  ShorterSuccessCard,
  ShorterRecentLinks,
} from "@/features/shorter/components";
import { SHORTER_CONTENT_MAX_WIDTH } from "@/shared/constants";
import {
  getPublicInsetSx,
  PUBLIC_SECTION_GAP,
} from "@/lib/theme/publicPageStyles";
import type { PublicLinkResponse } from "@/services/link-public.service";

import { BenefitBadges } from "./BenefitBadges";
import { PublicResourcesLinks } from "./PublicResourcesLinks";

/** Props passed from ShorterPage to the landing variant. */
export interface ShorterLandingProps {
  /** Whether the shortener is in the post-submit redirecting/success state. */
  isRedirecting: boolean;
  /**
   * The link a guest just created, or null. When present, the inline success
   * card replaces the form so the flow stays on the landing.
   */
  createdLink: PublicLinkResponse | null;
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
 * badges, social-proof strip, how-it-works, subdomain promo, FAQ, and ad slots.
 *
 * Narrative order (above-the-fold first):
 * 1. Hero + Form (focal conversion surface)
 * 2. Ad slot (below form)
 * 3. BenefitBadges (idle: signup CTA; success: achievement chips + reset)
 * 4. ShorterStats — social-proof strip
 * 5. ShorterHowItWorks
 * 6. ShorterSubdomainPromo
 * 7. Ad slot (mid-page)
 * 8. ShorterFaq
 *
 * Rendered only when no `?slug=` query parameter is present. All stateful
 * behaviour is delegated to the parent `ShorterPage` container via props.
 *
 * Also the funnel landing spot for `/?url=<long-url>` deep links (UTM
 * generator CTA): `useShortenerPrefill` validates the param and pre-fills the
 * form's URL field — pre-fill only, never auto-submit. The hook calls
 * `useSearchParams`, which is safe here because this component only renders
 * under the `<Suspense>` boundary in `ShorterPage`.
 */
export function ShorterLanding({
  isRedirecting,
  createdLink,
  error,
  formKey,
  onSuccess,
  onError,
  onClearError,
  onReset,
}: ShorterLandingProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { prefillUrl, clearPrefill, formAnchorRef } = useShortenerPrefill();

  /**
   * Resets the shortener and forgets the `?url=` prefill, so the remounted
   * form (via `formKey`) starts blank instead of re-applying the deep link.
   */
  const handleReset = useCallback(() => {
    clearPrefill();
    onReset();
  }, [clearPrefill, onReset]);

  return (
    <>
      {/* 1. Hero + Form — focal, above the fold */}
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
            borderColor: alpha(theme.palette.error.main, isDark ? 0.42 : 0.35),
            bgcolor: alpha(theme.palette.error.main, isDark ? 0.14 : 0.08),
            color: theme.palette.text.primary,
            "& .MuiAlert-icon": {
              color: theme.palette.error.main,
            },
          }}
        >
          {error}
        </Alert>
      ) : null}

      {/* Anchor for the `?url=` prefill: scrolled into view (only when needed)
          by `useShortenerPrefill` so the pre-filled field is always visible. */}
      <Box ref={formAnchorRef}>
        {createdLink ? (
          <ShorterSuccessCard
            shortUrl={createdLink.short_url}
            destinationUrl={createdLink.original_url}
            slug={createdLink.slug}
            onReset={handleReset}
          />
        ) : (
          <URLShortenerForm
            key={formKey}
            onSuccess={onSuccess}
            onError={onError}
            loading={isRedirecting}
            initialUrl={prefillUrl ?? undefined}
          />
        )}
      </Box>

      {/* Ad slot — immediately below the form */}
      <Box
        sx={{
          maxWidth: SHORTER_CONTENT_MAX_WIDTH,
          mx: "auto",
          mt: { xs: 2.25, md: 2.75 },
        }}
      >
        <AdSlot
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SHORTER_BELOW_FORM ?? ""}
          format="rectangle"
        />
      </Box>

      {/* Account CTA — present in every state (idle and post-success) */}
      <Box sx={{ mt: { xs: 2.25, md: 2.75 } }}>
        <BenefitBadges />
      </Box>

      {/* Links recentes do visitante (guest-only; some quando não há histórico) */}
      <Box sx={{ mt: { xs: 2.25, md: 2.75 } }}>
        <ShorterRecentLinks refreshToken={createdLink?.slug ?? null} />
      </Box>

      {/* 2. Social-proof strip */}
      <Box
        sx={{
          mt: PUBLIC_SECTION_GAP,
          maxWidth: SHORTER_CONTENT_MAX_WIDTH,
          mx: "auto",
        }}
      >
        <ShorterStats />
      </Box>

      {/* 3. How It Works */}
      {!isRedirecting ? (
        <Box sx={{ mt: PUBLIC_SECTION_GAP }}>
          <ShorterHowItWorks />
        </Box>
      ) : null}

      {/* 4. Subdomain Promo */}
      {!isRedirecting ? (
        <Box sx={{ mt: PUBLIC_SECTION_GAP }}>
          <ShorterSubdomainPromo />
        </Box>
      ) : null}

      {/* Ad slot — mid-page, after promo */}
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

      {/* 5. FAQ */}
      {!isRedirecting ? (
        <Box sx={{ mt: PUBLIC_SECTION_GAP }}>
          <ShorterFaq />
        </Box>
      ) : null}

      {/* 6. Guias e comparações — surfaces content pages + internal links */}
      {!isRedirecting ? (
        <Box sx={{ mt: PUBLIC_SECTION_GAP }}>
          <PublicResourcesLinks />
        </Box>
      ) : null}
    </>
  );
}
