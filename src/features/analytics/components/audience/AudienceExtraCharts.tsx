"use client";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Info, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import {
  elevationLightTokens,
  elevationTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";
import { formatPieChart } from "@/features/analytics/utils/chartFormatters";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import type {
  LanguageBreakdown,
  PlatformBreakdown,
  ConnectionTypeBreakdown,
  FetchDestBreakdown,
} from "@/types/analytics/audience";

import { FetchDestChart } from "./FetchDestChart";
import { getPhaseDataChipSx } from "./phaseDataChipSx";

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
  /**
   * Language distribution data from `audience.language_breakdown`.
   * Accepts both the new phase-aware shape and the legacy flat array.
   */
  languageBreakdown: LanguageBreakdown | LanguageEntry[];
  /**
   * Platform distribution data from `audience.platform_breakdown`.
   * Accepts both the new phase-aware shape and the legacy flat array.
   */
  platformBreakdown: PlatformBreakdown | PlatformEntry[];
  /**
   * Connection type distribution data from `audience.connection_type_breakdown`.
   * Accepts both the new phase-aware shape and the legacy flat array.
   */
  connectionBreakdown: ConnectionTypeBreakdown | ConnectionEntry[];
  /**
   * Fetch-dest (Sec-Fetch-Dest) breakdown from `audience.fetch_dest_breakdown`.
   * Optional — not rendered when absent.
   */
  fetchDestBreakdown?: FetchDestBreakdown;
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
 * Normalises a backend breakdown field that may be either a phase-aware object
 * (`{ data, phase_available }`) or a legacy flat array.
 *
 * Returns `{ data, phaseAvailable }` in both cases, where `phaseAvailable`
 * defaults to `true` for legacy arrays (no disclaimer shown when old shape).
 */
function normaliseBreakdown<T>(
  raw: { data: T[]; phase_available: boolean } | T[],
): { data: T[]; phaseAvailable: boolean } {
  if (Array.isArray(raw)) {
    return { data: raw, phaseAvailable: true };
  }
  return { data: raw.data, phaseAvailable: raw.phase_available };
}

/**
 * Renders the supplementary donut charts for the Audience tab:
 * Language, Platform (with Client Hint Mobile signal) and Connection Type.
 * Also renders the Fetch-Dest (request type) breakdown when data is provided.
 *
 * Phase disclaimers are shown inline when the backend signals that Phase 1/2
 * data is not yet meaningfully available for this link.
 *
 * Only mounts when at least one dataset is non-empty.
 * Extracted from `AudienceMetrics` so it can be positioned independently
 * within `AudienceAnalysis`.
 */
export function AudienceExtraCharts({
  languageBreakdown,
  platformBreakdown,
  connectionBreakdown,
  fetchDestBreakdown,
}: AudienceExtraChartsProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";
  const [showFetchDest, setShowFetchDest] = useState(false);

  // Normalise to unified shape
  const lang = normaliseBreakdown<LanguageEntry>(
    languageBreakdown as LanguageBreakdown | LanguageEntry[],
  );
  const platform = normaliseBreakdown<PlatformEntry>(
    platformBreakdown as PlatformBreakdown | PlatformEntry[],
  );
  const conn = normaliseBreakdown<ConnectionEntry>(
    connectionBreakdown as ConnectionTypeBreakdown | ConnectionEntry[],
  );

  // Extract ch_mobile_breakdown when present (new phase-aware shape only)
  const chMobile =
    !Array.isArray(platformBreakdown) &&
    "ch_mobile_breakdown" in platformBreakdown
      ? (platformBreakdown as PlatformBreakdown).ch_mobile_breakdown
      : null;

  const hasData =
    lang.data.length > 0 ||
    platform.data.length > 0 ||
    conn.data.length > 0 ||
    (fetchDestBreakdown?.data && fetchDestBreakdown.data.length > 0);

  if (!hasData) return null;

  const cardSx = {
    borderRadius: `${radiusTokens.lg}px`,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: isDark ? elevationTokens.xs : elevationLightTokens.xs,
    height: "100%",
  };

  const phaseDisclaimerSx = { mb: 1.5, borderRadius: `${radiusTokens.md}px` };

  const top7Lang = lang.data.slice(0, 7);
  const restLang = lang.data.slice(7);
  const othersLangClicks = restLang.reduce((s, l) => s + l.clicks, 0);
  const langChartData = [
    ...top7Lang.map((l) => ({ name: l.region ?? l.language, value: l.clicks })),
    ...(othersLangClicks > 0
      ? [{ name: t("audience.extraCharts.others"), value: othersLangClicks }]
      : []),
  ];

  const platformChartData = platform.data.map((p) => ({
    name: p.platform,
    value: p.clicks,
  }));

  const connChartData = conn.data.map((c) => ({
    name: CONNECTION_LABELS[c.type] ?? c.type,
    value: c.clicks,
  }));

  return (
    <Box sx={{ mt: 3 }}>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        {/* Language donut */}
        {lang.data.length > 0 ? (
          <Grid item xs={12} md={4}>
            <Card sx={cardSx}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  {t("audience.extraCharts.language")}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1.5 }}
                >
                  {t("audience.extraCharts.languageDescription")}
                </Typography>
                {!lang.phaseAvailable && (
                  <Alert
                    severity="info"
                    icon={<Info {...ICON_MD} />}
                    sx={phaseDisclaimerSx}
                  >
                    {t("audience.phaseData.unavailable")}
                  </Alert>
                )}
                <ApexChartWrapper
                  type="donut"
                  size="compact"
                  {...formatPieChart(langChartData, "name", "value", isDark)}
                />
              </CardContent>
            </Card>
          </Grid>
        ) : null}

        {/* Platform donut + ch_is_mobile companion */}
        {platform.data.length > 0 ? (
          <Grid item xs={12} md={4}>
            <Card sx={cardSx}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  {t("audience.extraCharts.platform")}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1.5 }}
                >
                  {t("audience.extraCharts.platformDescription")}
                </Typography>
                {!platform.phaseAvailable && (
                  <Alert
                    severity="info"
                    icon={<Info {...ICON_MD} />}
                    sx={phaseDisclaimerSx}
                  >
                    {t("audience.phaseData.unavailable")}
                  </Alert>
                )}
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

                {/* ch_is_mobile companion signal */}
                {chMobile && chMobile.phase1_available && (
                  <Box
                    sx={{
                      mt: 2,
                      pt: 2,
                      borderTop: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 600, display: "block", mb: 1 }}
                    >
                      {t("audience.chMobile.title")}
                    </Typography>
                    <Stack spacing={0.5}>
                      {[
                        {
                          key: "mobile",
                          count: chMobile.mobile,
                          total: chMobile.mobile + chMobile.not_mobile,
                          color: "#3b82f6",
                        },
                        {
                          key: "not_mobile",
                          count: chMobile.not_mobile,
                          total: chMobile.mobile + chMobile.not_mobile,
                          color: "#22c55e",
                        },
                      ].map(({ key, count, total, color }) => {
                        const pct =
                          total > 0 ? Math.round((count / total) * 100) : 0;
                        return (
                          <Box key={key}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 0.25,
                              }}
                            >
                              <Typography variant="caption">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {(t as any)(`audience.chMobile.${key}`)}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {pct}%
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                height: 4,
                                borderRadius: 2,
                                bgcolor: "action.hover",
                                overflow: "hidden",
                              }}
                            >
                              <Box
                                sx={{
                                  width: `${pct}%`,
                                  height: "100%",
                                  bgcolor: color,
                                  borderRadius: 2,
                                  transition: "width 0.4s ease",
                                }}
                              />
                            </Box>
                          </Box>
                        );
                      })}
                    </Stack>
                  </Box>
                )}

                {/* phase1 not available for ch_mobile */}
                {chMobile && !chMobile.phase1_available && (
                  <Box sx={{ mt: 1.5 }}>
                    <Chip
                      label={t("audience.phaseData.unavailable")}
                      size="small"
                      variant="filled"
                      sx={getPhaseDataChipSx(theme)}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ) : null}

        {/* Connection type donut */}
        {conn.data.length > 0 ? (
          <Grid item xs={12} md={4}>
            <Card sx={cardSx}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  {t("audience.extraCharts.connectionType")}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1.5 }}
                >
                  {t("audience.extraCharts.connectionTypeDescription")}
                </Typography>
                {!conn.phaseAvailable && (
                  <Alert
                    severity="info"
                    icon={<Info {...ICON_MD} />}
                    sx={phaseDisclaimerSx}
                  >
                    {t("audience.phaseData.unavailable")}
                  </Alert>
                )}
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

      {/* Fetch-dest breakdown — Technical section */}
      {fetchDestBreakdown && (
        <Box sx={{ mt: 2 }}>
          <Divider sx={{ mb: 2 }} />
          <Button
            size="small"
            variant="text"
            endIcon={
              showFetchDest ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )
            }
            onClick={() => setShowFetchDest((v) => !v)}
            sx={{ px: 0, minWidth: 0, mb: 1 }}
          >
            {showFetchDest
              ? t("audience.extraCharts.hideTechnical")
              : t("audience.extraCharts.showTechnical")}
          </Button>
          <Collapse in={showFetchDest}>
            <FetchDestChart fetchDestBreakdown={fetchDestBreakdown} />
          </Collapse>
        </Box>
      )}
    </Box>
  );
}

export default AudienceExtraCharts;
