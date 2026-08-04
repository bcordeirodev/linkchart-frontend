"use client";
import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { m } from "framer-motion";
import { Trans, useTranslation } from "react-i18next";

import { getPublicDisplaySx } from "@/lib/theme/publicPageStyles";

interface ShorterHeroProps {
  state: "idle" | "success";
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
});

export function ShorterHero({ state }: ShorterHeroProps) {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const isSuccess = state === "success";

  return (
    <Box
      sx={{
        textAlign: "center",
        mb: { xs: 3.5, md: 4.5 },
        mt: { xs: 1, md: 2 },
      }}
    >
      <m.div {...fadeUp(0.1)}>
        {/* `variant="h1"` is load-bearing, not decoration: `component` alone
            only swaps the DOM tag, leaving MUI's default `body1` typography
            (Inter) on the page's most important heading. The variant selects
            the theme's display face; `getPublicDisplaySx` then re-states it
            for safety and layers the responsive clamp on top. */}
        <Typography
          variant="h1"
          component="h1"
          sx={{
            ...getPublicDisplaySx(theme),
            mb: 0.5,
            mt: 1,
          }}
        >
          {isSuccess ? (
            <>
              {t("shorter.readyToSharePrefix")}{" "}
              {/* Solid accent, not a blue→green text gradient: the display
                  face carries the emphasis, and a clipped three-stop gradient
                  was the loudest remaining "template" tell on the page. */}
              <Box component="span" sx={{ color: theme.palette.primary.main }}>
                {t("shorter.readyToShareSuffix")}
              </Box>
            </>
          ) : (
            t("shorter.heroTitle")
          )}
        </Typography>
      </m.div>

      <m.div {...fadeUp(0.18)}>
        <Typography
          sx={{
            fontSize: "0.9375rem",
            color: theme.palette.text.secondary,
            lineHeight: 1.65,
            maxWidth: 560,
            mx: "auto",
            "& strong": {
              fontWeight: 700,
              color: alpha(
                theme.palette.text.primary,
                theme.palette.mode === "dark" ? 0.92 : 0.85,
              ),
            },
          }}
        >
          {isSuccess ? (
            t("shorter.successSubtitle")
          ) : (
            <Trans
              i18nKey="shorter.heroSubtitle"
              ns="public"
              components={{ b: <strong /> }}
            />
          )}
        </Typography>
      </m.div>
    </Box>
  );
}
