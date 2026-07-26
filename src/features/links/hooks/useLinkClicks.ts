"use client";
import { useCallback, useEffect, useRef, useState } from "react";

import { linkService } from "@/services";

import type {
  LinkClickItem,
  LinkClicksListParams,
  LinkClicksMeta,
} from "../types/click";
import { useAnalyticsPanelActive } from "@/features/analytics/context/AnalyticsPanelActiveContext";

interface UseLinkClicksOptions {
  linkId: string;
  initialPage?: number;
  initialPerPage?: number;
  /** ISO datetime string — filters clicks with `created_at >= dateFrom`. */
  dateFrom?: string | null;
  /** ISO datetime string — filters clicks with `created_at <= dateTo`. */
  dateTo?: string | null;
  /** When true, excludes bot clicks from the result. */
  excludeBots?: boolean;
}

interface UseLinkClicksReturn {
  items: LinkClickItem[];
  meta: LinkClicksMeta | null;
  loading: boolean;
  error: string | null;
  params: Required<
    Pick<
      LinkClicksListParams,
      "page" | "per_page" | "search" | "sort_by" | "sort_dir"
    >
  >;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortDir: "asc" | "desc") => void;
  refresh: () => Promise<void>;
}

const DEFAULT_PER_PAGE = 25;

/**
 * Paginated, sortable, searchable list of click events for a single link.
 *
 * @param options.linkId - canonical link id; the hook stays idle when empty
 * @param options.initialPage - 1-based page (default `1`)
 * @param options.initialPerPage - page size (default `25`)
 * @param options.dateFrom - ISO datetime string; filters `created_at >= dateFrom`
 * @param options.dateTo - ISO datetime string; filters `created_at <= dateTo`
 * @param options.excludeBots - when true, excludes bot clicks from results
 * @returns items + meta + paging/sort controls (`setPage`, `setPerPage`, `setSearch`, `setSort`, `refresh`)
 *
 * @remarks
 * Endpoint: `GET /api/link/{id}/clicks-list` (via `linkService.getClicksList()`).
 * Uses local `useState`/`useEffect` (not TanStack Query) and a `reqId` ref to discard out-of-order responses.
 * Changing `search`, `perPage`, `dateFrom`, `dateTo`, or `excludeBots` resets `page` to 1.
 */
export function useLinkClicks({
  linkId,
  initialPage = 1,
  initialPerPage = DEFAULT_PER_PAGE,
  dateFrom,
  dateTo,
  excludeBots = false,
}: UseLinkClicksOptions): UseLinkClicksReturn {
  const panelActive = useAnalyticsPanelActive();

  const [items, setItems] = useState<LinkClickItem[]>([]);
  const [meta, setMeta] = useState<LinkClicksMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [search, setSearchState] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const reqIdRef = useRef(0);

  // Reset to page 1 whenever the external filter props change
  const prevDateFrom = useRef(dateFrom);
  const prevDateTo = useRef(dateTo);
  const prevExcludeBots = useRef(excludeBots);
  useEffect(() => {
    if (
      prevDateFrom.current !== dateFrom ||
      prevDateTo.current !== dateTo ||
      prevExcludeBots.current !== excludeBots
    ) {
      prevDateFrom.current = dateFrom;
      prevDateTo.current = dateTo;
      prevExcludeBots.current = excludeBots;
      setPage(1);
    }
  }, [dateFrom, dateTo, excludeBots]);

  const fetchClicks = useCallback(async () => {
    // Same rule as the TanStack analytics hooks: a tab sitting hidden behind
    // `display: none` must not re-request on every filter change. This hook
    // fetches by hand, so the gate is explicit here.
    if (!linkId || !panelActive) {
      return;
    }

    const reqId = ++reqIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const response = await linkService.getClicksList(linkId, {
        page,
        per_page: perPage,
        search: search || undefined,
        sort_by: sortBy,
        sort_dir: sortDir,
        date_from: dateFrom ?? undefined,
        date_to: dateTo ?? undefined,
        exclude_bots: excludeBots || undefined,
      });

      // Descarta resposta de request superada
      if (reqId !== reqIdRef.current) {
        return;
      }

      setItems(response.data || []);
      setMeta(response.meta || null);
    } catch (err) {
      if (reqId !== reqIdRef.current) {
        return;
      }

      // Developer-facing: `ClicksTable` renders a localized message instead.
      const message =
        err instanceof Error ? err.message : "Clicks request failed";
      setError(message);
      setItems([]);
      setMeta(null);
    } finally {
      if (reqId === reqIdRef.current) {
        setLoading(false);
      }
    }
  }, [
    linkId,
    page,
    perPage,
    search,
    sortBy,
    sortDir,
    dateFrom,
    dateTo,
    excludeBots,
    panelActive,
  ]);

  useEffect(() => {
    fetchClicks();
  }, [fetchClicks]);

  const setSearch = useCallback((next: string) => {
    setPage(1);
    setSearchState(next);
  }, []);

  const setSort = useCallback(
    (nextSortBy: string, nextSortDir: "asc" | "desc") => {
      setSortBy(nextSortBy);
      setSortDir(nextSortDir);
    },
    [],
  );

  const handleSetPerPage = useCallback((next: number) => {
    setPage(1);
    setPerPage(next);
  }, []);

  return {
    items,
    meta,
    loading,
    error,
    params: {
      page,
      per_page: perPage,
      search,
      sort_by: sortBy,
      sort_dir: sortDir,
    },
    setPage,
    setPerPage: handleSetPerPage,
    setSearch,
    setSort,
    refresh: fetchClicks,
  };
}

export default useLinkClicks;
