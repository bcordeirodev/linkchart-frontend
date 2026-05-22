"use client";
import { Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

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
      sx={{ textAlign: "center", mb: { xs: 4, md: 5 }, mt: { xs: 1, md: 2 } }}
    >
      <motion.div {...fadeUp(0.1)}>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: "2rem", md: "2.75rem" },
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            color: theme.palette.text.primary,
            mb: 0.5,
            mt: 1,
          }}
        >
          {isSuccess ? (
            <>
              {t("shorter.readyToSharePrefix")}{" "}
              <Box
                component="span"
                sx={{
                  background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main}, ${theme.palette.success.main})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t("shorter.readyToShareSuffix")}
              </Box>
            </>
          ) : (
            t("shorter.heroTitle")
          )}
        </Typography>
      </motion.div>

      <motion.div {...fadeUp(0.18)}>
        <Typography
          sx={{
            fontSize: "0.9375rem",
            color: theme.palette.text.secondary,
            lineHeight: 1.65,
            maxWidth: 560,
            mx: "auto",
          }}
        >
          {isSuccess ? t("shorter.autoRedirect") : t("shorter.heroSubtitle")}
        </Typography>
      </motion.div>
    </Box>
  );
}
