"use client";
import { Box } from "@mui/material";

import { PublicCtaBlock } from "@/features/public-analytics/components/info/PublicCtaBlock";
import { SHORTER_CONTENT_MAX_WIDTH } from "@/shared/constants";

/**
 * Below-form block for the `/shorter` landing.
 *
 * Renders the "create your free account" CTA (`PublicCtaBlock` landing
 * variant) so the signup invitation is present in every state — including
 * after a guest creates a link. The post-success reinforcement chips were
 * removed: the success card already confirms the link is created and working,
 * so the chips only added clutter between the card and the CTA.
 */
export function BenefitBadges() {
  return (
    <Box sx={{ mt: 2.5, maxWidth: SHORTER_CONTENT_MAX_WIDTH, mx: "auto" }}>
      <PublicCtaBlock variant="landing" />
    </Box>
  );
}
