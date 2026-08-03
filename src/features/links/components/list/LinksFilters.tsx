"use client";
import { Search, ArrowUpDown } from "lucide-react";
import { ICON_SM, ICON_LG } from "@/lib/theme/iconDefaults";
import {
  Box,
  Chip,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useTags } from "@/features/links/hooks/useTags";

import { getSoftSelectedChipSx } from "@/lib/theme/softChip";

import { linksRadius } from "./linksPanelStyles";

interface LinksFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  /** Selected tag id filter, or `null` when no tag filter is active. */
  tagFilter?: number | null;
  /** Called when the user picks (or clears) a tag filter chip. */
  onTagFilterChange?: (tagId: number | null) => void;
}

/**
 * Boxless search/sort/status/tag toolbar for the browse-list section.
 *
 * Level 0 — no wrapping panel. The "instrumento técnico" redesign flattened
 * the bordered inset box this used to live in (a card-on-card against the
 * card grid it sits above); the search field and sort select keep their own
 * default outlined control chrome (that's control-level chrome, not section
 * elevation), and the status/tag chip rows sit inline with no box around
 * them. `LinksBrowseSection` supplies the single hairline that separates this
 * toolbar from the card grid below.
 */
export function LinksFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  tagFilter = null,
  onTagFilterChange,
}: LinksFiltersProps) {
  const theme = useTheme();
  const { t } = useTranslation("links");
  const [localSearch, setLocalSearch] = useState(searchTerm);
  // Tag filter row only renders once the user has created at least one tag.
  const { data: userTags = [] } = useTags();

  // "scheduled" (starts_in no futuro) não tem equivalente no filtro `status`
  // do servidor (`active|inactive|expired` — ver GET /api/links?status=), então
  // o chip foi removido daqui. O badge de status "Agendado" no card continua
  // existindo (getLinkStatus roda por link, client-side, independente deste
  // filtro) — só deixou de ser um critério de busca server-side.
  const STATUS_CHIPS = [
    { value: "all", label: t("filters.all") },
    { value: "active", label: t("status.active") },
    { value: "inactive", label: t("status.inactive") },
    { value: "expired", label: t("status.expired") },
  ];

  // `trend` e `last_activity` exigiam agregação client-side sobre a lista
  // inteira (tendência/último clique de todos os links) — sem equivalente no
  // `sort` server-side (`created_at|clicks|title`), foram removidos do select.
  const SORT_OPTIONS = [
    { value: "created_at", label: t("filters.sortNewest") },
    { value: "clicks", label: t("filters.sortMostClicks") },
  ];

  const debouncedSearch = useMemo(
    () => debounce((value: string) => onSearchChange(value), 200),
    [onSearchChange],
  );

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);
  useEffect(() => setLocalSearch(searchTerm), [searchTerm]);

  // Rótulo curto à esquerda de cada fileira de chips ("Status", "Tags") — sem
  // ele, quem chega pela primeira vez vê "Todos / Ativo / Inativo / Expirado"
  // sem saber do que a fileira fala.
  const rowLabelSx = {
    fontWeight: 600,
    fontSize: "0.6875rem",
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    color: "text.secondary",
    flexShrink: 0,
    mr: 0.5,
  };

  const controlSx = {
    borderRadius: `${linksRadius.control}px`,
    fontSize: "0.875rem",
  };

  return (
    <Box>
      {/* Linha 1: busca + ordenação — dois controles independentes, cada um
          com sua própria borda (chrome de controle, permitido em nível 0). */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { sm: "center" },
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
              ...controlSx,
              minHeight: 44,
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
            sx={{ ...controlSx, minHeight: 44 }}
          >
            {SORT_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Linha 2: chips de status */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 1.5 }}>
        <Typography component="span" sx={rowLabelSx}>
          {t("filters.status")}
        </Typography>
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
      </Stack>

      {/* Linha 3: filtro por tag — só aparece quando o usuário já tem tags. */}
      {userTags.length > 0 ? (
        <Stack
          direction="row"
          spacing={0.75}
          flexWrap="wrap"
          useFlexGap
          alignItems="center"
          sx={{ mt: 1.5 }}
        >
          <Typography component="span" sx={rowLabelSx}>
            {t("tags.filter.label")}
          </Typography>
          <Chip
            label={t("tags.filter.all")}
            clickable
            size="small"
            variant="outlined"
            onClick={() => onTagFilterChange?.(null)}
            sx={{
              fontSize: "0.75rem",
              ...getSoftSelectedChipSx(theme, tagFilter === null),
            }}
          />
          {userTags.map((tag) => (
            <Chip
              key={tag.id}
              label={tag.name}
              clickable
              size="small"
              variant="outlined"
              onClick={() =>
                onTagFilterChange?.(tagFilter === tag.id ? null : tag.id)
              }
              sx={{
                fontSize: "0.75rem",
                ...getSoftSelectedChipSx(
                  theme,
                  tagFilter === tag.id,
                  tag.color,
                ),
              }}
            />
          ))}
        </Stack>
      ) : null}
    </Box>
  );
}

export default LinksFilters;
