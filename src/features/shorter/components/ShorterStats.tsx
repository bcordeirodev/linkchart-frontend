"use client";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

export function ShorterStats() {
  const theme = useTheme();
  const { t } = useTranslation("public");

  const stats = [
    { value: "1.000+", label: t("shorter.stats.linksCreated") },
    { value: "10.000+", label: t("shorter.stats.clicksTracked") },
    { value: "<100ms", label: t("shorter.stats.responseTime") },
    { value: "99.8%", label: t("shorter.stats.uptime") },
  ];

  return (
    <Box>
      <Typography
        sx={{
          textAlign: "center",
          mb: 4,
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: theme.palette.text.secondary,
        }}
      >
        {t("shorter.stats.sectionTitle")}
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {stats.map((stat) => (
          <Grid item xs={6} md={3} key={stat.value}>
            <Box
              sx={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                p: "20px 16px",
                textAlign: "center",
                transition: "border-color 0.2s",
                "&:hover": { borderColor: "rgba(99,102,241,0.3)" },
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "1.625rem", md: "2rem" },
                  fontWeight: 800,
                  color: "rgba(255,255,255,0.85)",
                  lineHeight: 1,
                  mb: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {stat.value}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.6875rem",
                  color: "rgba(255,255,255,0.6)",
                  fontWeight: 500,
                  letterSpacing: "0.3px",
                }}
              >
                {stat.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ShorterStats;
