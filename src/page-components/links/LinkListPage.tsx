"use client";

import { BarChart3, HelpCircle } from "lucide-react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { LinkMetrics } from "@/features/links/components/LinkMetrics";
import {
  LinksBrowseSection,
  LinksListSectionHeading,
  LinksQuickCreate,
} from "@/features/links/components/list";
import { useLinksTour } from "@/features/links/onboarding/useLinksTour";
import { useDemoLinkSeeding } from "@/features/links/hooks/useDemoLinkSeeding";
import { useLinks, useDeleteLink } from "@/features/links/hooks/useLinks";
import { useNewlyCreatedLinkHighlight } from "@/features/links/hooks/useNewlyCreatedLinkHighlight";
import { useLinksMeta } from "@/features/links/hooks/useLinksMeta";
import { getLinkStatus } from "@/features/links/utils/linkStatus";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import { useResponsive } from "@/lib/theme";
import { ResponsiveContainer } from "@/shared/ui/base";
import { LinkListSkeleton } from "@/shared/ui/feedback/skeletons";

import AuthGuardRedirect from "../../lib/auth/AuthGuardRedirect";

import type { LinkResponse } from "@/types";

function LinkListPage() {
  const { isMobile } = useResponsive();
  const { t } = useTranslation("links");
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("created_at");

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

  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      const matchesSearch =
        link.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.original_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (link.slug || link.custom_slug)
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const status = getLinkStatus(link);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && status === "active") ||
        (statusFilter === "inactive" && status === "inactive") ||
        (statusFilter === "scheduled" && status === "scheduled") ||
        (statusFilter === "expired" && status === "expired");

      const matchesTag =
        tagFilter === null ||
        (link.tags?.some((tag) => tag.id === tagFilter) ?? false);

      return matchesSearch && matchesStatus && matchesTag;
    });
  }, [links, searchTerm, statusFilter, tagFilter]);

  const linkIds = useMemo(
    () => filteredLinks.map((l) => String(l.id)),
    [filteredLinks],
  );
  const { meta } = useLinksMeta(linkIds);

  const sortedLinks = useMemo(() => {
    const sorted = [...filteredLinks];
    switch (sortBy) {
      case "clicks":
        return sorted.sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
      case "trend":
        return sorted.sort(
          (a, b) =>
            (meta[String(b.id)]?.trend?.percent_change ?? 0) -
            (meta[String(a.id)]?.trend?.percent_change ?? 0),
        );
      case "last_activity":
        return sorted.sort((a, b) => {
          const aLast = meta[String(a.id)]?.trend?.last_click_at;
          const bLast = meta[String(b.id)]?.trend?.last_click_at;

          if (!aLast && !bLast) {
            return 0;
          }

          if (!aLast) {
            return 1;
          }

          if (!bLast) {
            return -1;
          }

          return new Date(bLast).getTime() - new Date(aLast).getTime();
        });
      default:
        return sorted.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
    }
  }, [filteredLinks, sortBy, meta]);

  const visibleLinkIds = useMemo(
    () => sortedLinks.map((l) => String(l.id)),
    [sortedLinks],
  );
  const { highlightedLinkId, highlightLink } =
    useNewlyCreatedLinkHighlight(visibleLinkIds);

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
              onStatusChange={setStatusFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              tagFilter={tagFilter}
              onTagFilterChange={setTagFilter}
              sortedLinks={sortedLinks}
              meta={meta}
              loading={loading}
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
