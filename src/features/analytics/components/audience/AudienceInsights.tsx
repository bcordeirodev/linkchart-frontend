"use client";
import { Lightbulb, Target, BarChart3, TrendingUp, Wrench } from "lucide-react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import {
  elevationLightTokens,
  elevationTokens,
  motionTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";

import type { DeviceData } from "@/types";

interface AudienceInsightsProps {
  deviceBreakdown: DeviceData[];
  browserBreakdown?: any[];
  totalClicks: number;
  showAdvancedInsights?: boolean;
}

export function AudienceInsights({
  deviceBreakdown,
  browserBreakdown: _browserBreakdown,
  totalClicks,
  showAdvancedInsights: _showAdvancedInsights = true,
}: AudienceInsightsProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const elevation = isDark ? elevationTokens : elevationLightTokens;

  // Calcular insights
  const primaryDevice =
    deviceBreakdown.length > 0
      ? deviceBreakdown.reduce(
          (max, device) => (device.clicks > max.clicks ? device : max),
          deviceBreakdown[0],
        )
      : { device: "--", clicks: 0 };

  const mobileDevices = deviceBreakdown.filter(
    (device) =>
      device.device.toLowerCase().includes("mobile") ||
      device.device.toLowerCase().includes("android") ||
      device.device.toLowerCase().includes("iphone"),
  );

  const desktopDevices = deviceBreakdown.filter(
    (device) =>
      device.device.toLowerCase().includes("desktop") ||
      device.device.toLowerCase().includes("windows") ||
      device.device.toLowerCase().includes("mac"),
  );

  const mobilePercentage =
    (mobileDevices.reduce((sum, device) => sum + device.clicks, 0) /
      totalClicks) *
    100;
  const desktopPercentage =
    (desktopDevices.reduce((sum, device) => sum + device.clicks, 0) /
      totalClicks) *
    100;

  const isMobileDominant = mobilePercentage > desktopPercentage;
  const isDesktopDominant = desktopPercentage > mobilePercentage;
  const isBalanced = Math.abs(mobilePercentage - desktopPercentage) < 10;

  return (
    <Card
      sx={{
        borderRadius: `${radiusTokens.lg}px`,
        boxShadow: elevation.xs,
        transition: `box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Lightbulb size={16} strokeWidth={1.5} />
          Insights de Audiência
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Target size={16} strokeWidth={1.5} />
              Dispositivo Principal
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
              <Chip
                label={primaryDevice?.device || "N/A"}
                color="primary"
                variant="filled"
              />
              <Chip
                label={`${(((primaryDevice?.clicks || 0) / totalClicks) * 100).toFixed(1)}%`}
                color="secondary"
                variant="outlined"
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <BarChart3 size={16} strokeWidth={1.5} />
              Distribuição Mobile vs Desktop
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip
                label={`Mobile: ${mobilePercentage.toFixed(1)}%`}
                color={isMobileDominant ? "primary" : "default"}
                variant={isMobileDominant ? "filled" : "outlined"}
              />
              <Chip
                label={`Desktop: ${desktopPercentage.toFixed(1)}%`}
                color={isDesktopDominant ? "primary" : "default"}
                variant={isDesktopDominant ? "filled" : "outlined"}
              />
            </Stack>
          </Grid>
        </Grid>

        <Divider />

        {/* Recomendações */}
        <Box sx={{ mb: 1, mt: 1 }}>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <TrendingUp size={16} strokeWidth={1.5} />
            Recomendações Estratégicas
          </Typography>
          <Stack spacing={1}>
            {isMobileDominant ? (
              <Typography variant="body2" color="text.secondary">
                • <strong>Mobile-first:</strong> Sua audiência é
                predominantemente mobile ({mobilePercentage.toFixed(1)}%).
                Otimize a experiência para dispositivos móveis.
              </Typography>
            ) : null}
            {isDesktopDominant ? (
              <Typography variant="body2" color="text.secondary">
                • <strong>Desktop-focused:</strong> Sua audiência é
                predominantemente desktop ({desktopPercentage.toFixed(1)}%).
                Foque em conteúdo mais detalhado e interativo.
              </Typography>
            ) : null}
            {isBalanced ? (
              <Typography variant="body2" color="text.secondary">
                • <strong>Audiência equilibrada:</strong> Sua audiência está bem
                distribuída entre mobile e desktop. Mantenha uma experiência
                consistente em todas as plataformas.
              </Typography>
            ) : null}
            {primaryDevice ? (
              <Typography variant="body2" color="text.secondary">
                • <strong>{primaryDevice.device}</strong> é o dispositivo mais
                usado. Considere otimizações específicas para esta plataforma.
              </Typography>
            ) : null}
            {deviceBreakdown.length > 3 && (
              <Typography variant="body2" color="text.secondary">
                • Sua audiência usa {deviceBreakdown.length} tipos diferentes de
                dispositivos. Garanta compatibilidade cross-platform.
              </Typography>
            )}
          </Stack>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Detalhes técnicos */}
        <Box sx={{ mb: 1, mt: 1 }}>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Wrench size={16} strokeWidth={1.5} />
            Detalhes Técnicos
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              • <strong>Total de dispositivos:</strong> {deviceBreakdown.length}{" "}
              tipos diferentes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • <strong>Dispositivo mais popular:</strong>{" "}
              {primaryDevice?.device} com {primaryDevice?.clicks} cliques
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • <strong>Diversidade de plataformas:</strong>{" "}
              {deviceBreakdown.length > 2 ? "Alta" : "Baixa"}
            </Typography>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
