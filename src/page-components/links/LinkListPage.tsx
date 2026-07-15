"use client";

import { BarChart3, HelpCircle } from "lucide-react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { LinkMetrics } from "@/features/links/components/LinkMetrics";
import {
  LinksBrowseSection,
  LinksListSectionHeading,
  LinksQuickCreate,
  LINKS_PAGE_SIZE,
} from "@/features/links/components/list";
import { useLinksTour } from "@/features/links/onboarding/useLinksTour";
import { useDemoLinkSeeding } from "@/features/links/hooks/useDemoLinkSeeding";
import {
  useLinks,
  useLinksSearch,
  useDeleteLink,
} from "@/features/links/hooks/useLinks";
import { useNewlyCreatedLinkHighlight } from "@/features/links/hooks/useNewlyCreatedLinkHighlight";
import { useLinksMeta } from "@/features/links/hooks/useLinksMeta";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import { useResponsive } from "@/lib/theme";
import { ResponsiveContainer } from "@/shared/ui/base";
import { LinkListSkeleton } from "@/shared/ui/feedback/skeletons";

import AuthGuardRedirect from "../../lib/auth/AuthGuardRedirect";

import type { LinksMeta, LinksSearchParams } from "@/lib/query/keys";
import type { LinkResponse } from "@/types";

/** Server-supported status filter values (mirrors `LinksSearchParams["status"]` plus the "all" sentinel). */
type StatusFilterValue = "all" | "active" | "inactive" | "expired";

/** Server-supported sort values, after `trend`/`last_activity` were dropped (no backend equivalent). */
type SortByValue = "created_at" | "clicks";

/** Fallback pagination metadata shown before the first server response resolves. */
function buildPlaceholderMeta(page: number): LinksMeta {
  return {
    current_page: page,
    per_page: LINKS_PAGE_SIZE,
    total: 0,
    last_page: 1,
  };
}

function LinkListPage() {
  const { isMobile } = useResponsive();
  const { t } = useTranslation("links");

  // `useLinks()` (full, unfiltered list) stays: it's the only source for the
  // account-wide overview metrics, the demo-seeding poll and the tour's
  // readiness gate — none of which can be answered from a single paginated
  // page of results. The browse list below is fed by `useLinksSearch` instead.
  const { links, loading } = useLinks();
  const { isSeedingDemo } = useDemoLinkSeeding(links, loading);

  // O tour é atrelado à chegada do link de exemplo, não só ao fim do loading:
  // dois dos cinco passos ("veja o analytics", "ações do link") apontam para
  // âncoras que vivem *dentro* de um card de link. Rodar antes do card existir
  // faria esses passos apontarem para o nada. Para um cadastro novo, o primeiro
  // card é justamente o link de exemplo — então o tour espera o seed terminar e
  // abre em cima dele.
  const tour = useLinksTour({
    ready: !loading && !isSeedingDemo && links.length > 0,
  });
  const { mutateAsync: deleteLinkMutation } = useDeleteLink();
  const deleteLink = (id: string): Promise<void> =>
    deleteLinkMutation(id).then(() => undefined);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [tagFilter, setTagFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortByValue>("created_at");
  const [page, setPage] = useState(1);

  // O link de exemplo não conta na visão geral da conta. Ele traz 1.247 cliques
  // sintéticos: somados aqui, dominavam "Total de cliques" e "Média por link" e
  // faziam os números da conta descreverem dados que o usuário nunca gerou. Ele
  // segue aparecendo na lista (com o selo "Exemplo") — só não entra na conta.
  // Mesma regra que o backend já aplica nas métricas dele (`is_demo = false`).
  const realLinks = useMemo(
    () => links.filter((link) => !link.is_demo),
    [links],
  );

  const hasActiveFilters =
    Boolean(searchTerm) || statusFilter !== "all" || tagFilter !== null;

  const searchParams: LinksSearchParams = useMemo(
    () => ({
      page,
      perPage: LINKS_PAGE_SIZE,
      q: searchTerm || undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
      sort: sortBy,
      order: "desc",
    }),
    [page, searchTerm, statusFilter, sortBy],
  );

  const {
    data: searchResult,
    isLoading: searchLoading,
    isFetching: searchFetching,
  } = useLinksSearch(searchParams);

  const pageLinks = useMemo(() => searchResult?.data ?? [], [searchResult]);
  const paginationMeta = searchResult?.meta ?? buildPlaceholderMeta(page);

  // Filtro de tag: sem equivalente no contrato do servidor (YAGNI até um
  // consumidor precisar) — segue client-side, restrito à página atual já
  // paginada pelo backend. `paginationMeta.total` continua sendo a contagem
  // do servidor (sem o filtro de tag aplicado); é uma imprecisão aceita
  // enquanto tags não entram na busca server-side.
  const visibleLinks = useMemo(
    () =>
      tagFilter === null
        ? pageLinks
        : pageLinks.filter(
            (link) => link.tags?.some((tag) => tag.id === tagFilter) ?? false,
          ),
    [pageLinks, tagFilter],
  );

  const linkIds = useMemo(
    () => visibleLinks.map((l) => String(l.id)),
    [visibleLinks],
  );
  const { meta: linkMeta } = useLinksMeta(linkIds);

  const { highlightedLinkId, highlightLink } =
    useNewlyCreatedLinkHighlight(linkIds);

  // Volta para a página 1 sempre que busca/filtro/ordenação mudam (o resultado
  // é outro conjunto) ou quando um link recém-criado precisa ser revelado —
  // `handleLinkCreated` já força `sortBy` para "created_at", mas se o usuário já
  // estava nessa ordenação (ordenação inalterada) só a mudança de
  // `highlightedLinkId` dispara o reset.
  useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter, tagFilter, sortBy, highlightedLinkId]);

  // Sem isto, apagar o último link de uma página final deixaria `page` maior
  // que `meta.last_page` e a lista renderizaria vazia até uma ação manual.
  useEffect(() => {
    if (searchResult && page > searchResult.meta.last_page) {
      setPage(Math.max(1, searchResult.meta.last_page));
    }
  }, [searchResult, page]);

  const handleLinkCreated = useCallback(
    (link: LinkResponse) => {
      setSortBy("created_at");
      highlightLink(link);
    },
    [highlightLink],
  );

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTagFilter(null);
    setSortBy("created_at");
  };

  if (loading) {
    return (
      <AuthGuardRedirect
        auth={["user", "admin"]}
        fallback={<LinkListSkeleton isMobile={isMobile} count={6} />}
      >
        <LinkListSkeleton isMobile={isMobile} count={6} />
      </AuthGuardRedirect>
    );
  }

  return (
    <AuthGuardRedirect
      auth={["user", "admin"]}
      fallback={<LinkListSkeleton isMobile={isMobile} count={6} />}
    >
      {/* Cap acima do default (1440): com o grid de 2 colunas a largura extra
          vira aproveitamento real, não linhas quilométricas. */}
      <ResponsiveContainer variant="page" sx={{ maxWidth: 1600 }}>
        <Stack spacing={{ xs: 2.5, sm: 3 }} component="section">
          <Box component="div">
            <LinksListSectionHeading
              icon={<BarChart3 {...ICON_MD} />}
              title={t("list.heading")}
              description={t("list.pageSubtitle")}
              titleVariant="page"
              sx={{ mb: { xs: 1.5, sm: 2 } }}
              action={
                <Button
                  size="small"
                  variant="text"
                  startIcon={<HelpCircle width={16} height={16} />}
                  onClick={tour.start}
                >
                  {t("list.onboarding.help")}
                </Button>
              }
            />
            {/* Gate em `links`, não em `realLinks`: o passo 2 do tour aponta para
                a âncora `overview`, e um cadastro novo só tem o link de exemplo.
                Gatilhar por `realLinks` esconderia o bloco justo para quem está
                fazendo o tour, e o passo apontaria para o nada. Quem só tem o
                exemplo vê zeros aqui — o que é verdade: ele não criou link nenhum
                nem recebeu clique real. */}
            {links.length > 0 ? (
              <Box data-tour="overview" sx={{ mt: { xs: 2, sm: 2.5 } }}>
                <Typography
                  variant="overline"
                  component="h2"
                  sx={{
                    display: "block",
                    color: "text.secondary",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    mb: { xs: 1, sm: 1.25 },
                  }}
                >
                  {t("list.sections.overview")}
                </Typography>
                <LinkMetrics linksData={realLinks} showTitle={false} />
              </Box>
            ) : null}
          </Box>

          <Box data-tour="quick-create">
            <LinksQuickCreate onLinkCreated={handleLinkCreated} />
          </Box>

          <Box data-tour="links-list">
            <LinksBrowseSection
              highlightedLinkId={highlightedLinkId}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusChange={(value) =>
                setStatusFilter(value as StatusFilterValue)
              }
              sortBy={sortBy}
              onSortChange={(value) => setSortBy(value as SortByValue)}
              tagFilter={tagFilter}
              onTagFilterChange={setTagFilter}
              links={visibleLinks}
              paginationMeta={paginationMeta}
              page={page}
              onPageChange={setPage}
              linkMeta={linkMeta}
              loading={searchLoading}
              isFetching={searchFetching}
              isMobile={isMobile}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={handleClearFilters}
              onDelete={deleteLink}
              isSeedingDemo={isSeedingDemo}
            />
          </Box>
        </Stack>
      </ResponsiveContainer>
    </AuthGuardRedirect>
  );
}

export default LinkListPage;
