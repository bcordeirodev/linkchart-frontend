// src/features/links/components/analytics/LinkAnalyticsTabs.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  LayoutDashboard,
  Share2,
  Globe,
  Users,
  Clock,
  MousePointer2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import visuallyHidden from "@mui/utils/visuallyHidden";

import { ICON_SM } from "@/lib/theme/iconDefaults";
import { radiusTokens } from "@/lib/theme/designSystem";

import { AnalyticsPanelActiveProvider } from "@/features/analytics/context/AnalyticsPanelActiveContext";
import { AudienceAnalysis } from "@/features/analytics/components/audience/AudienceAnalysis";
import { GeographicAnalysis } from "@/features/analytics/components/geographic/GeographicAnalysis";
import { OriginAnalysis } from "@/features/analytics/components/origin/OriginAnalysis";
import { TemporalAnalysis } from "@/features/analytics/components/temporal";
import { LinkDashboard } from "@/features/analytics/components/dashboard/LinkDashboard";

import { AnalyticsFilterBar } from "./AnalyticsFilterBar";
import { ClicksTable } from "./ClicksTable";
import {
  useAnalyticsFilters,
  TAB_IDS,
  type TabId,
} from "@/features/links/hooks/useAnalyticsFilters";

interface LinkAnalyticsTabsOptimizedProps {
  /** The ID of the link whose analytics are displayed. */
  linkId: string;
  /** Reserved for future loading-skeleton integration. */
  loading?: boolean;
}

/**
 * Tabs for individual-link analytics with URL-persisted filters.
 *
 * Instantiates `useAnalyticsFilters` once and fans filter state out to every
 * tab component. The global `AnalyticsFilterBar` (period presets + bot toggle)
 * is rendered above the tab navigation.
 *
 * ### Mount-once pattern
 * A `visitedTabs` Set tracks which tabs have been opened. Each visited tab
 * stays in the DOM (hidden via `display:none`) so its hook state survives
 * tab switching — no refetch on revisit. Unvisited tabs are not rendered at
 * all, preserving lazy loading on first access.
 *
 * ### URL-named tabs
 * The `tab` URL param uses named slugs (`?tab=places`) instead of numeric
 * indices. Invalid or missing values fall back to `"overview"`.
 */
export function LinkAnalyticsTabsOptimized({
  linkId,
  loading: _loading = false,
}: LinkAnalyticsTabsOptimizedProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation("analytics");
  const filters = useAnalyticsFilters();

  /** Numeric index of the active tab — required by MUI `<Tabs value>`. */
  const tabIndex = TAB_IDS.indexOf(filters.tab);

  /**
   * Set of tabs that have been visited at least once in this session.
   * Initialised with the tab coming from the URL so deep-linked tabs
   * are mounted immediately.
   */
  const [visitedTabs, setVisitedTabs] = useState<Set<TabId>>(
    () => new Set([filters.tab]),
  );

  useEffect(() => {
    setVisitedTabs((prev) =>
      prev.has(filters.tab) ? prev : new Set([...prev, filters.tab]),
    );
  }, [filters.tab]);

  /** Converts a MUI Tabs numeric index back to a named TabId. */
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    filters.setTab(TAB_IDS[newValue] ?? "overview");
  };

  /**
   * Ordered tab metadata used to render the nav row and the panel headers.
   *
   * **Parallel to `TAB_IDS`** — index `i` here describes `TAB_IDS[i]`. Reorder
   * one and you must reorder the other, or every tab renders another tab's
   * label and description.
   */
  const tabLabels = [
    {
      label: t("tabs.overview"),
      description: t("tabDescriptions.overview"),
      Icon: LayoutDashboard,
    },
    {
      label: t("tabs.when"),
      description: t("tabDescriptions.when"),
      Icon: Clock,
    },
    {
      label: t("tabs.audience"),
      description: t("tabDescriptions.audience"),
      Icon: Users,
    },
    {
      label: t("tabs.places"),
      description: t("tabDescriptions.places"),
      Icon: Globe,
    },
    {
      label: t("tabs.origin"),
      description: t("tabDescriptions.origin"),
      Icon: Share2,
    },
    {
      label: t("tabs.clicks"),
      description: t("tabDescriptions.clicks"),
      Icon: MousePointer2,
    },
  ];

  /**
   * Renders a tab's content panel with its header (a visually hidden `h2`
   * naming the section, plus the visible one-line explanation) above the tab
   * component.
   *
   * The panel is only added to the DOM on the first visit (`visitedTabs.has(id)`).
   * Once mounted it persists across tab switches via `display` toggling, keeping
   * the hook's data alive without re-fetching.
   *
   * @param id - the TabId for this panel
   * @param children - the tab component to render
   */
  const tabPanel = (id: TabId, children: React.ReactNode) => {
    if (!visitedTabs.has(id)) return null;
    const index = TAB_IDS.indexOf(id);
    const meta = tabLabels[index]!;
    const isActive = filters.tab === id;
    return (
      <Box
        role="tabpanel"
        id={`tabpanel-${id}`}
        aria-labelledby={`tab-${index}`}
        sx={{ display: isActive ? "block" : "none" }}
      >
        {/* Tab header — explanation only. The visible `/ RESUMO` label that
            used to sit here echoed the active tab word for word, one line
            under a tab strip that already says "Resumo" in bold with a primary
            underline. Under the level-1 grammar THE TAB *IS* the section
            title, so the echo was pure duplication; the sentence below it is
            the only part that adds anything.

            The heading itself stays for assistive tech: an `h2` carrying the
            section name, visually hidden. Dropping it outright would break the
            h1 → h2 outline and leave each panel unnamed in a screen reader's
            heading list — the tab strip is `role="tab"`, not a heading, so it
            cannot stand in.

            Rhythm: the sentence belongs to the tab above it, so it sits closer
            to the tab bar (12/16px) than to the content it introduces
            (20/24px) — the same "a thing sits nearer what it belongs to" rule
            the level-3 filter gutters follow. */}
        <Box sx={{ mb: { xs: 2.5, md: 3 } }}>
          <Typography variant="h2" component="h2" sx={visuallyHidden}>
            {meta.label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {meta.description}
          </Typography>
        </Box>
        {/* Mounted-but-hidden panels keep their cached data and stop fetching:
            without this, changing the period refetched every tab the user had
            ever opened, all at once, to render one of them. */}
        <AnalyticsPanelActiveProvider active={isActive}>
          {children}
        </AnalyticsPanelActiveProvider>
      </Box>
    );
  };

  return (
    <Box>
      {/* Global filter bar — date range + shortcut presets + bot-exclusion toggle */}
      <AnalyticsFilterBar
        period={filters.period}
        dateFrom={filters.dateFrom}
        dateTo={filters.dateTo}
        excludeBots={filters.excludeBots}
        onPeriodChange={filters.setPeriod}
        onDateRangeChange={filters.setDateRange}
        onExcludeBotsChange={filters.setExcludeBots}
      />

      {/* Painel emoldurado (2026-08-08): as tabs são o CABEÇALHO de um painel
           com moldura própria — borda hairline, radius de card e um degrau de
           superfície acima do fundo da página. Antes, a faixa de tabs flutuava
           entre o card de filtros e o conteúdo, e nada dizia que o conteúdo
           abaixo era filho da tab ativa (lia-se como mais um filtro). Com a
           moldura, a hierarquia vira literal: página < painel < cards. O
           cabeçalho tem um véu um passo mais forte que o corpo, e a barra de
           filtros fica FORA da moldura — controle global sobre o módulo, não
           parte dele.

           Conferido em 2026-08-09 (F5/C3): os véus abaixo (corpo 0.015,
           cabeçalho 0.03) ficam INTOCADOS nos dois temas — não são o defeito.
           No claro, o degrau canvas < painel < card só existia visualmente
           antes da correção porque cards e painel usavam a mesma família de
           véu preto translúcido (MuiCard também escurecia). Com o MuiCard
           light corrigido para `background.paper` sólido
           (`lib/theme/config/muiComponents.ts`), os cards dentro deste painel
           voltam a ficar mais claros que ele, recompondo a hierarquia
           página < painel < card sem tocar nestes dois valores. */}
      <Box
        sx={{
          mt: { xs: 2, md: 2.5 },
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: `${radiusTokens.lg}px`,
          overflow: "hidden",
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.02)"
              : "rgba(0,0,0,0.015)",
        }}
      >
        <Box
          sx={{
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.035)"
                : "rgba(0,0,0,0.03)",
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              // Level 1 — the strongest level, and the only one carrying the
              // primary accent, via the tab indicator underline. Color, hover,
              // the (no longer filled) selected state *and* the rounded 2px
              // indicator all come from the global `MuiTab`/`MuiTabs` overrides
              // in `theme/config/muiComponents.ts` — they were moved there so
              // every tab in the app shares this grammar instead of this screen
              // re-declaring it locally. Only the L1-specific scale (52px, one
              // step above the L2 sub-tabs' 36/40) stays here.
              "& .MuiTab-root": {
                minHeight: 52,
              },
              // Hierarquia (2026-08-08): o ícone da tab ativa assume a cor do
              // indicador. O sublinhado sozinho fica a ~40px do rótulo em tabs
              // fullWidth e o olho nem sempre os conecta; ícone + sublinhado na
              // mesma matiz tornam o "onde estou" inequívoco sem reintroduzir o
              // fill que o redesign 2026-08-04 removeu do nível 1. Escopado a
              // esta tela — o override global de MuiTab segue neutro.
              "& .MuiTab-root.Mui-selected .MuiTab-iconWrapper": {
                color: theme.palette.primary.main,
              },
            }}
          >
            {tabLabels.map(({ label, Icon }, index) => (
              <Tab
                key={index}
                id={`tab-${index}`}
                aria-controls={`tabpanel-${TAB_IDS[index]}`}
                label={label}
                icon={
                  <Box
                    component="span"
                    sx={{ display: { xs: "none", sm: "inline-flex" } }}
                  >
                    <Icon {...ICON_SM} />
                  </Box>
                }
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Box>

        {/* Corpo do painel — mount-once, hidden via display:none when
             inactive. O respiro agora é padding interno da moldura (não mais
             gutter solto): é o que faz o conteúdo ler como "dentro" das tabs. */}
        <Box
          sx={{
            px: { xs: 1.5, sm: 2, md: 2.5 },
            pt: { xs: 1.5, md: 2 },
            pb: { xs: 2, md: 2.5 },
          }}
        >
          {tabPanel(
            "overview",
            <LinkDashboard
              linkId={linkId}
              enableRealtime={false}
              compact={false}
              dateFrom={filters.dateFrom}
              dateTo={filters.dateTo}
              excludeBots={filters.excludeBots}
            />,
          )}

          {tabPanel(
            "origin",
            <OriginAnalysis
              linkId={linkId}
              dateFrom={filters.dateFrom}
              dateTo={filters.dateTo}
              excludeBots={filters.excludeBots}
              subTabIndex={filters.originSubTab}
              onSubTabChange={filters.setOriginSubTab}
            />,
          )}

          {tabPanel(
            "places",
            <GeographicAnalysis
              linkId={linkId}
              enableRealtime={false}
              dateFrom={filters.dateFrom}
              dateTo={filters.dateTo}
              excludeBots={filters.excludeBots}
              continent={filters.continent}
              onContinentChange={filters.setContinent}
              subTabIndex={filters.geoSubTab}
              onSubTabChange={filters.setGeoSubTab}
            />,
          )}

          {tabPanel(
            "audience",
            <AudienceAnalysis
              linkId={linkId}
              dateFrom={filters.dateFrom}
              dateTo={filters.dateTo}
              excludeBots={filters.excludeBots}
              subTabIndex={filters.audienceSubTab}
              onSubTabChange={filters.setAudienceSubTab}
            />,
          )}

          {tabPanel(
            "when",
            <TemporalAnalysis
              linkId={linkId}
              enableRealtime={false}
              dateFrom={filters.dateFrom}
              dateTo={filters.dateTo}
              excludeBots={filters.excludeBots}
              segment={filters.segment}
              onSegmentChange={filters.setSegment}
              subTabIndex={filters.temporalSubTab}
              onSubTabChange={filters.setTemporalSubTab}
            />,
          )}

          {tabPanel(
            "clicks",
            <ClicksTable
              linkId={linkId}
              dateFrom={filters.dateFrom}
              dateTo={filters.dateTo}
              excludeBots={filters.excludeBots}
            />,
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default LinkAnalyticsTabsOptimized;
