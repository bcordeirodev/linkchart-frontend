import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

interface AppLogoProps {
  size?: number;
  showText?: boolean;
  textSx?: SxProps<Theme>;
}

export function AppLogo({ size = 32, showText = true, textSx }: AppLogoProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.svg"
        alt="Link Charts"
        width={size}
        height={size}
        style={{ display: "block", flexShrink: 0 }}
      />
      {showText ? (
        <Typography
          component="span"
          sx={{
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1,
            ...textSx,
          }}
        >
          Link Charts
        </Typography>
      ) : null}
    </Box>
  );
}

export default AppLogo;
