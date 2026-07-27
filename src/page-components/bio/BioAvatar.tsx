import { Box } from "@mui/material";

import type { BioPalette } from "./bioPalette";

/** Diameter of the avatar circle, in pixels. */
const AVATAR_SIZE = 88;

interface BioAvatarProps {
  /** First character of the page title, already uppercased. */
  initial: string;
  /** Resolved color set for the page's theme. */
  palette: BioPalette;
}

/**
 * Circular avatar showing the initial letter of the creator's display name.
 *
 * There's no photo upload in the bio contract yet, so the initial-letter
 * gradient circle acts as the page's signature visual — a soft glow (same
 * gradient, low opacity, blurred) sits behind it so the avatar reads as the
 * one deliberately "designed" element on an otherwise plain, content-first
 * page.
 */
export default function BioAvatar({ initial, palette }: BioAvatarProps) {
  return (
    <Box
      sx={{
        position: "relative",
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        mx: "auto",
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: -18,
          borderRadius: "50%",
          background: palette.avatarGlow,
          filter: "blur(22px)",
        }}
      />
      <Box
        sx={{
          position: "relative",
          width: AVATAR_SIZE,
          height: AVATAR_SIZE,
          borderRadius: "50%",
          background: palette.avatarGradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 24px -8px rgba(0, 0, 0, 0.45)",
        }}
      >
        <Box
          component="span"
          sx={{
            fontSize: "2.25rem",
            fontWeight: 800,
            lineHeight: 1,
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
          }}
        >
          {initial}
        </Box>
      </Box>
    </Box>
  );
}
