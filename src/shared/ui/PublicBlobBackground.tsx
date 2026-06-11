"use client";

import { Box, GlobalStyles } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import { usePrefersReducedMotion } from "@/lib/theme/usePrefersReducedMotion";

/**
 * Fixed-position decorative blob background shared by public pages
 * (/shorter and /public-analytics/[slug]).
 *
 * Renders three radial-gradient circles that animate with a gentle floating
 * motion. Animation is disabled when the user has requested reduced motion.
 * Opacity is capped at ~0.12 to remain subtle and never compete with content.
 */
export function PublicBlobBackground() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const reduced = usePrefersReducedMotion();

  return (
    <>
      <GlobalStyles
        styles={{
          "@keyframes floatA": {
            "0%, 100%": { transform: "translate(0,0) scale(1)" },
            "33%": { transform: "translate(30px,-20px) scale(1.06)" },
            "66%": { transform: "translate(-20px,15px) scale(0.96)" },
          },
          "@keyframes floatB": {
            "0%, 100%": { transform: "translate(0,0) scale(1)" },
            "40%": { transform: "translate(-25px,20px) scale(1.04)" },
            "70%": { transform: "translate(18px,-15px) scale(0.97)" },
          },
          "@keyframes floatC": {
            "0%, 100%": { transform: "translate(0,0) scale(1)" },
            "50%": { transform: "translate(20px,-25px) scale(1.05)" },
          },
        }}
      />

      {/* Ambient radial gradient — covers the full viewport */}
      <Box
        aria-hidden="true"
        sx={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: `radial-gradient(circle at 20% 18%, ${alpha(theme.palette.primary.main, isDark ? 0.12 : 0.08)} 0%, transparent 55%),
                       radial-gradient(circle at 78% 86%, ${alpha(theme.palette.secondary.main, isDark ? 0.1 : 0.07)} 0%, transparent 52%)`,
        }}
      />

      {/* Blob A — top-right, primary colour */}
      <Box
        aria-hidden="true"
        sx={{
          position: "fixed",
          top: "-10%",
          right: "-5%",
          width: 520,
          height: 520,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, isDark ? 0.12 : 0.09)} 0%, transparent 60%)`,
          animation: reduced ? "none" : "floatA 12s ease-in-out infinite",
        }}
      />

      {/* Blob B — bottom-left, secondary colour */}
      <Box
        aria-hidden="true"
        sx={{
          position: "fixed",
          bottom: "-15%",
          left: "-8%",
          width: 440,
          height: 440,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, isDark ? 0.1 : 0.08)} 0%, transparent 60%)`,
          animation: reduced ? "none" : "floatB 16s ease-in-out infinite",
        }}
      />

      {/* Blob C — mid-right, success accent */}
      <Box
        aria-hidden="true"
        sx={{
          position: "fixed",
          top: "45%",
          right: "-4%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
          background: `radial-gradient(circle, ${alpha(theme.palette.success.main, isDark ? 0.09 : 0.07)} 0%, transparent 60%)`,
          animation: reduced ? "none" : "floatC 20s ease-in-out infinite",
        }}
      />
    </>
  );
}
