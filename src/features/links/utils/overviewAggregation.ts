import type { BatchMetaResponse, SparklinePoint } from "@/types";

/**
 * Merges every link's per-day sparkline into a single account-wide trend.
 *
 * `useLinksMeta` returns one `sparkline` window per link id (its length
 * depends on the `days` the batch endpoint was called with — 7 by default);
 * this sums clicks across links for each date so the account overview can
 * show one aggregated curve instead of a flat number. Dates missing from
 * every link are simply absent from the result — callers should treat gaps
 * as "no data that day", not zero.
 *
 * @param meta - batch link metadata keyed by link id (`useLinksMeta` response).
 * @returns aggregated `{ date, clicks }[]`, sorted ascending by date.
 */
export function aggregateSparklines(meta: BatchMetaResponse): SparklinePoint[] {
  const totalsByDate = new Map<string, number>();

  for (const linkMeta of Object.values(meta)) {
    for (const point of linkMeta.sparkline ?? []) {
      totalsByDate.set(
        point.date,
        (totalsByDate.get(point.date) ?? 0) + point.clicks,
      );
    }
  }

  return Array.from(totalsByDate.entries())
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, clicks]) => ({ date, clicks }));
}
