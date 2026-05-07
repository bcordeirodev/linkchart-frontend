"use client";
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import WhatshotIcon from "@mui/icons-material/Whatshot";

const RANK_CONFIG: Record<
  string,
  { label: string; color: "default" | "primary" | "warning" | "error" }
> = {
  cold: { label: "Frio", color: "default" },
  warming: { label: "Aquecendo", color: "primary" },
  trending: { label: "Trending", color: "warning" },
  viral: { label: "Viral! 🔥", color: "error" },
};

interface ViralityData {
  current_rank: string;
  distribution: Array<{ rank: string; clicks: number }>;
}

interface Props {
  data?: ViralityData;
}

/**
 * Exibe o rank de viralidade do link baseado em velocidade de cliques.
 */
export function ViralityCard({ data }: Props) {
  if (!data) return null;
  const cfg = RANK_CONFIG[data.current_rank] ?? RANK_CONFIG.cold;

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <WhatshotIcon color="action" />
          <Typography variant="subtitle2">Viralidade</Typography>
        </Box>
        <Chip
          label={cfg.label}
          color={cfg.color}
          size="medium"
          sx={{ fontWeight: 700 }}
        />
        <Box sx={{ mt: 1 }}>
          {data.distribution?.map((d) => (
            <Typography
              key={d.rank}
              variant="caption"
              display="block"
              color="text.secondary"
            >
              {RANK_CONFIG[d.rank]?.label ?? d.rank}: {d.clicks}
            </Typography>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
