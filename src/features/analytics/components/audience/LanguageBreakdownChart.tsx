"use client";

import { Box, Typography, LinearProgress, Chip } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";

interface LanguageEntry {
  language: string;
  region: string | null;
  clicks: number;
  percentage: number;
}

interface Props {
  data: LanguageEntry[];
}

export function LanguageBreakdownChart({ data }: Props) {
  if (!data?.length) {
    return (
      <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
        <LanguageIcon sx={{ fontSize: 40, mb: 1, opacity: 0.4 }} />
        <Typography variant="body2">Sem dados de idioma ainda</Typography>
      </Box>
    );
  }

  const visible = data.slice(0, 8);

  return (
    <Box>
      {visible.map((entry) => {
        const label = entry.region ?? entry.language.toUpperCase();
        return (
          <Box key={label} sx={{ mb: 2 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip label={label} size="small" variant="outlined" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {entry.clicks} ({entry.percentage}%)
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={entry.percentage}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        );
      })}
    </Box>
  );
}
