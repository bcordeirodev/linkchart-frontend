"use client";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Info, BarChart2 } from "lucide-react";

import { ICON_LG } from "@/lib/theme/iconDefaults";

import type { ReactNode } from "react";

interface TabDescriptionProps {
  icon: ReactNode;
  title: string;
  description: string;
  highlight?: string;
  metadata?: string;
}

function TabDescription({
  icon,
  title,
  description,
  highlight,
  metadata,
}: TabDescriptionProps) {
  const theme = useTheme();

  return (
    <Box
      className="tab-description-container"
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        p: 3,
        mb: 3,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          {icon}
        </Box>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {description}
      </Typography>

      {highlight ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Info {...ICON_LG} color={theme.palette.primary.main} />
          <Typography
            variant="caption"
            sx={{ color: "primary.main", fontWeight: 500 }}
          >
            {highlight}
          </Typography>
        </Box>
      ) : null}

      {metadata ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
          <BarChart2 {...ICON_LG} color={theme.palette.text.secondary} />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontStyle: "italic" }}
          >
            {metadata}
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}

export default TabDescription;
