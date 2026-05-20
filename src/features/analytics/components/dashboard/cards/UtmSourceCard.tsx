"use client";
/**
 * UtmSourceCard — shows top UTM source values for a link.
 */
import { Tag } from "lucide-react";
import {
  Box,
  Card,
  CardContent,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import { createPresetAnimations } from "@/lib/theme";
import {
  elevationLightTokens,
  elevationTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";

interface UtmSourceEntry {
  source: string;
  clicks: number;
  percentage: number;
}

interface Props {
  data?: UtmSourceEntry[];
}

/**
 * Card showing top UTM source values for the link.
 * Renders nothing when data is empty (no UTM-tagged clicks).
 */
export function UtmSourceCard({ data }: Props) {
  const { t } = useTranslation("analytics");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const elevation = isDark ? elevationTokens : elevationLightTokens;
  const animations = createPresetAnimations(theme);

  if (!data || data.length === 0) return null;

  return (
    <Box sx={{ height: "100%", width: "100%", ...animations.cardHover }}>
      <Card
        sx={{
          height: "100%",
          borderRadius: `${radiusTokens.lg}px`,
          boxShadow: elevation.xs,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              mt: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: 500,
            }}
          >
            <Tag {...ICON_MD} />
            {t("dashboard.utmSource.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t("dashboard.utmSource.description")}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {data.map((entry) => (
              <Box key={entry.source}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2">{entry.source}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {entry.clicks} ({entry.percentage.toFixed(1)}%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={entry.percentage}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
            ))}
          </Box>
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ mt: 1.5, display: "block" }}
          >
            {t("dashboard.utmSource.topLabel")}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
