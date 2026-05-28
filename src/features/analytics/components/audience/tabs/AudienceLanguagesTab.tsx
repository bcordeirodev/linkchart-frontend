"use client";
import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { Globe } from "lucide-react";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import { useTranslation } from "react-i18next";

import { formatPieChart } from "@/features/analytics/utils/chartFormatters";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import type { LanguageData } from "@/types";

/** Processed chart data item for languages. */
interface LanguageChartItem {
  name: string;
  value: number;
  percentage: number;
  [key: string]: unknown;
}

/** Props for the Languages tab content. */
export interface AudienceLanguagesTabProps {
  /** Chart-ready language data (name/value/percentage). */
  languageChartData: LanguageChartItem[];
  /** Raw language entries for the ranked list. */
  languages: LanguageData[];
  /** Whether the theme is in dark mode. */
  isDark: boolean;
  /** Outlined card sx (no shadow). */
  outlinedCardSx: Record<string, unknown>;
  /** Row item sx for list rows. */
  itemRowSx: Record<string, unknown>;
}

/**
 * Renders the Languages tab content for the AudienceChart.
 *
 * Shows a pie chart of language distribution and a ranked list of the
 * top five languages. All data flows from props — no hooks inside.
 */
export function AudienceLanguagesTab({
  languageChartData,
  languages,
  isDark,
  outlinedCardSx,
  itemRowSx,
}: AudienceLanguagesTabProps) {
  const { t } = useTranslation("analytics");

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card elevation={0} sx={outlinedCardSx}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Globe {...ICON_MD} /> {t("audience.chart.languageDistribution")}
            </Typography>
            <ApexChartWrapper
              type="donut"
              {...formatPieChart(languageChartData, "name", "value", isDark)}
              size="standard"
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card elevation={0} sx={{ ...outlinedCardSx, height: "100%" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t("audience.chart.topLanguages")}
            </Typography>
            <Stack spacing={2}>
              {languages.slice(0, 5).map((language) => (
                <Box
                  key={language.language}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1,
                    ...itemRowSx,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2">
                      {language.language}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {language.clicks}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {language.percentage.toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
