"use client";
import { Search, ArrowUpDown, Rows2, Rows4 } from "lucide-react";
import { ICON_SM, ICON_LG } from "@/lib/theme/iconDefaults";
import {
  Box,
  Chip,
  Divider,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from "@mui/material";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import type { LinkDensity } from "@/features/links/hooks/useLinkDensity";

import { getSoftSelectedChipSx } from "@/lib/theme/softChip";

import {
  getLinksFilterInsetSx,
  getLinksPanelSx,
  getLinksBorderColor,
} from "./linksPanelStyles";

interface LinksFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  /** When true, renders inside a parent card (no outer paper wrapper). */
  embedded?: boolean;
  /** Active row density; required when `showDensityToggle` is true. */
  density?: LinkDensity;
  /** Called when the user picks a new density. */
  onDensityChange?: (density: LinkDensity) => void;
  /** Renders the comfortable/compact segmented control (desktop only). */
  showDensityToggle?: boolean;
}

export function LinksFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  embedded = false,
  density = "comfortable",
  onDensityChange,
  showDensityToggle = false,
}: LinksFiltersProps) {
  const theme = useTheme();
  const { t } = useTranslation("links");
  const [localSearch, setLocalSearch] = useState(searchTerm);

  const STATUS_CHIPS = [
    { value: "all", label: t("filters.all") },
    { value: "active", label: t("status.active") },
    { value: "inactive", label: t("status.inactive") },
    { value: "scheduled", label: t("status.scheduled") },
    { value: "expired", label: t("status.expired") },
  ];

  const SORT_OPTIONS = [
    { value: "created_at", label: t("filters.sortNewest") },
    { value: "clicks", label: t("filters.sortMostClicks") },
    { value: "trend", label: t("filters.mostTrend") },
    { value: "last_activity", label: t("filters.lastActivity") },
  ];

  const debouncedSearch = useMemo(
    () => debounce((value: string) => onSearchChange(value), 200),
    [onSearchChange],
  );

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);
  useEffect(() => setLocalSearch(searchTerm), [searchTerm]);

  const shellSx = embedded
    ? getLinksFilterInsetSx(theme)
    : { ...getLinksPanelSx(theme), mb: 0, overflow: "hidden" as const };

  return (
    <Box sx={shellSx}>
      {/* Linha 1: busca + ordenação */}
      <Box
        sx={{
          display: "flex",
          gap: 0,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "stretch",
        }}
      >
        <TextField
          variant="outlined"
          placeholder={t("filters.search")}
          value={localSearch}
          onChange={(e) => {
            setLocalSearch(e.target.value);
            debouncedSearch(e.target.value);
          }}
          fullWidth
          size="small"
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: 0,
              border: "none",
              "& fieldset": { border: "none" },
              "&:hover fieldset": { border: "none" },
              "&.Mui-focused fieldset": { border: "none" },
              fontSize: "0.875rem",
              minHeight: 48,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search {...ICON_LG} style={{ opacity: 0.5 }} />
              </InputAdornment>
            ),
          }}
        />

        <Divider
          orientation="vertical"
          flexItem
          sx={{ display: { xs: "none", sm: "block" } }}
        />
        <Divider
          orientation="horizontal"
          sx={{ display: { xs: "block", sm: "none" } }}
        />

        <FormControl size="small" sx={{ minWidth: 180, flexShrink: 0 }}>
          <Select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            displayEmpty
            renderValue={(val) => {
              const opt = SORT_OPTIONS.find((o) => o.value === val);
              return (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <ArrowUpDown {...ICON_SM} />
                  <span>{opt?.label ?? t("filters.sortBy")}</span>
                </Box>
              );
            }}
            sx={{
              borderRadius: 0,
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              fontSize: "0.875rem",
              minHeight: 48,
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Divider />

      {/* Linha 2: chips de status + densidade */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2,
          py: 1.5,
        }}
      >
        <Stack
          direction="row"
          spacing={0.75}
          flexWrap="wrap"
          useFlexGap
          sx={{ flex: 1, minWidth: 0 }}
        >
          {STATUS_CHIPS.map((chip) => (
            <Chip
              key={chip.value}
              label={chip.label}
              clickable
              size="small"
              variant="outlined"
              onClick={() => onStatusChange(chip.value)}
              sx={{
                fontSize: "0.75rem",
                ...getSoftSelectedChipSx(theme, statusFilter === chip.value),
              }}
            />
          ))}
        </Stack>

        {showDensityToggle ? (
          <ToggleButtonGroup
            value={density}
            exclusive
            size="small"
            onChange={(_, next: LinkDensity | null) => {
              if (next) onDensityChange?.(next);
            }}
            aria-label={t("filters.density.label")}
            sx={{
              flexShrink: 0,
              "& .MuiToggleButton-root": {
                px: 0.875,
                py: 0.375,
                border: `1px solid ${getLinksBorderColor(theme)}`,
                color: "text.secondary",
                "&.Mui-selected": {
                  color: "primary.main",
                  bgcolor: "action.selected",
                },
              },
            }}
          >
            <ToggleButton
              value="comfortable"
              aria-label={t("filters.density.comfortable")}
              title={t("filters.density.comfortable")}
            >
              <Rows2 {...ICON_SM} />
            </ToggleButton>
            <ToggleButton
              value="compact"
              aria-label={t("filters.density.compact")}
              title={t("filters.density.compact")}
            >
              <Rows4 {...ICON_SM} />
            </ToggleButton>
          </ToggleButtonGroup>
        ) : null}
      </Box>
    </Box>
  );
}

export default LinksFilters;
