"use client";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
} from "@mui/material";
import CelebrationIcon from "@mui/icons-material/Celebration";

interface HolidayEntry {
  holiday: string;
  clicks: number;
  percentage: number;
}

interface HolidayImpact {
  holiday_clicks: number;
  non_holiday_clicks: number;
  holiday_percentage: number;
  top_holidays: HolidayEntry[];
}

interface Props {
  data?: HolidayImpact;
}

/**
 * Exibe o impacto de feriados nos cliques do link.
 */
export function HolidayImpactCard({ data }: Props) {
  if (!data?.top_holidays?.length && !data?.holiday_clicks) return null;

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <CelebrationIcon color="primary" />
          <Typography variant="h6">Impacto de Feriados</Typography>
          <Chip
            label={`${data.holiday_percentage}%`}
            size="small"
            color="primary"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {data.holiday_clicks} cliques em feriados vs {data.non_holiday_clicks}{" "}
          em dias normais
        </Typography>
        {data.top_holidays.length > 0 && (
          <>
            <Divider sx={{ mb: 1 }} />
            {data.top_holidays.map((h) => (
              <Box
                key={h.holiday}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 0.5,
                }}
              >
                <Typography variant="body2">{h.holiday}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {h.clicks} ({h.percentage}%)
                </Typography>
              </Box>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}
