"use client";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import {
  elevationLightTokens,
  elevationTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";
import { formatPieChart } from "@/features/analytics/utils/chartFormatters";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";

/** Entry in the language breakdown array returned by the audience API. */
interface LanguageEntry {
  language: string;
  region: string | null;
  clicks: number;
  percentage: number;
}

/** Entry in the platform breakdown array returned by the audience API. */
interface PlatformEntry {
  platform: string;
  clicks: number;
  percentage: number;
}

/** Entry in the connection type breakdown array returned by the audience API. */
interface ConnectionEntry {
  type: string;
  clicks: number;
  percentage: number;
}

interface AudienceExtraChartsProps {
  /** Language distribution data from `audience.language_breakdown`. */
  languageBreakdown: LanguageEntry[];
  /** Platform distribution data from `audience.platform_breakdown`. */
  platformBreakdown: PlatformEntry[];
  /** Connection type distribution data from `audience.connection_type_breakdown`. */
  connectionBreakdown: ConnectionEntry[];
}

/** Human-readable labels for known connection type keys. */
const CONNECTION_LABELS: Record<string, string> = {
  residential: "Residencial",
  mobile: "Móvel",
  cellular: "Celular",
  datacenter: "Datacenter",
  broadband: "Banda larga",
  wifi: "Wi-Fi",
  education: "Educação",
  unknown: "Desconhecido",
};

/**
 * Renders the supplementary donut charts for the Audience tab:
 * Idioma, Plataforma and Tipo de Conexão.
 *
 * Only mounts when at least one of the three datasets is non-empty.
 * Extracted from `AudienceMetrics` so it can be positioned independently
 * within `AudienceAnalysis`.
 */
export function AudienceExtraCharts({
  languageBreakdown,
  platformBreakdown,
  connectionBreakdown,
}: AudienceExtraChartsProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const hasData =
    languageBreakdown.length > 0 ||
    platformBreakdown.length > 0 ||
    connectionBreakdown.length > 0;

  if (!hasData) return null;

  const cardSx = {
    borderRadius: `${radiusTokens.lg}px`,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: isDark ? elevationTokens.xs : elevationLightTokens.xs,
    height: "100%",
  };

  const top7Lang = languageBreakdown.slice(0, 7);
  const restLang = languageBreakdown.slice(7);
  const othersLangClicks = restLang.reduce((s, l) => s + l.clicks, 0);
  const langChartData = [
    ...top7Lang.map((l) => ({ name: l.region ?? l.language, value: l.clicks })),
    ...(othersLangClicks > 0
      ? [{ name: "Outros", value: othersLangClicks }]
      : []),
  ];

  const platformChartData = platformBreakdown.map((p) => ({
    name: p.platform,
    value: p.clicks,
  }));

  const connChartData = connectionBreakdown.map((c) => ({
    name: CONNECTION_LABELS[c.type] ?? c.type,
    value: c.clicks,
  }));

  return (
    <Box sx={{ mt: 3 }}>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        {languageBreakdown.length > 0 ? (
          <Grid item xs={12} md={4}>
            <Card sx={cardSx}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Idioma
                </Typography>
                <ApexChartWrapper
                  type="donut"
                  size="compact"
                  {...formatPieChart(langChartData, "name", "value", isDark)}
                />
              </CardContent>
            </Card>
          </Grid>
        ) : null}

        {platformBreakdown.length > 0 ? (
          <Grid item xs={12} md={4}>
            <Card sx={cardSx}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Plataforma
                </Typography>
                <ApexChartWrapper
                  type="donut"
                  size="compact"
                  {...formatPieChart(
                    platformChartData,
                    "name",
                    "value",
                    isDark,
                  )}
                />
              </CardContent>
            </Card>
          </Grid>
        ) : null}

        {connectionBreakdown.length > 0 ? (
          <Grid item xs={12} md={4}>
            <Card sx={cardSx}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Tipo de Conexão
                </Typography>
                <ApexChartWrapper
                  type="donut"
                  size="compact"
                  {...formatPieChart(connChartData, "name", "value", isDark)}
                />
              </CardContent>
            </Card>
          </Grid>
        ) : null}
      </Grid>
    </Box>
  );
}

export default AudienceExtraCharts;
