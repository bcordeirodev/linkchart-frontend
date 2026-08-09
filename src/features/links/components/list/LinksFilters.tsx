"use client";
import { ArrowUpDown, Search, Tag as TagIcon } from "lucide-react";
import { ICON_SM, ICON_LG } from "@/lib/theme/iconDefaults";
import {
  Box,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from "@mui/material";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useTags } from "@/features/links/hooks/useTags";

import { linksRadius } from "./linksPanelStyles";

import type { Theme } from "@mui/material/styles";
import type { SelectChangeEvent } from "@mui/material";

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
 * Shared control height for every instrument in the strip below — the
 * search field, the STATUS segmented control and both selects — so the row
 * reads as one designed instrument rather than a stack of mismatched
 * controls (the composition this replaces had heights ranging 36–48px).
 */
const CONTROL_HEIGHT = 40;

/** Sentinel `Select` value for "no tag filter" — `tagFilter` itself is `number | null`, and MUI `Select` wants one primitive type across every `MenuItem`, not a mix of `string`/`number`. */
const ALL_TAGS_VALUE = "all";

/**
 * Track + selected-segment styling for the STATUS instrument — the same
 * "attached pill group, active segment filled" language used across the
 * app's segmented controls (see `segmentedControl.ts`): a low-contrast
 * track (`action.hover`) holding pill-shaped segments, with the active one
 * filled by `background.paper` plus a
 * level-1 shadow so it reads as "pressed in", not just a color swap. Reused
 * here instead of loose outlined chips so STATUS carries visual weight
 * proportional to being the primary filter in this strip.
 *
 * @param theme - tema MUI ativo.
 * @returns `sx` do `ToggleButtonGroup` (track) — os segmentos internos
 * (`.MuiToggleButton-root`) são estilizados via seletor aninhado.
 */
function getStatusGroupSx(theme: Theme) {
  return {
    gap: 0.375,
    p: 0.375,
    height: CONTROL_HEIGHT,
    flexShrink: 0,
    // Defensive: 4 pt-BR labels ("Todos"/"Ativo"/"Inativo"/"Expirado") can
    // get tight on a ~360px phone. `maxWidth` + `overflowX` contain any
    // overflow to a scroll *inside* the group instead of pushing the page
    // itself wider (the app's e2e net asserts zero page-level horizontal
    // overflow) — normally invisible, since the group fits without scrolling
    // on every viewport this was checked against.
    maxWidth: "100%",
    overflowX: "auto",
    backgroundColor: theme.palette.action.hover,
    borderRadius: `${linksRadius.control}px`,
    "& .MuiToggleButtonGroup-grouped": {
      margin: 0,
      border: 0,
      borderRadius: `${linksRadius.chip}px`,
      "&:not(:first-of-type)": { marginLeft: 0, borderLeft: 0 },
    },
    "& .MuiToggleButton-root": {
      minHeight: CONTROL_HEIGHT - 6,
      textTransform: "none",
      fontWeight: 500,
      fontSize: "0.8125rem",
      px: { xs: 1, sm: 1.25 },
      color: theme.palette.text.secondary,
      whiteSpace: "nowrap",
      transition: theme.transitions.create(
        ["color", "background-color", "box-shadow"],
        { duration: theme.transitions.duration.shortest },
      ),
      "&:hover": {
        backgroundColor: "transparent",
        color: theme.palette.text.primary,
      },
      "&.Mui-selected": {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        fontWeight: 600,
        boxShadow: theme.shadows[1],
      },
      "&.Mui-selected:hover": {
        backgroundColor: theme.palette.background.paper,
      },
    },
  };
}

/**
 * Boxless search/sort/status/tag toolbar for the browse-list section — a
 * dense, single-purpose "instrument strip", not a stack of sparse rows.
 *
 * Layout: on `md+` all four instruments share one row — `[ search — flex ]
 * [ STATUS segmented control ] [ TAGS select ] [ sort select ]`. Below `md`,
 * the search field takes its own full-width row and the other three wrap
 * onto a second row together. Every control shares {@link CONTROL_HEIGHT}
 * and a `1.5`-unit gap so the strip reads as one instrument rather than
 * four independently-sized controls.
 *
 * STATUS and TAGS dropped their caps micro-labels ("STATUS"/"TAGS") from
 * the previous (chip-row) composition — the controls now speak for
 * themselves (a segmented control's selected label, a select's own
 * rendered value) — but both keep an `aria-label` for screen readers.
 *
 * Zero behavior change from the previous composition: `searchTerm` still
 * debounces through local state exactly as before; `statusFilter`/`sortBy`/
 * `tagFilter` and their `onChange` callbacks are unchanged in shape and
 * semantics (`tagFilter` is still single-select, `null` = "all tags" — the
 * `Select` merely renders that single active state instead of a chip row).
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
  // Tag select only renders once the user has created at least one tag —
  // same gate the previous chip row used.
  const { data: userTags = [] } = useTags();

  // "scheduled" (starts_in no futuro) não tem equivalente no filtro `status`
  // do servidor (`active|inactive|expired` — ver GET /api/links?status=), então
  // o chip foi removido daqui. O badge de status "Agendado" no card continua
  // existindo (getLinkStatus roda por link, client-side, independente deste
  // filtro) — só deixou de ser um critério de busca server-side.
  const STATUS_OPTIONS = [
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

  /**
   * Ignores the `null` MUI emits when the user clicks the already-active
   * segment of an `exclusive` `ToggleButtonGroup` — STATUS always has one
   * active option, so a click on the current one is a no-op (the same guard
   * any exclusive `ToggleButtonGroup` in the app needs). The link detail
   * header's Analytics/Editar/QR switch used to share this guard before its
   * navigation moved into the header's overflow menu on 2026-08-09.
   */
  const handleStatusChange = (
    _event: React.MouseEvent<HTMLElement>,
    next: string | null,
  ) => {
    if (next !== null) {
      onStatusChange(next);
    }
  };

  const handleTagChange = (event: SelectChangeEvent) => {
    const raw = event.target.value;
    onTagFilterChange?.(raw === ALL_TAGS_VALUE ? null : Number(raw));
  };

  const selectedTag = userTags.find((tag) => tag.id === tagFilter);

  const controlSx = {
    borderRadius: `${linksRadius.control}px`,
    fontSize: "0.875rem",
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { md: "center" },
        gap: 1.5,
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
          minWidth: { md: 200 },
          "& .MuiOutlinedInput-root": {
            ...controlSx,
            height: CONTROL_HEIGHT,
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

      {/* Abaixo de `md`, os três instrumentos restantes quebram juntos numa
          segunda linha; a partir de `md` seguem inline ao lado da busca. */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <ToggleButtonGroup
          value={statusFilter}
          exclusive
          onChange={handleStatusChange}
          aria-label={t("filters.status")}
          sx={getStatusGroupSx(theme)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <ToggleButton key={opt.value} value={opt.value}>
              {opt.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {userTags.length > 0 ? (
          <FormControl size="small" sx={{ minWidth: 170, flexShrink: 0 }}>
            <Select
              value={tagFilter !== null ? String(tagFilter) : ALL_TAGS_VALUE}
              onChange={handleTagChange}
              aria-label={t("tags.filter.label")}
              renderValue={() => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  {selectedTag ? (
                    <Box
                      component="span"
                      aria-hidden
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        flexShrink: 0,
                        bgcolor: selectedTag.color,
                      }}
                    />
                  ) : (
                    <TagIcon {...ICON_SM} />
                  )}
                  <Box
                    component="span"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {selectedTag?.name ?? t("tags.filter.all")}
                  </Box>
                </Box>
              )}
              sx={{ ...controlSx, height: CONTROL_HEIGHT }}
            >
              <MenuItem value={ALL_TAGS_VALUE}>{t("tags.filter.all")}</MenuItem>
              {userTags.map((tag) => (
                <MenuItem key={tag.id} value={String(tag.id)}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      component="span"
                      aria-hidden
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        flexShrink: 0,
                        bgcolor: tag.color,
                      }}
                    />
                    {tag.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : null}

        <FormControl size="small" sx={{ minWidth: 170, flexShrink: 0 }}>
          <Select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            displayEmpty
            aria-label={t("filters.sortBy")}
            renderValue={(val) => {
              const opt = SORT_OPTIONS.find((o) => o.value === val);
              return (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <ArrowUpDown {...ICON_SM} />
                  <span>{opt?.label ?? t("filters.sortBy")}</span>
                </Box>
              );
            }}
            sx={{ ...controlSx, height: CONTROL_HEIGHT }}
          >
            {SORT_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}

export default LinksFilters;
