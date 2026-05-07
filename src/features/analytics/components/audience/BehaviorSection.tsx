"use client";
import {
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Navigation } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import {
  elevationLightTokens,
  elevationTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";
import type { NavigationContextEntry } from "@/types/analytics/audience";

const CONTEXT_COLORS: Record<string, string> = {
  browser_direct: "#22c55e",
  browser_referral: "#3b82f6",
  in_app_webview: "#f59e0b",
  api_programmatic: "#ef4444",
  unknown: "#94a3b8",
};

interface BehaviorSectionProps {
  navigationContext: NavigationContextEntry[];
}

export function BehaviorSection({ navigationContext }: BehaviorSectionProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";
  const elevation = isDark ? elevationTokens : elevationLightTokens;

  if (navigationContext.length === 0) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {t("audience.behavior.title")}
      </Typography>

      <Card
        sx={{ borderRadius: `${radiusTokens.lg}px`, boxShadow: elevation.xs }}
      >
        <CardContent>
          <Typography
            variant="subtitle2"
            sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
          >
            <Navigation {...ICON_MD} />
            {t("audience.behavior.navigationContext")}
          </Typography>

          <Stack spacing={2}>
            {navigationContext.map((entry) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const label = (t as any)(
                `audience.behavior.contexts.${entry.context}`,
                { defaultValue: entry.context },
              ) as string;
              const color = CONTEXT_COLORS[entry.context] ?? "#94a3b8";
              return (
                <Box key={entry.context}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2">{label}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {entry.clicks} ({entry.percentage.toFixed(1)}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={entry.percentage}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      "& .MuiLinearProgress-bar": { backgroundColor: color },
                    }}
                  />
                </Box>
              );
            })}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default BehaviorSection;
