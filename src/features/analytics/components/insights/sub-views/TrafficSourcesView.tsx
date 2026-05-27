"use client";
import { Trophy } from "lucide-react";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import {
  elevationLightTokens,
  elevationTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";

interface TrafficSource {
  source: string;
  clicks: number;
  percentage: number;
  avg_response_time: number;
  avg_session_depth: number;
}

interface TrafficSourcesViewProps {
  /** Ranked list of individual traffic sources. */
  sources: TrafficSource[];
}

/**
 * Renders the Sources sub-view of TrafficSourceChart.
 *
 * Shows a ranked list of the top 5 individual traffic sources with their
 * click counts, share percentages, and average session depth.
 */
export function TrafficSourcesView({ sources }: TrafficSourcesViewProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");

  return (
    <Box sx={{ mb: 3 }}>
      <Card
        sx={{
          borderRadius: `${radiusTokens.lg}px`,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow:
            theme.palette.mode === "dark"
              ? elevationTokens.xs
              : elevationLightTokens.xs,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Trophy size={16} strokeWidth={1.5} />
            {t("insights.traffic.topSources")}
          </Typography>
          <Grid container spacing={1}>
            {sources.slice(0, 5).map((source, index) => (
              <Grid item xs={12} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1.5,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: `${radiusTokens.md}px`,
                    backgroundColor: "background.paper",
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: index === 0 ? 600 : 400 }}
                    >
                      {index + 1}. {source.source}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t("insights.traffic.session", {
                        n: Number(source.avg_session_depth).toFixed(2),
                      })}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {source.clicks} clicks
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {Number(source.percentage).toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
