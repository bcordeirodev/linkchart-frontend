"use client";
/**
 * ⏱️ TIMEFRAME SELECTOR - Seletor de Período de Tempo
 */

import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useTranslation } from "react-i18next";

import { motionTokens, radiusTokens } from "@/lib/theme/designSystem";

type Timeframe = "1h" | "24h" | "7d" | "30d" | "all";

interface TimeframeSelectorProps {
  value: Timeframe;
  onChange: (timeframe: Timeframe) => void;
}

export function TimeframeSelector({ value, onChange }: TimeframeSelectorProps) {
  const { t } = useTranslation("analytics");
  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newValue: Timeframe | null,
  ) => {
    if (newValue) {
      onChange(newValue);
    }
  };

  return (
    <Box
      sx={{
        mt: 2,
        mb: 3,
        display: "flex",
        justifyContent: "center",
        // Prevents horizontal overflow when buttons can't fit in one row
        overflow: "hidden",
      }}
    >
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        size="small"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          rowGap: 0.75,
          justifyContent: "center",
          "& .MuiToggleButton-root": {
            px: { xs: 1.5, sm: 2 },
            py: 0.5,
            border: "1px solid !important",
            borderColor: "divider !important",
            borderRadius: `${radiusTokens.md}px !important`,
            color: "text.secondary",
            fontWeight: 600,
            fontSize: { xs: "0.75rem", sm: "0.8125rem" },
            transition: `background-color ${motionTokens.duration.base} ${motionTokens.easing.default}, color ${motionTokens.duration.base} ${motionTokens.easing.default}`,
            "&:hover": {
              backgroundColor: "action.hover",
            },
            "&.Mui-selected": {
              backgroundColor: "action.selected",
              color: "text.primary",
              "&:hover": {
                backgroundColor: "action.selected",
              },
            },
          },
        }}
      >
        <ToggleButton value="1h">{t("timeframe.1h")}</ToggleButton>
        <ToggleButton value="24h">{t("timeframe.24h")}</ToggleButton>
        <ToggleButton value="7d">{t("timeframe.7d")}</ToggleButton>
        <ToggleButton value="30d">{t("timeframe.30d")}</ToggleButton>
        <ToggleButton value="all">{t("timeframe.all")}</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

export default TimeframeSelector;
