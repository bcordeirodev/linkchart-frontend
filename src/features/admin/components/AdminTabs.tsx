"use client";

import {
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { getSegmentedControlSx } from "@/shared/ui/base";

import type { AdminRange } from "@/features/admin/types";

/** Tabs do painel admin. */
export type AdminTab = "growth" | "users" | "engagement" | "health";

interface AdminTabsProps {
  /** Tab ativa. */
  tab: AdminTab;
  /** Callback de troca de tab. */
  onTabChange: (tab: AdminTab) => void;
  /** Janela ativa (oculta na tab health/users se não se aplica). */
  range: AdminRange;
  /** Callback de troca de janela. */
  onRangeChange: (range: AdminRange) => void;
  /** Se o seletor de range aparece (tabs janeladas). */
  showRange: boolean;
}

/**
 * Barra de controle do painel admin: segmented control de tabs (mesmo
 * padrão visual do view switcher de `LinkActions`/`TabFilterBar`) + seletor
 * de período. Ambos os `ToggleButtonGroup` usam `getSegmentedControlSx` —
 * a mesma linguagem de "instrumento técnico" (track `action.hover` + pill
 * ativa em `background.paper`) em vez do visual default do MUI.
 */
export function AdminTabs({
  tab,
  onTabChange,
  range,
  onRangeChange,
  showRange,
}: AdminTabsProps) {
  const { t } = useTranslation("admin");
  const theme = useTheme();
  const segmentedSx = getSegmentedControlSx(theme);

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1.5}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", sm: "center" }}
    >
      <ToggleButtonGroup
        exclusive
        size="small"
        value={tab}
        onChange={(_, next: AdminTab | null) => next && onTabChange(next)}
        aria-label={t("page.title")}
        sx={segmentedSx}
      >
        <ToggleButton value="growth">{t("tabs.growth")}</ToggleButton>
        <ToggleButton value="users">{t("tabs.users")}</ToggleButton>
        <ToggleButton value="engagement">{t("tabs.engagement")}</ToggleButton>
        <ToggleButton value="health">{t("tabs.health")}</ToggleButton>
      </ToggleButtonGroup>

      {showRange ? (
        <ToggleButtonGroup
          exclusive
          size="small"
          value={range}
          onChange={(_, next: AdminRange | null) => next && onRangeChange(next)}
          aria-label={t("range.label")}
          sx={segmentedSx}
        >
          <ToggleButton value="7d">{t("range.7d")}</ToggleButton>
          <ToggleButton value="30d">{t("range.30d")}</ToggleButton>
          <ToggleButton value="90d">{t("range.90d")}</ToggleButton>
        </ToggleButtonGroup>
      ) : null}
    </Stack>
  );
}
