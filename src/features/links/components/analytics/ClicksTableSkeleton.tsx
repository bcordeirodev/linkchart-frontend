"use client";

import { Box, Skeleton, Stack } from "@mui/material";

interface ColSkeletonConfig {
  /** Proportional flex value, derived from the column `size` config. */
  flex: number;
  /** Width of the header label skeleton (percentage string). */
  headerW: string;
  /** Cell anatomy type — drives which inner skeleton shapes are rendered. */
  type: "twoLine" | "chipLine" | "chip" | "text";
  /** Primary (top) line / chip width. */
  l1: string;
  /** Secondary (bottom) caption width — only for twoLine / chipLine. */
  l2?: string;
}

/**
 * Column-aware skeleton that mirrors the anatomy of ClicksTable before data
 * arrives.  Each column uses its real `size` proportion and renders the same
 * inner structure as the live cell (two-line text, chip + caption, etc.).
 */
export function ClicksTableSkeleton({ isMobile }: { isMobile: boolean }) {
  /** Proportional flex values are derived from each column's `size` config. */
  const cols: ColSkeletonConfig[] = [
    { flex: 2.0, headerW: "62%", type: "twoLine", l1: "80%", l2: "52%" }, // Date
    { flex: 2.4, headerW: "68%", type: "twoLine", l1: "88%", l2: "38%" }, // Location
    { flex: 1.5, headerW: "55%", type: "chipLine", l1: "68%", l2: "48%" }, // Device
    { flex: 1.6, headerW: "62%", type: "text", l1: "72%" }, // Browser
    { flex: 1.4, headerW: "50%", type: "chip", l1: "78%" }, // Source
    { flex: 2.0, headerW: "65%", type: "text", l1: "82%" }, // Referer
    { flex: 1.4, headerW: "60%", type: "text", l1: "65%" }, // Social Platform
    { flex: 1.3, headerW: "55%", type: "chip", l1: "70%" }, // Quality
    { flex: 2.2, headerW: "52%", type: "twoLine", l1: "65%", l2: "45%" }, // UTM
  ];

  const tableContent = (
    <>
      {/* Column header row */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          px: 2,
          py: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        {cols.map((col, i) => (
          <Box key={i} sx={{ flex: col.flex, minWidth: 0 }}>
            <Skeleton
              variant="rounded"
              animation="wave"
              height={13}
              width={col.headerW}
            />
          </Box>
        ))}
      </Box>

      {/* Data rows — opacity fades to hint at pagination boundary */}
      {Array.from({ length: 8 }).map((_, row) => (
        <Box
          key={row}
          sx={{
            display: "flex",
            gap: 1.5,
            px: 2,
            py: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
            opacity: Math.max(0.18, 1 - row * 0.1),
            alignItems: "flex-start",
          }}
        >
          {cols.map((col, c) => (
            <Box key={c} sx={{ flex: col.flex, minWidth: 0 }}>
              {col.type === "twoLine" && (
                <Stack spacing={0.6}>
                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    height={14}
                    width={col.l1}
                  />
                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    height={11}
                    width={col.l2}
                  />
                </Stack>
              )}
              {col.type === "chipLine" && (
                <Stack spacing={0.6}>
                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    height={22}
                    width={col.l1}
                    sx={{ borderRadius: "12px" }}
                  />
                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    height={11}
                    width={col.l2}
                  />
                </Stack>
              )}
              {col.type === "chip" && (
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  height={22}
                  width={col.l1}
                  sx={{ borderRadius: "12px" }}
                />
              )}
              {col.type === "text" && (
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  height={14}
                  width={col.l1}
                />
              )}
            </Box>
          ))}
        </Box>
      ))}
    </>
  );

  return (
    <Box>
      {/* Toolbar: search + optional date-range pickers */}
      <Stack direction="row" spacing={1} sx={{ mb: 1.5, px: 0.5 }}>
        <Skeleton
          variant="rounded"
          animation="wave"
          height={40}
          sx={{ flex: 2, borderRadius: 1.5 }}
        />
        {!isMobile && (
          <>
            <Skeleton
              variant="rounded"
              animation="wave"
              height={40}
              sx={{ width: 140, flexShrink: 0, borderRadius: 1.5 }}
            />
            <Skeleton
              variant="rounded"
              animation="wave"
              height={40}
              sx={{ width: 140, flexShrink: 0, borderRadius: 1.5 }}
            />
            <Skeleton
              variant="rounded"
              animation="wave"
              height={40}
              sx={{ width: 36, flexShrink: 0, borderRadius: 1.5 }}
            />
          </>
        )}
      </Stack>

      {/* Table body — horizontal scroll on all viewports when columns exceed container */}
      <Box sx={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <Box sx={{ minWidth: 600 }}>{tableContent}</Box>
      </Box>
    </Box>
  );
}
