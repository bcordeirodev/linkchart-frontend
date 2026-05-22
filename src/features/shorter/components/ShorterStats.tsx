"use client";
import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { getPublicSectionHeadingSx } from "@/lib/theme/publicPageStyles";

export function ShorterStats() {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(containerRef, { once: true, margin: "-80px" });

  const stats = [
    { value: "1.000+", label: t("shorter.stats.linksCreated") },
    { value: "10.000+", label: t("shorter.stats.clicksTracked") },
    { value: "<100ms", label: t("shorter.stats.responseTime") },
    { value: "99.8%", label: t("shorter.stats.uptime") },
  ];

  const dividerColor = alpha(theme.palette.divider, 0.6);

  return (
    <Box ref={containerRef}>
      <Typography component="h2" sx={getPublicSectionHeadingSx(theme)}>
        {t("shorter.stats.sectionTitle")}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
          alignItems: "stretch",
          rowGap: { xs: 3, md: 0 },
          columnGap: 0,
        }}
      >
        {stats.map((stat, index) => {
          const isLastInRow = (index + 1) % 2 === 0;
          return (
            <Box
              key={stat.value}
              component={motion.div}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.06 * index,
              }}
              sx={{
                position: "relative",
                textAlign: "center",
                px: { xs: 1, md: 2 },
                py: 0.5,
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: "15%",
                  bottom: "15%",
                  right: 0,
                  width: "1px",
                  background: dividerColor,
                  display: {
                    xs: !isLastInRow ? "block" : "none",
                    md: index < stats.length - 1 ? "block" : "none",
                  },
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "1.5rem", md: "1.875rem" },
                  fontWeight: 800,
                  color: theme.palette.text.primary,
                  lineHeight: 1.1,
                  letterSpacing: "-0.025em",
                  fontFeatureSettings: '"tnum" 1, "lnum" 1',
                }}
              >
                {stat.value}
              </Typography>
              <Typography
                sx={{
                  mt: 0.75,
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: alpha(
                    theme.palette.text.primary,
                    theme.palette.mode === "dark" ? 0.55 : 0.6,
                  ),
                }}
              >
                {stat.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default ShorterStats;
